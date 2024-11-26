import { create } from 'zustand';

interface Poster {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
}

interface PosterStore {
  newPoster: Poster | null;
  setNewPoster: (poster: Poster) => void;
}

export const usePosterStore = create<PosterStore>((set) => ({
  newPoster: null,
  setNewPoster: (poster) => set({ newPoster: poster }),
})); 