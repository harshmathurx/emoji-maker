import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: usage, error } = await supabase
      .from('credit_usage')
      .select(`
        *,
        emojis (
          prompt,
          image_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ usage });
  } catch (error) {
    console.error('Error fetching credit usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credit usage' },
      { status: 500 }
    );
  }
} 