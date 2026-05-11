'use client'

import { RefObject, useCallback, useContext, useEffect, useState } from 'react';
import { searchCtx } from '@/search';

export const useSuggestions = (inputEl: RefObject<HTMLInputElement | null>) => {
  const {
    searchTerm,
    suggestions,
    fns: { setSearchTerm, setSuggestion, setSuggestions },
  } = useContext(searchCtx);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const suggestion = suggestions[suggestionIndex];
  
  const updateSuggestion = useCallback(() => {
    setSuggestion(suggestion || null);
  }, [suggestion]);

  useEffect(() => {
    updateSuggestion();
  }, [suggestion]);

  const resetIndex = () => setSuggestionIndex(0);
  useEffect(() => {
    resetIndex();
  }, [searchTerm]);

  const decrement = useCallback(() => {
    if (suggestions.length === 0) return;

    setSuggestionIndex((prev) => {
      if (prev === 0) {
        return suggestions.length - 1;
      }
      return prev - 1;
    });
  }, [suggestions]);

  const increment = useCallback(() => {
    if (suggestions.length === 0) return;

    setSuggestionIndex((prev) => {
      if (prev === suggestions.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  }, [suggestions]);

  const selectSuggestion = useCallback(() => {
    if (suggestion) {
      setSearchTerm(suggestion);
      setSuggestions([]);
    }
  }, [suggestion]);

  useEffect(() => {
    let current: HTMLInputElement | null = inputEl.current;

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') increment();
      else if (e.key === 'ArrowUp') decrement();
      else if (['ArrowRight', 'Tab'].includes(e.key)) selectSuggestion();
    };

    if (current) {
      current.addEventListener('keydown', handleArrowKeys);
    }

    return () => {
      current?.removeEventListener('keydown', handleArrowKeys);
    };
  }, [inputEl, increment, decrement, selectSuggestion]);

  return {
    suggestion,
    suggestions,
  };
};
