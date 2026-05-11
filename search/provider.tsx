'use client'

import { useState } from 'react';
import { searchCtx } from './context';
import { Forecast } from '@/types';

export const SearchProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [forecast, setForecast] = useState<Forecast | null>(null);

  const value = {
    searchTerm,
    loading,
    suggestions,
    suggestion,
    suggestionIndex,
    forecast,
    fns: {
      setSearchTerm,
      setLoading,
      setSuggestion,
      setSuggestionIndex,
      setSuggestions,
      setForecast,
    },
  };
  return (
    <searchCtx.Provider value={value}>
      {children}
    </searchCtx.Provider>
  );
};
