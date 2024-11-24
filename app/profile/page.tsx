import { Suspense } from 'react';
import ProfileContent from '@/components/profile-content';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <Suspense fallback={<Skeleton className="h-[500px]" />}>
        <ProfileContent />
      </Suspense>
    </div>
  );
} 