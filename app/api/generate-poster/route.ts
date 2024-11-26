import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import Replicate from "replicate";

type ReplicateOutput = string[] | Record<string, unknown>;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: deductResult, error: deductError } = await supabase.rpc(
      'deduct_credit',
      { user_id_param: userId }
    );

    if (deductError || !deductResult) {
      return NextResponse.json({ 
        error: 'Insufficient credits', 
        message: 'Please purchase more credits to continue generating posters.',
        redirectTo: '/pricing'
      }, { status: 403 });
    }

    const { prompt, useNegativePrompt } = await request.json();

    // Check for empty prompt
    if (!prompt.trim()) {
      return NextResponse.json({ 
        error: 'Empty prompt', 
        message: 'Prompt cannot be empty.' 
      }, { status: 400 }); // Bad Request
    }

    try {
      const output = await replicate.run(
        "swartype/sdxl-pixar:81f8bbd3463056c8521eb528feb10509cc1385e2fabef590747f159848589048",
        {
          input: {
            prompt,
            negative_prompt: useNegativePrompt ? "noisy, sloppy, messy, grainy, highly detailed, ultra textured, photo, NSFW" : "",
            width: 1024,
            height: 1024,
            refine: "no_refiner",
            scheduler: "K_EULER",
            lora_scale: 0.6,
            num_outputs: 1,
            guidance_scale: 7.5,
            apply_watermark: false,
            high_noise_frac: 0.8,
            prompt_strength: 0.8,
            num_inference_steps: 50
          }
        }
      ) as ReplicateOutput;

      if (!Array.isArray(output) || typeof output[0] !== 'string') {
        throw new Error('Failed to generate poster: Unexpected output format');
      }

      const imageUrl = output[0];
      const fileName = `${userId}_${Date.now()}.png`;
      
      // Download and upload image to Supabase
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('posters')
        .upload(fileName, buffer, {
          contentType: 'image/png',
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('posters')
        .getPublicUrl(fileName);

      const { data: posterData, error: posterError } = await supabase
        .from('posters')
        .insert({
          image_url: publicUrl,
          prompt,
          creator_user_id: userId,
        })
        .select()
        .single();

      if (posterError) throw posterError;

      const { error: usageError } = await supabase
        .from('credit_usage')
        .insert({
          user_id: userId,
          poster_id: posterData.id,
          credits_used: 1
        });

      if (usageError) throw usageError;

      return NextResponse.json({ 
        success: true, 
        poster: posterData,
        credits: deductResult.credits
      });
    } catch (error) {
      // Refund credit if generation fails
      await supabase.rpc('refund_credit', {
        user_id_param: userId
      });
      throw error;
    }
  } catch (error) {
    console.error('Error generating or uploading poster:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to generate or upload poster', details: errorMessage }, { status: 500 });
  }
}

export const runtime = 'edge';
export const maxDuration = 300; 