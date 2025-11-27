import { PlaceHolderImages } from './placeholder-images';

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
  timestamp: string;
};

export type Chat = {
  id: string;
  users: User[];
  messages: Message[];
};

const users: User[] = [
  { id: 'user1', name: 'Alice', avatar: PlaceHolderImages.find(p => p.id === 'avatar1')?.imageUrl || '', lastSeen: 'online' },
  { id: 'user2', name: 'Bob', avatar: PlaceHolderImages.find(p => p.id === 'avatar2')?.imageUrl || '', lastSeen: 'online' },
  { id: 'user3', name: 'Charlie', avatar: PlaceHolderImages.find(p => p.id === 'avatar3')?.imageUrl || '', lastSeen: '5m ago' },
  { id: 'user4', name: 'Diana', avatar: PlaceHolderImages.find(p => p.id === 'avatar4')?.imageUrl || '', lastSeen: '1h ago' },
  { id: 'user5', name: 'Eve', avatar: PlaceHolderImages.find(p => p.id === 'avatar5')?.imageUrl || '', lastSeen: 'yesterday' },
  { id: 'user6', name: 'Frank', avatar: PlaceHolderImages.find(p => p.id === 'avatar6')?.imageUrl || '', lastSeen: '2 days ago' },
];

export const currentUser: User = {
  id: 'currentUser',
  name: 'John Doe',
  avatar: PlaceHolderImages.find(p => p.id === 'user-avatar')?.imageUrl || '',
};

export const chats: Chat[] = [
  {
    id: 'chat1',
    users: [currentUser, users[0]],
    messages: [
      { id: 'msg1', senderId: 'user1', text: 'Hey, how is it going?', timestamp: '10:30 AM' },
      { id: 'msg2', senderId: 'currentUser', text: 'Pretty good! Working on the WaChat app.', timestamp: '10:31 AM' },
      { id: 'msg3', senderId: 'user1', text: 'Sounds cool! How is the E2EE implementation?', timestamp: '10:32 AM' },
    ],
  },
  {
    id: 'chat2',
    users: [currentUser, users[1]],
    messages: [
      { id: 'msg4', senderId: 'user2', text: 'Can you send me the latest designs?', timestamp: '11:00 AM' },
    ],
  },
  {
    id: 'chat3',
    users: [currentUser, users[2]],
    messages: [
      { id: 'msg5', senderId: 'user3', text: 'Let\'s catch up later today.', timestamp: 'Yesterday' },
      { id: 'msg6', senderId: 'currentUser', text: 'Sure, sounds good.', timestamp: 'Yesterday' },
    ],
  },
  {
    id: 'chat4',
    users: [currentUser, users[3]],
    messages: [
      { id: 'msg7', senderId: 'user4', text: 'I really like the new AI feature!', timestamp: '2 days ago' },
    ],
  },
  {
    id: 'chat5',
    users: [currentUser, users[4]],
    messages: [
      { id: 'msg8', senderId: 'user5', text: 'Just wanted to say hi!', timestamp: '3 days ago' },
    ],
  },
    {
    id: 'chat6',
    users: [currentUser, users[5]],
    messages: [
      { id: 'msg9', senderId: 'user6', text: 'See you tomorrow!', timestamp: '4 days ago' },
    ],
  },
];
