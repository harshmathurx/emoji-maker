"use client";
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

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
  emojis: {
    prompt: string;
    image_url: string;
  };
}

export default function ProfileContent() {
  const [credits, setCredits] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [creditUsage, setCreditUsage] = useState<CreditUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creditsRes, transactionsRes, usageRes] = await Promise.all([
          fetch('/api/user/credits'),
          fetch('/api/user/transactions'),
          fetch('/api/user/credit-usage')
        ]);

        const [creditsData, transactionsData, usageData] = await Promise.all([
          creditsRes.json(),
          transactionsRes.json(),
          usageRes.json()
        ]);

        setCredits(creditsData.credits);
        setTransactions(transactionsData.transactions);
        setCreditUsage(usageData.usage);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="h-[500px]" />;
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Credits</h2>
        <p className="text-4xl font-bold">{credits}</p>
      </Card>

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
                  <p className="font-bold">{usage.emojis.prompt}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(usage.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-500">-{usage.credits_used} credits</p>
                  <img 
                    src={usage.emojis.image_url} 
                    alt={usage.emojis.prompt}
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