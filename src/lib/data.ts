
import { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  lastSeen?: Timestamp | Date | string;
  status?: 'online' | 'offline';
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
  read: boolean;
  reactions?: { [emoji: string]: string[] }; // emoji: [userId, userId, ...]
};

export type Chat = {
  id: string;
  users: Partial<User>[]; // Users can be partial as we might not have all info
  userIds: string[];
  typing?: { [key: string]: boolean };
  lastMessage?: {
    text: string | null;
    timestamp: Timestamp | null;
  };
  unreadCount?: { [key: string]: number };
};
