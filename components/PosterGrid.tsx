"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card } from './ui/card';
import { useStore } from '../lib/store';
import { Download, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@clerk/nextjs';

interface Poster {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  isLiked?: boolean;
}

export default function PosterGrid() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const newPoster = useStore((state) => state.newPoster);
  const { isSignedIn, userId } = useAuth();

  const fetchPosters = useCallback(async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/posters?t=${timestamp}`);
      const data = await response.json();
      
      if (Array.isArray(data.posters)) {
        if (isSignedIn && userId) {
          const likesResponse = await fetch(`/api/user-likes?userId=${userId}&t=${timestamp}`);
          const likesData = await likesResponse.json();
          const likedPosterIds = new Set(likesData.likes.map((like: { poster_id: number }) => like.poster_id));
          
          setPosters(data.posters.map((poster: Poster) => ({
            ...poster,
            isLiked: likedPosterIds.has(poster.id)
          })));
        } else {
          setPosters(data.posters.map((poster: Poster) => ({ ...poster, isLiked: false })));
        }
      }
    } catch (error) {
      console.error('Error fetching posters:', error);
    }
  }, [isSignedIn, userId]);

  useEffect(() => {
    fetchPosters();
  }, [fetchPosters]);

  useEffect(() => {
    if (newPoster) {
      setPosters((prevPosters) => [{ ...newPoster, isLiked: false }, ...prevPosters]);
    }
  }, [newPoster]);

  const handleDownload = (imageUrl: string, prompt: string) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `poster-${prompt}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error downloading image:', error));
  };

  const handleLike = async (posterId: number) => {
    if (!isSignedIn) return;

    try {
      const response = await fetch('/api/like-poster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ posterId }),
      });
      
      const data = await response.json();
      if (data.success) {
        setPosters(prevPosters =>
          prevPosters.map(poster =>
            poster.id === posterId
              ? { 
                  ...poster, 
                  likes_count: data.likes_count,
                  isLiked: data.action === 'liked'
                }
              : poster
          )
        );
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {posters.map((poster) => (
        <Card key={poster.id} className="overflow-hidden bg-transparent border-0 shadow-lg">
          <div className="relative group">
            <Image
              src={poster.image_url}
              alt={poster.prompt}
              width={1024}
              height={1024}
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(poster.image_url, poster.prompt)}
                className="text-white mr-2"
              >
                <Download size={24} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleLike(poster.id)}
                className={`text-white ${poster.isLiked ? 'bg-red-500 bg-opacity-50' : ''}`}
              >
                <Heart size={24} fill={poster.isLiked ? 'currentColor' : 'none'} />
              </Button>
            </div>
          </div>
          <div className="mt-4 px-2">
            <p className="text-lg font-medium">{poster.prompt}</p>
            <div className="flex items-center mt-2">
              <Heart size={16} className="mr-1" />
              <span>{poster.likes_count}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 