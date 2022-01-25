import { useEffect, useRef } from 'react';

export const useKeyPress = (callback) => {
  const keyPressed = useRef('');

  useEffect(() => {
    const downHandler = (e) => {
      if (e.key === 'Shift') return;
      e.preventDefault();
      keyPressed.current = e.key;
      callback(e.key);
    };
    const upHandler = (e) => {
      e.preventDefault();
      keyPressed.current = null;
    };
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  });

  return keyPressed;
};
