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

    const { data: posters, error } = await supabase
      .from('posters')
      .select(`
        id,
        image_url,
        prompt,
        likes_count,
        created_at,
        creator_user_id
      `)
      .eq('creator_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ posters });
  } catch (error) {
    console.error('Error fetching user posters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user posters' },
      { status: 500 }
    );
  }
} 