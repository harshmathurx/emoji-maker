import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('posters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, max-age=0');

    return NextResponse.json({ posters: data }, { headers });
  } catch (error) {
    console.error('Error fetching posters:', error);
    return NextResponse.json({ error: 'Failed to fetch posters' }, { status: 500 });
  }
} 