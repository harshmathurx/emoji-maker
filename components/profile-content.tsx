"use client";

import { useAuth } from "@clerk/nextjs";
import { Skeleton } from './ui/skeleton';
import PosterGrid from './PosterGrid';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "./ui/table";

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

  // Calculate total amount
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className="space-y-12">
      {/* Posters Section */}
      <div className="space-y-4">
        <PosterGrid userId={userId} showCreatorInfo={false} />
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        <div className="rounded-md border border-zinc-800 bg-zinc-950/50">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                <TableHead className="text-zinc-400">Invoice</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Method</TableHead>
                <TableHead className="text-right text-zinc-400">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={transaction.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="font-medium text-white">
                    INV{String(index + 1).padStart(3, '0')}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {transaction.status}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {transaction.package_name}
                  </TableCell>
                  <TableCell className="text-right text-white">
                    ₹{transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-zinc-950/50">
              <TableRow className="">
                <TableCell colSpan={3} className="text-white">Total</TableCell>
                <TableCell className="text-right font-medium text-white">
                  ₹{totalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      {/* Credit Usage History */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Credit Usage</h2>
        <div className="rounded-md border border-zinc-800 bg-zinc-950/50">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                <TableHead className="text-zinc-400">Prompt</TableHead>
                <TableHead className="text-zinc-400">Date</TableHead>
                <TableHead className="text-zinc-400">Credits</TableHead>
                <TableHead className="text-zinc-400">Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditUsage.map((usage) => (
                <TableRow key={usage.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="font-medium text-white max-w-md truncate">
                    {usage.posters.prompt}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {new Date(usage.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-red-500">
                    -{usage.credits_used}
                  </TableCell>
                  <TableCell>
                    <div className="relative w-12 h-12">
                      <Image
                        src={usage.posters.image_url}
                        alt={usage.posters.prompt}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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