"use client";

import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/store';
import { SparkleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Loading } from "./ui/loading";

export default function PosterGenerator() {
  const [prompt, setPrompt] = useState('');
  const [useNegativePrompt, setUseNegativePrompt] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const setNewPoster = useStore((state) => state.setNewPoster);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate-poster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, useNegativePrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.error === 'Empty prompt') {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        if (response.status === 403) {
          toast({
            title: "Insufficient credits",
            description: "Please purchase more credits to continue generating posters.",
            variant: "destructive",
          });
          router.push('/pricing');
          return;
        }
        throw new Error(data.error || 'Failed to generate poster');
      }

      setNewPoster(data.poster);

      toast({
        variant: "success",
        title: "Success",
        description: "Poster generated successfully!",
      });

      router.refresh();
      setPrompt('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('Insufficient credits')) {
        toast({
          title: "Insufficient credits",
          description: "Please purchase more credits to continue generating posters.",
          variant: "destructive",
        });
        router.push('/pricing');
        return;
      }

      toast({
        title: "Error",
        description: "Failed to generate poster. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto my-8 space-y-4">
      <div className="relative">
        <div className="relative flex items-center">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your Pixar-style poster..."
            disabled={loading}
            className="w-full pl-12 pr-24 h-12 bg-[#F3F3F4] border-none rounded-full text-base placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
          />
          <SparkleIcon className="absolute left-4 h-5 w-5 text-zinc-500" />
          <Button
            type="submit"
            disabled={loading || !prompt}
            className="absolute right-1.5 h-9 px-4 rounded-full"
          >
            {loading ? (
              <Loading size="sm" />
            ) : (
              'Generate'
            )}
          </Button>
        </div>
      </div>
      {loading && (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Generating your poster..." />
        </div>
      )}
      <div className="flex items-center space-x-2 px-4">
        <Switch
          id="negative-prompt"
          checked={useNegativePrompt}
          onCheckedChange={setUseNegativePrompt}
          disabled={loading}
        />
        <Label htmlFor="negative-prompt" className="text-sm text-zinc-500">
          Use negative prompt (removes noise and unwanted elements)
        </Label>
      </div>
    </form>
  );
} 