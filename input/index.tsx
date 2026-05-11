'use client'

import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { searchCtx, useAutocomplete } from '@/search';
import Suggestions from './suggestions';
import Ghost from './ghost';
import styles from './input.module.css';

export default function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [inputCoords, setInputCoords] = useState(false);
  const { fns: { setForecast, setLoading } } = useContext(searchCtx);
  const { term, setTerm, loading } = useAutocomplete();
  const [focused, setFocused] = useState(false);

  const toggleInputType = () => setInputCoords((prev) => !prev);

  const getCoordinates = useCallback(async () => {
    const isZip = isZipCode(term);
    const slug = isZip ? 'zip' : 'city';
    setLoading(true);
    await fetch(`/api/geocoding/${slug}/${term}`)
      .then((res) => res.json())
      .then((results) => {
        const { lat, lon } = isZip ? results : results[0];
        setLatitude(lat);
        setLongitude(lon);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [term]);

  async function getForecast(latitude: number, longitude: number) {
    setLoading(true);
    await fetch(`/api/forecast?latitude=${latitude}&longitude=${longitude}`)
      .then((res) => res.json())
      .then((forecast) => setForecast(forecast))
      .finally(() => {
        setLoading(false);
        setLatitude(null);
        setLongitude(null);
      });
  };

  const submit = useCallback(() => {
    if (term && !latitude && !longitude) {
      getCoordinates();
    }
  }, [term, latitude, longitude]);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      getForecast(latitude, longitude);
    }
  }, [latitude, longitude]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isZip = isZipCode(e.target.value);
    setTerm(e.target.value);
  };

  const handleLatChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => setLatitude(Number(e.target.value));
  const handleLonChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => setLongitude(Number(e.target.value));

  const groupClassname = [
    styles.group,
    ...(focused ? [styles.focused] : []),
  ].join(' ');

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  return (
    <div className={styles.container}>
      <button
        className={styles.entity}
        onClick={toggleInputType}
      >{inputCoords ? 'Lat/Lon' : 'City/Zip'}</button>
      <div className={groupClassname}>
        {!inputCoords && <div className={styles.wrapper}>
          <input
            ref={inputRef}
            className={styles.input}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Enter a city or a zip code"
            type="text"
            value={term}
          />
          <Ghost />
        </div>}
        {inputCoords && <div className={styles.wrapper}>
          <input
            ref={inputRef}
            className={styles.input}
            onChange={handleLatChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Latitude"
            type="number"
          />
          <input
            ref={inputRef}
            className={styles.input}
            onChange={handleLonChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Longitude"
            type="number"
          />
        </div>}
        <button
          className={styles.submit}
          disabled={loading || !term || (![latitude, longitude].includes(null))}
          onClick={submit}
        >Search</button>
      </div>
      <Suggestions inputRef={inputRef} />
    </div>
  );
}

function isZipCode(term: string): boolean {
  const patterns = {
    us: /^\d{5}(-\d{4})?$/,
    uk: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/,
    ca: /^[A-CEGHJ-NPRSTVXY]\d[A-CEGHJ-NPRSTV-Z][ ]?\d[A-CEGHJ-NPRSTV-Z]\d$/,
    au: /^\d{4}$/,
    de: /^\d{5}$/,
  };

  const result = Object.values(patterns).find((rxp) => rxp.test(term));

  return Boolean(result);
}
