import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { posterId } = await request.json();

  try {
    const { data: existingLike, error: likeError } = await supabase
      .from('poster_likes')
      .select()
      .eq('user_id', userId)
      .eq('poster_id', posterId)
      .single();

    if (likeError && likeError.code !== 'PGRST116') throw likeError;

    let action: 'liked' | 'unliked';

    if (existingLike) {
      await supabase
        .from('poster_likes')
        .delete()
        .eq('user_id', userId)
        .eq('poster_id', posterId);
      action = 'unliked';
    } else {
      await supabase
        .from('poster_likes')
        .insert({ user_id: userId, poster_id: posterId });
      action = 'liked';
    }

    const { data: updatedPoster, error: updateError } = await supabase.rpc(
      'update_poster_likes_count',
      { poster_id_param: posterId }
    );
      
    if (updateError) throw updateError;
    
    return NextResponse.json({ 
      success: true, 
      likes_count: updatedPoster[0].likes_count,
      action
    });
  } catch (error) {
    console.error('Error updating likes:', error);
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
} 