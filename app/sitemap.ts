import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posters } = await supabase
    .from('posters')
    .select('id, created_at')
    .order('created_at', { ascending: false });

  const posterUrls = posters?.map((poster) => ({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/poster/${poster.id}`,
    lastModified: poster.created_at,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || [];

  return [
    {
      url: process.env.NEXT_PUBLIC_APP_URL!,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posterUrls,
  ];
} 