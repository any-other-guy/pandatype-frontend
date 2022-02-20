import { useEffect, useRef, useDebugValue } from 'react';
import { useSelector } from 'react-redux';

export const useKeyPress = (callback) => {
  const language = useSelector((state) => state.typingtest.options.language);
  const mode = useSelector((state) => state.typingtest.options.mode);
  const keyPressed = useRef('');

  useEffect(() => {
    const downHandler = (e) => {
      // let timer;
      // if (timer !== undefined) clearInterval(timer);
      // if (document.getElementsByClassName('cursor_started')[0] !== undefined) {
      //   document
      //     .getElementsByClassName('cursor_started')[0]
      //     .style.setProperty('animation', 'blink 0s infinite');
      // }

      // timer = setTimeout(() => {
      //   document
      //     .getElementsByClassName('cursor_started')[0]
      //     .style.setProperty('animation', 'blink 1s infinite');
      // }, 5000);

      if (e.key === 'Shift') return;
      if (!(language === 'zh' && mode === 'quote')) {
        e.preventDefault();
      }
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

  useDebugValue();

  return keyPressed;
};
