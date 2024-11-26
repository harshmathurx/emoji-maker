import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import Replicate from "replicate";

// Add this type definition at the top of the file
type ReplicateOutput = string[] | Record<string, unknown>;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(request: Request) {
  console.log('Received POST request to generate emoji');
  const { userId } = auth();
  console.log('User ID:', userId);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // First deduct the credit
    const { data: deductResult, error: deductError } = await supabase.rpc(
      'deduct_credit',
      { user_id_param: userId }
    );

    if (deductError || !deductResult) {
      return NextResponse.json({ 
        error: 'Insufficient credits', 
        message: 'Please purchase more credits to continue generating emojis.',
        redirectTo: '/pricing'
      }, { status: 403 });
    }

    const { prompt } = await request.json();

    try {
      const output = await replicate.run(
        "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
        {
          input: {
            prompt: prompt,
            width: 1024,
            height: 1024,
            refine: "no_refiner",
            scheduler: "K_EULER",
            lora_scale: 0.6,
            num_outputs: 1,
            guidance_scale: 7.5,
            apply_watermark: false,
            high_noise_frac: 0.8,
            negative_prompt: "",
            prompt_strength: 0.8,
            num_inference_steps: 50
          }
        }
      ) as ReplicateOutput;
      console.log('Replicate output:', output);

      if (!Array.isArray(output) || typeof output[0] !== 'string') {
        throw new Error('Failed to generate emoji: Unexpected output format');
      }

      const imageUrl = output[0];

      // Download the image
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase Storage
      const fileName = `${userId}_${Date.now()}.png`;
      console.log('Uploading to Supabase Storage');
      const { error: uploadError } = await supabase.storage
        .from('emojis')
        .upload(fileName, buffer, {
          contentType: 'image/png',
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL of the uploaded image
      console.log('Getting public URL');
      const { data: { publicUrl } } = supabase.storage
        .from('emojis')
        .getPublicUrl(fileName);

      // Add entry to emojis table
      console.log('Adding entry to emojis table');
      const { data: emojiData, error: emojiError } = await supabase
        .from('emojis')
        .insert({
          image_url: publicUrl,
          prompt,
          creator_user_id: userId,
        })
        .select()
        .single();

      if (emojiError) {
        throw emojiError;
      }

      // If successful, record the credit usage
      const { error: usageError } = await supabase
        .from('credit_usage')
        .insert({
          user_id: userId,
          emoji_id: emojiData.id,
          credits_used: 1
        });

      if (usageError) throw usageError;

      return NextResponse.json({ 
        success: true, 
        emoji: emojiData,
        credits: deductResult.credits // Return updated credits
      });
    } catch (error) {
      // If generation fails, refund the credit
      await supabase.rpc('refund_credit', {
        user_id_param: userId
      });
      throw error;
    }
  } catch (error) {
    console.error('Error generating or uploading emoji:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to generate or upload emoji', details: errorMessage }, { status: 500 });
  }
}

export const runtime = 'edge';
export const maxDuration = 300; // 5 minutes