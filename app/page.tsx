'use client'

import { useContext } from 'react';
import { searchCtx } from '@/search';
import SearchInput from '@/input';
import styles from './page.module.css';

export default function Home() {
  const { loading } = useContext(searchCtx);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.form}>
          <SearchInput />
          {loading && <p>Loading...</p>}
        </div>
      </main>
    </div>
  );
}
