'use client';

import { RefObject, useContext } from 'react';
import { searchCtx } from '@/search';
import { useSuggestions } from './use-suggestions';
import styles from './suggestions.module.css';

const Suggestion = ({ children }: { children: string }) => {
  const { searchTerm, fns: { setSearchTerm } } = useContext(searchCtx);
  const className = [
    styles.suggestion,
    ...(searchTerm === children ? [styles.active] : []),
  ].join(' ');
  const select = () => setSearchTerm(children);
  return <li className={className} onClick={select}>{children}</li>;
};

export default function Suggestions({ inputRef }: {
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  const { searchTerm } = useContext(searchCtx);
  const { suggestions } = useSuggestions(inputRef);

  if (!suggestions.length || suggestions.includes(searchTerm)) return null;

  return (
    <ul className={styles.suggestions}>
      {suggestions.map((suggestion, i) => (
        <Suggestion key={i}>{suggestion}</Suggestion>
      ))}
    </ul>
  );
}
