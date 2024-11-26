"use client";
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
import { Download, Heart } from 'lucide-react';
import { Button } from './ui/button';

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

interface UserPoster {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  created_at: string;
}

export default function ProfileContent() {
  const [credits, setCredits] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [creditUsage, setCreditUsage] = useState<CreditUsage[]>([]);
  const [userPosters, setUserPosters] = useState<UserPoster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creditsRes, transactionsRes, usageRes, postersRes] = await Promise.all([
          fetch('/api/user/credits'),
          fetch('/api/user/transactions'),
          fetch('/api/user/credit-usage'),
          fetch('/api/user/posters')
        ]);

        const [creditsData, transactionsData, usageData, postersData] = await Promise.all([
          creditsRes.json(),
          transactionsRes.json(),
          usageRes.json(),
          postersRes.json()
        ]);

        setCredits(creditsData.credits);
        setTransactions(transactionsData.transactions);
        setCreditUsage(usageData.usage);
        setUserPosters(postersData.posters);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = (imageUrl: string, prompt: string) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `poster-${prompt}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error downloading image:', error));
  };

  if (loading) {
    return <Skeleton className="h-[500px]" />;
  }

  return (
    <div className="space-y-12">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Credits</h2>
        <p className="text-4xl font-bold">{credits}</p>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-6">Your Posters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPosters.map((poster) => (
            <Card key={poster.id} className="overflow-hidden bg-transparent border-0 shadow-lg">
              <div className="relative group">
                <Image
                  src={poster.image_url}
                  alt={poster.prompt}
                  width={1024}
                  height={1024}
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(poster.image_url, poster.prompt)}
                    className="text-white"
                  >
                    <Download size={24} />
                  </Button>
                </div>
              </div>
              <div className="mt-4 px-2">
                <p className="text-lg font-medium">{poster.prompt}</p>
                <div className="flex items-center mt-2">
                  <Heart size={16} className="mr-1" />
                  <span>{poster.likes_count}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{transaction.package_name.toUpperCase()}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{transaction.amount}</p>
                  <p className="text-sm text-green-500">+{transaction.credits_added} credits</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Credit Usage</h2>
        <div className="space-y-4">
          {creditUsage.map((usage) => (
            <Card key={usage.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{usage.posters.prompt}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(usage.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-500">-{usage.credits_used} credits</p>
                  <img 
                    src={usage.posters.image_url} 
                    alt={usage.posters.prompt}
                    className="w-12 h-12 rounded-full ml-4"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 