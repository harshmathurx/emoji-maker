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

interface PosterWithUser extends Poster {
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export default function PosterGrid() {
  const [posters, setPosters] = useState<PosterWithUser[]>([]);
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
          
          setPosters(data.posters.map((poster: PosterWithUser) => ({
            ...poster,
            isLiked: likedPosterIds.has(poster.id),
            profiles: poster.profiles || {
              full_name: 'Unknown',
              avatar_url: '/default-avatar.png'
            }
          })));
        } else {
          setPosters(data.posters.map((poster: PosterWithUser) => ({ 
            ...poster, 
            isLiked: false,
            profiles: poster.profiles || {
              full_name: 'Unknown',
              avatar_url: '/default-avatar.png'
            }
          })));
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
      setPosters((prevPosters) => [{
        ...newPoster,
        isLiked: false,
        profiles: {
          full_name: 'Loading...', // Will be updated on next fetch
          avatar_url: '/default-avatar.png'
        }
      }, ...prevPosters]);
      
      // Fetch updated data to get the profile information
      fetchPosters();
    }
  }, [newPoster, fetchPosters]);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {posters.map((poster) => (
        <Card 
          key={poster.id} 
          className="group overflow-hidden bg-zinc-900 dark:bg-zinc-900/90 backdrop-blur-sm border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="relative aspect-square">
            <Image
              src={poster.image_url}
              alt={poster.prompt}
              fill
              className="object-cover rounded-t-xl"
            />
            <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-t-xl">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(poster.image_url, poster.prompt)}
                className="text-white hover:bg-white/20 transition-colors"
              >
                <Download className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleLike(poster.id)}
                className={`text-white hover:bg-white/20 transition-colors ${
                  poster.isLiked ? 'bg-red-500/50' : ''
                }`}
              >
                <Heart
                  className="h-6 w-6"
                  fill={poster.isLiked ? 'currentColor' : 'none'}
                />
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <Image
                    src={poster.profiles?.avatar_url}
                    alt={poster.profiles?.full_name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="font-medium text-sm text-white dark:text-zinc-100">
                  {poster.profiles?.full_name}
                </span>
              </div>
              <div className="flex items-center text-sm text-white dark:text-zinc-400">
                <Heart className="h-4 w-4 mr-1" />
                <span>{poster.likes_count}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 