"use client";

import { useAuth } from "@clerk/nextjs";
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import PosterGrid from './PosterGrid';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function ProfileContent() {
  const { userId } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [creditUsage, setCreditUsage] = useState<CreditUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, usageRes] = await Promise.all([
          fetch('/api/user/transactions'),
          fetch('/api/user/credit-usage')
        ]);

        const [transactionsData, usageData] = await Promise.all([
          transactionsRes.json(),
          usageRes.json()
        ]);

        setTransactions(transactionsData.transactions);
        setCreditUsage(usageData.usage);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (!userId || loading) {
    return <Skeleton className="h-[500px]" />;
  }

  return (
    <div className="">
      <div className="space-y-4">
        <PosterGrid userId={userId} showCreatorInfo={false} />
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="p-4 bg-zinc-900/90 backdrop-blur-sm border-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{transaction.package_name.toUpperCase()}</p>
                  <p className="text-sm text-zinc-400">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">₹{transaction.amount}</p>
                  <p className="text-sm text-green-500">+{transaction.credits_added} credits</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Credit Usage History */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Credit Usage</h2>
        <div className="space-y-4">
          {creditUsage.map((usage) => (
            <Card key={usage.id} className="p-4 bg-zinc-900/90 backdrop-blur-sm border-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{usage.posters.prompt}</p>
                  <p className="text-sm text-zinc-400">
                    {new Date(usage.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-red-500">-{usage.credits_used} credits</p>
                  <div className="relative w-12 h-12">
                    <Image
                      src={usage.posters.image_url}
                      alt={usage.posters.prompt}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

interface Transaction {
  id: number;
  package_name: string;
  amount: number;
  credits_added: number;
  created_at: string;
  status: string;
}

interface CreditUsage {
  id: number;
  created_at: string;
  credits_used: number;
  posters: {
    prompt: string;
    image_url: string;
  };
} 