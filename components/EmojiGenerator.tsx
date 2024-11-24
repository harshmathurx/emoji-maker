"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/use-credits';


export default function EmojiGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { updateCredits } = useCredits();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate-emoji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          toast({
            title: "Insufficient credits",
            description: data.message,
            variant: "destructive",
          });
          router.push('/pricing');
          return;
        }
        throw new Error(data.error || 'Failed to generate emoji');
      }

      if (data.credits !== undefined) {
        updateCredits(data.credits);
      }

      toast({
        title: "Success",
        description: "Emoji generated successfully!",
      });
      
      router.refresh();
      setPrompt('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate emoji. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto my-8">
      <div className="flex gap-2">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your emoji..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !prompt}>
          {loading ? 'Generating...' : 'Generate'}
        </Button>
      </div>
    </form>
  );
}