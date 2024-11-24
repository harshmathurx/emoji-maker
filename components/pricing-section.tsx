"use client";
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';

const PACKAGES = [
  {
    name: 'basic',
    title: 'Basic Package',
    price: '₹40',
    credits: 5,
    costPerEmoji: '₹8'
  },
  {
    name: 'premium',
    title: 'Premium Package',
    price: '₹100',
    credits: 15,
    costPerEmoji: '₹6.67'
  },
  {
    name: 'pro',
    title: 'Pro Package',
    price: '₹300',
    credits: 50,
    costPerEmoji: '₹6'
  }
] as const;

type PackageName = typeof PACKAGES[number]['name'];

export default function PricingSection() {
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState<PackageName | null>(null);

  const handlePurchase = async (packageName: PackageName) => {
    try {
      setLoading(packageName);
      
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageName })
      });
      
      const orderData = await orderRes.json();
      if (!orderData.orderId) throw new Error('Failed to create order');

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Emoji Maker',
        description: `Purchase ${packageName} package`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                userId: user?.id,
                packageName,
                credits: PACKAGES.find(p => p.name === packageName)?.credits,
                amount: orderData.amount
              })
            });
            
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast({
                title: "Payment successful",
                description: `Added ${PACKAGES.find(p => p.name === packageName)?.credits} credits to your account`,
              });
              window.location.reload();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Payment failed",
              description: "Please try again or contact support if the problem persists.",
            });
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "Please try again or contact support if the problem persists.",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
      {PACKAGES.map((pkg) => (
        <Card key={pkg.name} className="p-6">
          <h3 className="text-2xl font-bold mb-4">{pkg.title}</h3>
          <p className="text-3xl font-bold mb-2">{pkg.price}</p>
          <ul className="mb-6 space-y-2">
            <li>{pkg.credits} Credits</li>
            <li>{pkg.costPerEmoji} per emoji</li>
          </ul>
          <Button
            onClick={() => handlePurchase(pkg.name)}
            disabled={loading === pkg.name}
            className="w-full"
          >
            {loading === pkg.name ? 'Processing...' : 'Purchase'}
          </Button>
        </Card>
      ))}
    </div>
  );
} 