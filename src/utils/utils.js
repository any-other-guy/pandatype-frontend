import { loadState } from "../app/localStorage";

export const formatMillisecondsToDate = (milliseconds) => {
  const formattedTime = new Date(0);
  formattedTime.setMilliseconds(milliseconds);
  return formattedTime.toISOString();
};

export const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const getZhStrLength = (str) => {
  return str.split("").reduce((length, zi) => {
    if (escape(zi).length > 4) length++;
    return length;
  }, 0);
};

export const containsNonChinese = (str) => {
  return str.split("").some((zi) => {
    return escape(zi).length <= 4;
  });
};

// export const useComponentDidUpdate = (effect, dependencies) => {
//   const hasMounted = useRef(false);

//   useEffect(() => {
//     if (!hasMounted.current) {
//       hasMounted.current = true;
//       return;
//     }
//     effect();
//   }, dependencies);
// };

export const findZiIndex = (arr, letter, letterIndex) => {
  let ziIndex = 0;
  const exists = arr.some((zi) => {
    if (zi.charAt(letterIndex) !== null && zi.charAt(letterIndex) === letter) {
      return true;
    } else {
      letterIndex -= zi.length;
      ziIndex++;
    }
    return false;
  });
  return exists ? ziIndex : null;
};

export const setTheme = (theme) => {
  if (theme === undefined) return;
  document.documentElement.style.setProperty("--bg-color", theme["bg-color"]);
  document.documentElement.style.setProperty(
    "--main-color",
    theme["main-color"]
  );
  document.documentElement.style.setProperty(
    "--caret-color",
    theme["caret-color"]
  );
  document.documentElement.style.setProperty("--sub-color", theme["sub-color"]);
  document.documentElement.style.setProperty(
    "--text-color",
    theme["text-color"]
  );
  document.documentElement.style.setProperty(
    "--error-color",
    theme["error-color"]
  );
  return theme;
};
