import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      packageName,
      credits,
      amount
    } = await request.json();

    // Verify payment signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Start a Supabase transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        package_name: packageName,
        amount: amount / 100, // Convert from paisa to rupees
        credits_added: credits,
        payment_id: razorpay_payment_id,
        status: 'success'
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Update user credits
    const { error: updateError } = await supabase.rpc('add_user_credits', {
      user_id_param: userId,
      credits_to_add: credits
    });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 