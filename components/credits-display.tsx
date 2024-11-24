"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { useToast } from '@/hooks/use-toast';

export default function CreditsDisplay() {
  const [credits, setCredits] = useState<number | null>(null);
  const router = useRouter();
//   const { toast } = useToast();

  const fetchCredits = async () => {
    try {
      const res = await fetch('/api/user/credits');
      const data = await res.json();
      setCredits(data.credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  useEffect(() => {
    fetchCredits();
    // Set up an interval to refresh credits every 30 seconds
    const interval = setInterval(fetchCredits, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    router.push('/pricing');
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-black"
    >
      {credits === null ? 'Loading...' : `${credits} Credits`}
    </button>
  );
} 