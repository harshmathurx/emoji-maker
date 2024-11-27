import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: posters, error } = await supabase
      .from('posters')
      .select(`
        id,
        image_url,
        prompt,
        likes_count,
        creator_user_id,
        created_at,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ posters });
  } catch (error) {
    console.error('Error fetching posters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posters' },
      { status: 500 }
    );
  }
} 