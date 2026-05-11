'use client'

import { useCallback, useContext, useEffect } from 'react';
import { searchCtx } from './context';

export const useAutocomplete = () => {
  const {
    loading,
    searchTerm,
    suggestions,
    fns: { setLoading, setSearchTerm, setSuggestion, setSuggestions },
  } = useContext(searchCtx);

  const findSuggestions = useCallback(async () => {
    if (searchTerm.length === 0) {
      setSuggestions([]);
      setSuggestion(null);
    } else {
      setLoading(true);
      const term = encodeURIComponent(searchTerm);
      await fetch(`/api/google-places/autocomplete/${term}`, {
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status ${res.status}`);
          return res;
        })
        .then((res) => res.json())
        .then(({ suggestions }) => {
          setSuggestions(suggestions);
        })
        .finally(() => {
          setLoading(false);
        });
      }
  }, [searchTerm, setLoading]);

  useEffect(() => {
    findSuggestions();
  }, [searchTerm]);

  return {
    term: searchTerm,
    setTerm: setSearchTerm,
    suggestions,
    loading,
  };
}
