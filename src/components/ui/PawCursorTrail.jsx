import React, { useEffect, useRef, useState } from 'react';
import { FaPaw } from 'react-icons/fa';
import styles from './PawCursorTrail.module.css';

const MAX_PAWS = 18;
const MIN_DISTANCE = 28;
const TRAIL_MS = 1100;

const PawCursorTrail = () => {
  const [paws, setPaws] = useState([]);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const lastStampRef = useRef(0);
  const timerRef = useRef([]);

  useEffect(() => {
    const handleMove = (event) => {
      const now = Date.now();
      const dx = event.clientX - lastPointRef.current.x;
      const dy = event.clientY - lastPointRef.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance < MIN_DISTANCE && now - lastStampRef.current < 80) return;

      lastPointRef.current = { x: event.clientX, y: event.clientY };
      lastStampRef.current = now;

      const id = `${now}-${Math.random().toString(36).slice(2, 8)}`;
      const rotation = Math.round((Math.random() * 40) - 20);
      const scale = 0.55 + Math.random() * 0.25;

      setPaws((current) => [
        ...current.slice(-MAX_PAWS + 1),
        {
          id,
          x: event.clientX,
          y: event.clientY,
          rotation,
          scale,
        },
      ]);

      const timeoutId = window.setTimeout(() => {
        setPaws((current) => current.filter((paw) => paw.id !== id));
      }, TRAIL_MS);
      timerRef.current.push(timeoutId);
    };

    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      timerRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timerRef.current = [];
    };
  }, []);

  return (
    <>
      <div className={styles.cursorLayer} aria-hidden="true">
        {paws.map((paw) => (
          <span
            key={paw.id}
            className={styles.paw}
            style={{
              left: paw.x,
              top: paw.y,
              transform: `translate(-50%, -50%) rotate(${paw.rotation}deg) scale(${paw.scale})`,
            }}
          >
            <FaPaw />
          </span>
        ))}
      </div>
    </>
  );
};

export default PawCursorTrail;
