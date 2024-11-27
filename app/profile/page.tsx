import { Suspense } from 'react';
import ProfileContent from '@/components/profile-content';
import { Skeleton } from '@/components/ui/skeleton';
import { currentUser } from '@clerk/nextjs/server';

export default async function ProfilePage() {

  const user = await currentUser()

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold mb-8 text-center">{(user?.firstName)?.toLowerCase()}&apos;s wall</h1>
      <Suspense fallback={<Skeleton className="h-[500px]" />}>
        <ProfileContent />
      </Suspense>
    </div>
  );
} 