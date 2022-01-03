import { useEffect, useDebugValue, useRef } from "react";

export const useKeyPress = (callback) => {
  let keyPressed = useRef('');

  useEffect(() => {
    const downHandler = ({ key }) => {
      keyPressed.current = key
      callback && callback(key);
    };
    const upHandler = () => {
      keyPressed.current = null
    };
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  useDebugValue(keyPressed.current ?? "key pressed: ");
  return keyPressed;
};