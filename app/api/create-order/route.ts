import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { auth } from '@clerk/nextjs/server';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PACKAGES = {
  basic: { price: 4000, credits: 5 },    // ₹40
  premium: { price: 10000, credits: 15 }, // ₹100
  pro: { price: 30000, credits: 50 }      // ₹300
};

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packageName } = await request.json();
    const selectedPackage = PACKAGES[packageName as keyof typeof PACKAGES];
    
    if (!selectedPackage) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
    }

    const timestamp = Date.now().toString().slice(-8);
    const shortUserId = userId.slice(-8);
    const receipt = `rcpt_${shortUserId}_${timestamp}`;

    const order = await razorpay.orders.create({
      amount: selectedPackage.price,
      currency: 'INR',
      receipt,
      notes: {
        userId,
        packageName,
        credits: selectedPackage.credits.toString(),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 