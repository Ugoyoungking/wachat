
'use client';

import { useState, useRef, useEffect, RefObject } from 'react';
import { User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Mic, MicOff, PhoneOff, User as UserIcon, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WebRTCManager } from '@/lib/webrtc';
import { useUser, useFirestore } from '@/firebase';

interface AudioCallProps {
  callId: string;
  contact: Partial<User>;
  isReceiving: boolean;
  onClose: () => void;
  ringingAudioRef: RefObject<HTMLAudioElement>;
}

export function AudioCall({ callId, contact, isReceiving, onClose, ringingAudioRef }: AudioCallProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user: currentUser } = useUser();

  const [webRTCManager, setWebRTCManager] = useState<WebRTCManager | null>(null);
  const [callStatus, setCallStatus] = useState(isReceiving ? 'Incoming call...' : 'Ringing...');
  const [isMuted, setIsMuted] = useState(false);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!currentUser || !firestore) return;
    
    const manager = new WebRTCManager(firestore, currentUser.uid, callId, 'audio');
    setWebRTCManager(manager);

    const onRemoteStream = (stream: MediaStream) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.play();
      }
    };
    
    const onLocalStream = (stream: MediaStream) => {
        if(localAudioRef.current) {
            localAudioRef.current.srcObject = stream;
        }
    }

    const onCallStatusChange = (status: string) => {
      setCallStatus(status);
      if (status === 'Connected' || status === 'Closed') {
          if (ringingAudioRef.current) {
              ringingAudioRef.current.pause();
          }
      }
    };

    manager.on('remoteStream', onRemoteStream);
    manager.on('localStream', onLocalStream);
    manager.on('callStatus', onCallStatusChange);

    if (isReceiving) {
      // Callee waits for offer
    } else {
      // Caller initiates the call
      manager.startCall();
    }

    return () => {
      manager.hangUp();
      manager.off('remoteStream', onRemoteStream);
      manager.off('localStream', onLocalStream);
      manager.off('callStatus', onCallStatusChange);
    };

  }, [callId, currentUser, firestore, isReceiving, ringingAudioRef]);

   // Simulate call timer
   useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callStatus === 'Connected') {
      let seconds = 0;
      timer = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        setCallStatus(`${mins}:${secs}`);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  const handleAcceptCall = () => {
    webRTCManager?.answerCall();
    if(ringingAudioRef.current) {
        ringingAudioRef.current.pause();
    }
  };

  const handleHangUp = () => {
    webRTCManager?.hangUp();
    onClose();
  };

  const toggleMute = () => {
    webRTCManager?.toggleMute(!isMuted);
    setIsMuted(!isMuted);
  };
  
  if (!webRTCManager) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <audio ref={remoteAudioRef} autoPlay className="hidden" />
      <audio ref={localAudioRef} autoPlay muted className="hidden" />

      <div className="relative flex h-full w-full flex-col items-center justify-center space-y-6 text-white">
        <p className="text-lg text-muted-foreground">{callStatus}</p>

        <Avatar className="h-32 w-32 border-4 border-white">
          <AvatarImage src={contact.avatar} />
          <AvatarFallback>
            <UserIcon className="h-16 w-16" />
          </AvatarFallback>
        </Avatar>
        
        <h1 className="text-4xl font-bold">{contact.name}</h1>

        <div className="absolute bottom-12 flex items-center gap-6 rounded-full p-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/20 text-white hover:bg-white/30"
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
          </Button>
          
          {isReceiving && callStatus === 'Incoming call...' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 rounded-full bg-green-500 text-white hover:bg-green-600"
              onClick={handleAcceptCall}
            >
              <Phone className="h-7 w-7" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80"
            onClick={handleHangUp}
          >
            <PhoneOff className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </div>
  );
}

    