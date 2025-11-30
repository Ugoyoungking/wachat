
import AddFriendClient from './client';
import { Suspense } from 'react';

export default function AddFriendPage() {
  return (
    <Suspense>
      <AddFriendClient />
    </Suspense>
  );
}
