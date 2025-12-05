
'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Mic, MicOff, PhoneOff, User as UserIcon, Video, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface VideoCallProps {
  contact: Partial<User>;
  onClose: () => void;
}

export function VideoCall({ contact, onClose }: VideoCallProps) {
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callStatus, setCallStatus] = useState('Ringing...');
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getMediaPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        streamRef.current = stream;
        setHasPermissions(true);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Simulate call connection
        setTimeout(() => setCallStatus('00:05'), 2000); 
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasPermissions(false);
        toast({
          variant: 'destructive',
          title: 'Permissions Denied',
          description: 'Please enable microphone and camera permissions to make calls.',
        });
        onClose();
      }
    };

    getMediaPermissions();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast, onClose]);

  useEffect(() => {
    if (callStatus.includes(':')) {
      const timer = setInterval(() => {
        setCallStatus(prevStatus => {
          const parts = prevStatus.split(':').map(Number);
          const newTime = parts[0] * 60 + parts[1] + 1;
          const minutes = String(Math.floor(newTime / 60)).padStart(2, '0');
          const seconds = String(newTime % 60).padStart(2, '0');
          return `${minutes}:${seconds}`;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [callStatus]);

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  const handleHangUp = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
      <div className="relative flex h-full w-full flex-col items-center justify-center space-y-4 text-white">
        
        {/* Remote user video (placeholder) */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 rounded-full bg-white/10 flex items-center justify-center">
                <Avatar className="h-32 w-32 border-4 border-white/50">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback>
                    <UserIcon className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
            </div>
        </div>

        {/* Local user video */}
        <div className="absolute top-4 right-4 h-40 w-32 rounded-lg overflow-hidden border-2 border-white/30">
          <video ref={localVideoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
          {isCameraOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
               <VideoOff className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
        
        <div className='absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2'>
            <h1 className="text-4xl font-bold">{contact.name}</h1>
            <p className="text-lg text-muted-foreground">{callStatus}</p>
        </div>


        <div className="absolute bottom-12 flex items-center gap-6 rounded-full p-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/20 text-white hover:bg-white/30"
            onClick={toggleMute}
            disabled={!hasPermissions}
          >
            {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
          </Button>
           <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/20 text-white hover:bg-white/30"
            onClick={toggleCamera}
            disabled={!hasPermissions}
          >
            {isCameraOff ? <VideoOff className="h-7 w-7" /> : <Video className="h-7 w-7" />}
          </Button>
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
