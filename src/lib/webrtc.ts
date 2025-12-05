
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
  setDoc,
  CollectionReference,
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
  private callId: string;
  private currentUserId: string;
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

  constructor(firestore: Firestore, currentUserId: string, callId: string, callType: 'audio' | 'video') {
    this.firestore = firestore;
    this.currentUserId = currentUserId;
    this.callId = callId;
    this.callType = callType;

    this.pc = new RTCPeerConnection(ICE_SERVERS);
    this.callDocRef = doc(this.firestore, 'calls', this.callId);
    this.offerCandidatesCol = collection(this.callDocRef, 'offerCandidates');
    this.answerCandidatesCol = collection(this.callDocRef, 'answerCandidates');
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
    this.registerPeerConnectionListeners();
    await this.setupMediaDevices();

    const offerDescription = await this.pc.createOffer();
    await this.pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await updateDoc(this.callDocRef, { offer });

    const unsub = onSnapshot(this.callDocRef, (snapshot) => {
      const data = snapshot.data();
      if (!this.pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        this.pc.setRemoteDescription(answerDescription);
      }
    });
    this.unsubscribes.push(unsub);

    this.listenForIceCandidates(this.answerCandidatesCol);
    this.emit('callStatus', 'Ringing...');
  }
  
  async answerCall() {
    this.registerPeerConnectionListeners();
    await this.setupMediaDevices();
    
    const callSnap = await getDoc(this.callDocRef);
    if (callSnap.exists()) {
        const callData = callSnap.data();
        const offerDescription = new RTCSessionDescription(callData.offer);
        await this.pc.setRemoteDescription(offerDescription);

        const answerDescription = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };
        
        await updateDoc(this.callDocRef, { answer, status: 'answered' });

        this.listenForIceCandidates(this.offerCandidatesCol);
    }
  }


  async hangUp() {
    this.localStream?.getTracks().forEach(track => track.stop());
    this.remoteStream?.getTracks().forEach(track => track.stop());
    
    this.pc.close();
    this.unsubscribes.forEach(unsub => unsub());

    if (await getDoc(this.callDocRef)) {
      // You might want to remove candidates subcollections before deleting the doc
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
        if (event.candidate) {
            const candidatesCollection = this.pc.currentRemoteDescription?.type === 'offer'
              ? this.answerCandidatesCol
              : this.offerCandidatesCol;
            addDoc(candidatesCollection, event.candidate.toJSON());
        }
    };
    
    this.pc.oniceconnectionstatechange = () => {
        if (this.pc.iceConnectionState === 'connected') {
            this.emit('callStatus', 'Connected');
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
}
