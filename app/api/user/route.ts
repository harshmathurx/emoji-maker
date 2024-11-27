import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { full_name, email, avatar_url } = await request.json();

    // First try to get existing profile
    let { data: profile } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', userId)
      .single();

    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          full_name,
          email,
          avatar_url,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      profile = newProfile;
    } else {
      // Update existing profile with new details
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name,
          email,
          avatar_url,
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) throw updateError;
      profile = updatedProfile;
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error managing user profile:', error);
    return NextResponse.json(
      { error: 'Failed to manage user profile' },
      { status: 500 }
    );
  }
}