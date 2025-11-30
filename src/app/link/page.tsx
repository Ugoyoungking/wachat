import LinkClient from './client';
import { Suspense } from 'react';

export default function LinkPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LinkClient />
    </Suspense>
  );
}
