'use client'

import { createContext } from 'react';
import { Forecast } from '@/types';

export const searchCtx = createContext<{
  searchTerm: string;
  forecast: Forecast | null;
  loading: boolean;
  suggestionIndex: number;
  suggestion: string | null;
  suggestions: string[];
  fns: Record<string, React.Dispatch<React.SetStateAction<any>>>;
}>({
  searchTerm: '',
  suggestion: null,
  suggestionIndex: 0,
  forecast: null,
  loading: false,
  suggestions: [],
  fns: {},
});
