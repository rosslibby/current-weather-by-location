'use client'

import { useContext } from 'react';
import { searchCtx } from '@/search';
import styles from './forecast.module.css';

export default function Forecast() {
  const { forecast } = useContext(searchCtx);

  if (!forecast) return null;

  return (
    <div className={styles.forecast}>
      <div className={styles.entry}>
        <strong>Temperature</strong>
        <span>{`${forecast.main.temp}`}&deg;</span>
      </div>
      <div className={styles.entry}>
        <strong>Feels like</strong>
        <span>{`${forecast.main.feels_like}`}&deg;</span>
      </div>
      <div className={styles.entry}>
        <strong>Low</strong>
        <span>{`${forecast.main.temp_min}`}&deg;</span>
      </div>
      <div className={styles.entry}>
        <strong>High</strong>
        <span>{`${forecast.main.temp_max}`}&deg;</span>
      </div>
      <div className={styles.entry}>
        <strong>Humidity</strong>
        <span>{`${forecast.main.humidity}%`}</span>
      </div>
      <div className={styles.entry}>
        <strong>Visibility</strong>
        <span>{`${forecast.visibility}`}</span>
      </div>
      <div className={styles.entry}>
        <strong>Wind speed</strong>
        <span>{`${forecast.wind.speed}`}</span>
      </div>
      <div className={styles.entry}>
        <strong>Sunrise</strong>
        <span>{`${new Date(forecast.sys.sunrise).toLocaleTimeString()}`}</span>
      </div>
      <div className={styles.entry}>
        <strong>Sunset</strong>
        <span>{`${new Date(forecast.sys.sunset).toLocaleTimeString()}`}</span>
      </div>
    </div>
  );
}
