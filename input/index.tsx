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
import { useLocation } from './use-location';

export default function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [inputCoords, setInputCoords] = useState(false);
  const { fns: { setForecast, setLoading } } = useContext(searchCtx);
  const { term, setTerm, loading } = useAutocomplete();
  const [focused, setFocused] = useState(false);
  const { location, getCurrentLocation } = useLocation();

  const updateLatLonWithLocation = useCallback(() => {
    if (location) {
      setLongitude(location.coords.longitude);
      setLatitude(location.coords.latitude);
    }
  }, [location]);

  useEffect(() => {
    updateLatLonWithLocation();
  }, [location]);

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
          <Suggestions inputRef={inputRef} />
        </div>}
        {inputCoords && <div className={styles.wrapper}>
          <input
            ref={inputRef}
            className={styles.input}
            onChange={handleLatChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Latitude"
            value={latitude?.toString()}
            type="number"
          />
          <input
            ref={inputRef}
            className={styles.input}
            onChange={handleLonChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Longitude"
            value={longitude?.toString()}
            type="number"
          />
        </div>}
        {inputCoords && <button
          className={styles.submit}
          onClick={getCurrentLocation}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 48C337.7 48 352 62.3 352 80L352 98.3C450.1 112.3 527.7 189.9 541.7 288L560 288C577.7 288 592 302.3 592 320C592 337.7 577.7 352 560 352L541.7 352C527.7 450.1 450.1 527.7 352 541.7L352 560C352 577.7 337.7 592 320 592C302.3 592 288 577.7 288 560L288 541.7C189.9 527.7 112.3 450.1 98.3 352L80 352C62.3 352 48 337.7 48 320C48 302.3 62.3 288 80 288L98.3 288C112.3 189.9 189.9 112.3 288 98.3L288 80C288 62.3 302.3 48 320 48zM160 320C160 408.4 231.6 480 320 480C408.4 480 480 408.4 480 320C480 231.6 408.4 160 320 160C231.6 160 160 231.6 160 320zM320 224C373 224 416 267 416 320C416 373 373 416 320 416C267 416 224 373 224 320C224 267 267 224 320 224z"/></svg>
        </button>}
        <button
          className={styles.submit}
          disabled={loading || !term || (![latitude, longitude].includes(null))}
          onClick={submit}
        >Search</button>
      </div>
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
