
import { Timestamp } from "firebase/firestore";
export type User = {
  id: string;
  name: string;
  avatar: string;
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
  users: User[];
  userIds: string[];
  messages?: Message[];
};

const users: User[] = [
  { id: 'user1', name: 'Alice', avatar: 'avatar1', lastSeen: 'online' },
  { id: 'user2', name: 'Bob', avatar: 'avatar2', lastSeen: 'online' },
  { id: 'user3', name: 'Charlie', avatar: 'avatar3', lastSeen: '5m ago' },
  { id: 'user4', name: 'Diana', avatar: 'avatar4', lastSeen: '1h ago' },
  { id: 'user5', name: 'Eve', avatar: 'avatar5', lastSeen: 'yesterday' },
  { id: 'user6', name: 'Frank', avatar: 'avatar6', lastSeen: '2 days ago' },
];

export const currentUser: User = {
  id: 'currentUser', // This will be replaced by the authenticated user's ID
  name: 'John Doe',
  avatar: 'user-avatar',
};

// NOTE: The chats data is now for seeding/reference and is not used in the live app.
export const chats: Chat[] = [
  {
    id: 'chat1',
    userIds: [currentUser.id, users[0].id],
    users: [currentUser, users[0]],
    messages: [
      // Messages will be a subcollection in Firestore
    ],
  },
  {
    id: 'chat2',
    userIds: [currentUser.id, users[1].id],
    users: [currentUser, users[1]],
  },
];
