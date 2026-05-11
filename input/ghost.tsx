'use client'

import { useContext } from 'react';
import { searchCtx } from '@/search';
import styles from './ghost.module.css';

export default function Ghost() {
  const { suggestion } = useContext(searchCtx);

  if (!suggestion) return null;

  return (
    <div className={styles.wrapper}>
      {suggestion}
    </div>
  );
}
