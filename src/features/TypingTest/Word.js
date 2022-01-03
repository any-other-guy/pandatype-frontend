import React from "react";
import { useSelector } from "react-redux";
import { selectWordsById } from "./typingtestSlice";

const Word = ({ wordId }) => {
  const wordObj = useSelector((state) => selectWordsById(state, wordId));
  return (
    <div className="word">
      {wordObj.letters.map((letterObj) => {
        return (
          <div
            className="letter"
            key={letterObj.letter + letterObj.letterIndex}
            status={letterObj.status}
          >
            {letterObj.letter}
          </div>
        );
      })}
    </div>
  );
};

export default Word;
