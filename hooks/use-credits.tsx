"use client";

import { createContext, useContext, useState, useEffect } from 'react';

interface CreditsContextType {
  credits: number | null;
  updateCredits: (newCredits: number) => void;
  refreshCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType>({
  credits: null,
  updateCredits: () => {},
  refreshCredits: async () => {},
});

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number | null>(null);

  const refreshCredits = async () => {
    try {
      const res = await fetch('/api/user/credits');
      const data = await res.json();
      setCredits(data.credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  useEffect(() => {
    refreshCredits();
  }, []);

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  return (
    <CreditsContext.Provider value={{ credits, updateCredits, refreshCredits }}>
      {children}
    </CreditsContext.Provider>
  );
}

export const useCredits = () => useContext(CreditsContext); 