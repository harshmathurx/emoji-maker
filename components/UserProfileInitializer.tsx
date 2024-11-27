"use client"

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

export default function UserProfileInitializer() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && userId && user) {
      fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          avatar_url: user.imageUrl,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            console.error('Error initializing user profile:', data.error);
          }
        })
        .catch((error) => {
          console.error('Error initializing user profile:', error);
        });
    }
  }, [isSignedIn, userId, user]);

  return null;
}