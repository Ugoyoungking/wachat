
'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Mic, MicOff, PhoneOff, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioCallProps {
  contact: Partial<User>;
  onClose: () => void;
  ringingAudioRef: React.RefObject<HTMLAudioElement>;
}

export function AudioCall({ contact, onClose, ringingAudioRef }: AudioCallProps) {
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState('Ringing...');
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const getMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        setHasMicPermission(true);
        
        // In a real app, you'd attach this stream to a WebRTC peer connection

        // Simulate call connection
        const connectTimer = setTimeout(() => setCallStatus('00:05'), 5000); 
        
        return () => clearTimeout(connectTimer);
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasMicPermission(false);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings to make calls.',
        });
        onClose();
      }
    };

    getMicPermission();
    
    return () => {
      if (ringingAudioRef.current) {
        ringingAudioRef.current.pause();
        ringingAudioRef.current.currentTime = 0;
      }
    };
  }, [toast, onClose, ringingAudioRef]);

  // Simulate call timer and manage ringing sound
  useEffect(() => {
    if (callStatus.includes(':')) { // Call is connected
      if (ringingAudioRef.current) {
        ringingAudioRef.current.pause();
        ringingAudioRef.current.currentTime = 0;
      }
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
  }, [callStatus, ringingAudioRef]);

  const toggleMute = () => {
    // In a real implementation, you'd control the audio track's `enabled` property
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
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
            disabled={hasMicPermission === false}
          >
            {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80"
            onClick={onClose}
          >
            <PhoneOff className="h-7 w-7" />
          </Button>
        </div>
      </div>
      {/* Hidden audio element for local audio stream */}
      <audio ref={localAudioRef} autoPlay playsInline className="hidden" />
    </div>
  );
}
