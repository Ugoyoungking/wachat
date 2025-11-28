
import { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  lastSeen?: string;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
};

export type Chat = {
  id: string;
  users: Partial<User>[]; // Users can be partial as we might not have all info
  userIds: string[];
  messages?: Message[];
};
