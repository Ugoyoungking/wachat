
'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Mic, MicOff, PhoneOff, Video, VideoOff, Camera, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface VideoCallProps {
  contact: Partial<User>;
  onClose: () => void;
}

export function VideoCall({ contact, onClose }: VideoCallProps) {
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        // Request both video and audio
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // In a real WebRTC implementation, you would add the stream to the peer connection here.
        // e.g., stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Media Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings.',
        });
        onClose(); // Close the call UI if permissions are denied
      }
    };

    getCameraPermission();

    // Cleanup function to stop media tracks when component unmounts or call ends
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast, onClose]);

  const toggleMute = () => {
    // In a real implementation, you'd control the audio track's `enabled` property
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    // In a real implementation, you'd control the video track's `enabled` property
    setIsVideoOff(!isVideoOff);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative h-full w-full">
        {/* Remote Video (Placeholder) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white">
           <Avatar className="h-24 w-24">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback>
              <UserIcon className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <p className="mt-4 text-xl font-medium">Calling {contact.name}...</p>
          <p className="text-sm text-muted-foreground">Ringing</p>
          {/* This would be replaced by the remote video stream */}
           <video ref={remoteVideoRef} className="hidden h-full w-full object-cover" autoPlay />
        </div>

        {/* Local Video */}
        <div className={cn(
            "absolute bottom-6 right-6 h-48 w-36 overflow-hidden rounded-lg border-2 border-white bg-black transition-all",
            isVideoOff && 'hidden' // Hide if video is off
        )}>
          <video ref={localVideoRef} className="h-full w-full object-cover" autoPlay muted />
        </div>

        {/* Call Controls */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full bg-gray-800 bg-opacity-50 p-3">
          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-white/20 text-white hover:bg-white/30" onClick={toggleMute}>
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-white/20 text-white hover:bg-white/30" onClick={toggleVideo}>
            {isVideoOff ? <VideoOff /> : <Video />}
          </Button>
           <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80" onClick={onClose}>
            <PhoneOff />
          </Button>
        </div>
      </div>
    </div>
  );
}

    