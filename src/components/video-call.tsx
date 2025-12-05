
'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Mic, MicOff, PhoneOff, User as UserIcon, Video, VideoOff, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WebRTCManager } from '@/lib/webrtc';
import { useFirestore, useUser } from '@/firebase';

interface VideoCallProps {
  callId: string;
  contact: Partial<User>;
  isReceiving: boolean;
  onClose: () => void;
}

export function VideoCall({ callId, contact, isReceiving, onClose }: VideoCallProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user: currentUser } = useUser();

  const [webRTCManager, setWebRTCManager] = useState<WebRTCManager | null>(null);
  const [callStatus, setCallStatus] = useState(isReceiving ? 'Incoming call...' : 'Ringing...');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const ringingAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!currentUser || !firestore) return;

    const manager = new WebRTCManager(firestore, currentUser.uid, callId, 'video');
    setWebRTCManager(manager);
    
    const onLocalStream = (stream: MediaStream) => {
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
    };

    const onRemoteStream = (stream: MediaStream) => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
        }
    };
    
    const onCallStatusChange = (status: string) => {
      setCallStatus(status);
       if (status === 'Connected' || status === 'Closed') {
          if (ringingAudioRef.current) {
              ringingAudioRef.current.pause();
          }
      }
    };
    
    manager.on('localStream', onLocalStream);
    manager.on('remoteStream', onRemoteStream);
    manager.on('callStatus', onCallStatusChange);

    if (isReceiving) {
      // Callee logic
      ringingAudioRef.current?.play();
    } else {
      // Caller logic
      manager.startCall();
      ringingAudioRef.current?.play();
    }

    return () => {
      manager.hangUp();
      manager.off('localStream', onLocalStream);
      manager.off('remoteStream', onRemoteStream);
      manager.off('callStatus', onCallStatusChange);
    };
  }, [callId, currentUser, firestore, isReceiving]);

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

  const toggleCamera = () => {
    webRTCManager?.toggleCamera(!isCameraOff);
    setIsCameraOff(!isCameraOff);
  };
  
  if (!webRTCManager) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
      <audio ref={ringingAudioRef} src="https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg" loop className="hidden" />

      {/* Remote user video */}
      <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-white">
        <div className="self-start w-full flex justify-between items-start">
            <div className='flex flex-col items-center gap-2'>
                <h1 className="text-4xl font-bold">{contact.name}</h1>
                <p className="text-lg text-muted-foreground">{callStatus}</p>
            </div>
             {/* Local user video */}
            <div className="h-40 w-32 rounded-lg overflow-hidden border-2 border-white/30 relative">
              <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
              {isCameraOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                   <VideoOff className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
        </div>

        <div className="flex items-center gap-6 rounded-full p-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/20 text-white hover:bg-white/30"
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/20 text-white hover:bg-white/30"
            onClick={toggleCamera}
          >
            {isCameraOff ? <VideoOff className="h-7 w-7" /> : <Video className="h-7 w-7" />}
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
