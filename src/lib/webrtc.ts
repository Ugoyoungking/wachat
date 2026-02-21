'use client';

import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDoc,
  Firestore,
  DocumentReference,
  Unsubscribe,
  CollectionReference,
  serverTimestamp,
} from 'firebase/firestore';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

type Events = 'localStream' | 'remoteStream' | 'callStatus';

export class WebRTCManager {
  private pc: RTCPeerConnection;
  private firestore: Firestore;
  private callDocRef: DocumentReference;
  private offerCandidatesCol: CollectionReference;
  private answerCandidatesCol: CollectionReference;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private unsubscribes: Unsubscribe[] = [];
  private eventListeners: { [key in Events]: Function[] } = {
    localStream: [],
    remoteStream: [],
    callStatus: [],
  };
  private callType: 'audio' | 'video';
  private role: 'caller' | 'callee' | null = null;
  private closed = false;

  constructor(firestore: Firestore, currentUserId: string, callId: string, callType: 'audio' | 'video') {
    this.firestore = firestore;
    this.callType = callType;

    this.pc = new RTCPeerConnection(ICE_SERVERS);
    this.callDocRef = doc(this.firestore, 'calls', callId);
    this.offerCandidatesCol = collection(this.callDocRef, 'offerCandidates');
    this.answerCandidatesCol = collection(this.callDocRef, 'answerCandidates');

    // keep arg to avoid API change for existing call sites
    void currentUserId;
  }

  on(event: Events, callback: Function) {
    this.eventListeners[event].push(callback);
  }

  off(event: Events, callback: Function) {
    this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
  }

  private emit(event: Events, data: any) {
    this.eventListeners[event].forEach(cb => cb(data));
  }

  async startCall() {
    this.role = 'caller';
    this.registerPeerConnectionListeners();
    await this.setupMediaDevices();

    const offerDescription = await this.pc.createOffer();
    await this.pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await updateDoc(this.callDocRef, {
      offer,
      status: 'ringing',
      updatedAt: serverTimestamp(),
    });

    const unsub = onSnapshot(this.callDocRef, (snapshot) => {
      if (!snapshot.exists()) {
        this.safeClose('Call ended');
        return;
      }

      const data = snapshot.data();
      if (!this.pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        this.pc.setRemoteDescription(answerDescription);
      }

      if (data?.status === 'ended') {
        this.safeClose('Call ended');
      }
    });
    this.unsubscribes.push(unsub);

    this.listenForIceCandidates(this.answerCandidatesCol);
    this.emit('callStatus', 'Ringing...');
  }
  
  async answerCall() {
    this.role = 'callee';
    this.registerPeerConnectionListeners();
    await this.setupMediaDevices();
    
    const callSnap = await getDoc(this.callDocRef);
    if (!callSnap.exists()) {
      this.emit('callStatus', 'Call unavailable');
      return;
    }

    const callData = callSnap.data();
    if (!callData.offer) {
      this.emit('callStatus', 'Call unavailable');
      return;
    }

    const offerDescription = new RTCSessionDescription(callData.offer);
    await this.pc.setRemoteDescription(offerDescription);

    const answerDescription = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };
    
    await updateDoc(this.callDocRef, { answer, status: 'answered', updatedAt: serverTimestamp() });

    this.listenForIceCandidates(this.offerCandidatesCol);
  }


  async hangUp() {
    if (this.closed) return;
    this.closed = true;

    this.localStream?.getTracks().forEach(track => track.stop());
    this.remoteStream?.getTracks().forEach(track => track.stop());
    this.unsubscribes.forEach(unsub => unsub());
    this.pc.close();

    const snap = await getDoc(this.callDocRef);
    if (snap.exists()) {
      await updateDoc(this.callDocRef, { status: 'ended', updatedAt: serverTimestamp() });
      await deleteDoc(this.callDocRef);
    }
    
    this.emit('callStatus', 'Closed');
  }

  toggleMute(isMuted: boolean) {
    this.localStream?.getAudioTracks().forEach(track => {
      track.enabled = !isMuted;
    });
  }

  toggleCamera(isCameraOff: boolean) {
    this.localStream?.getVideoTracks().forEach(track => {
      track.enabled = !isCameraOff;
    });
  }
  
  private async setupMediaDevices() {
    const constraints = this.callType === 'video' 
      ? { video: true, audio: true }
      : { video: false, audio: true };
      
    this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
    this.emit('localStream', this.localStream);

    this.localStream.getTracks().forEach(track => {
      this.pc.addTrack(track, this.localStream!);
    });
  }

  private registerPeerConnectionListeners() {
    this.pc.onicecandidate = event => {
      if (!event.candidate || !this.role) return;
      const candidatesCollection = this.role === 'caller'
        ? this.offerCandidatesCol
        : this.answerCandidatesCol;
      addDoc(candidatesCollection, event.candidate.toJSON());
    };
    
    this.pc.oniceconnectionstatechange = () => {
      if (this.pc.iceConnectionState === 'connected') {
        this.emit('callStatus', 'Connected');
      }

      if (['failed', 'disconnected', 'closed'].includes(this.pc.iceConnectionState)) {
        this.emit('callStatus', 'Connection lost');
      }
    };

    this.pc.ontrack = event => {
      this.remoteStream = event.streams[0];
      this.emit('remoteStream', this.remoteStream);
    };
  }
  
  private listenForIceCandidates(candidatesCol: CollectionReference) {
    const unsub = onSnapshot(candidatesCol, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          this.pc.addIceCandidate(candidate);
        }
      });
    });
    this.unsubscribes.push(unsub);
  }

  private safeClose(status: string) {
    if (this.closed) return;
    this.closed = true;
    this.localStream?.getTracks().forEach(track => track.stop());
    this.remoteStream?.getTracks().forEach(track => track.stop());
    this.unsubscribes.forEach(unsub => unsub());
    this.pc.close();
    this.emit('callStatus', status);
  }
}
