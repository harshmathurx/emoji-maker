"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

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
            description: data.message,
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto my-8 space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your Pixar-style poster..."
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !prompt}>
          {loading ? 'Generating...' : 'Generate'}
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="negative-prompt"
          checked={useNegativePrompt}
          onCheckedChange={setUseNegativePrompt}
        />
        <Label htmlFor="negative-prompt">
          Use negative prompt (removes noise and unwanted elements)
        </Label>
      </div>
    </form>
  );
} 