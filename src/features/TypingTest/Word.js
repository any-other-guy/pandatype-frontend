import React from "react";
import { useSelector } from "react-redux";
import { selectWordsById } from "./typingtestSlice";

const Word = ({ wordId }) => {
  // By only passing in the wordId itself instead of the wordObj, unnecessary rerender is prevented
  const wordObj = useSelector((state) => selectWordsById(state, wordId));

  return (
    <div className="word" id={wordId} active={wordObj.active.toString()}>
      {/* Render blinking cursor on active word */}
      {wordObj.active ? (
        <span
          className="cursor"
          style={{
            left: wordObj.cursorPosition * 14.6,
          }}
        >
          |
        </span>
      ) : null}
      {/* Render letters in the word */}
      {wordObj.letters.map((letterObj) => {
        return (
          <div
            className="letter"
            key={`${letterObj.letter}${letterObj.letterIndex}`}
            status={letterObj.status}
          >
            {letterObj.letter}
          </div>
        );
      })}
      {/* Render extra letters typed in mistake color */}
      {wordObj.extraLetters.length !== 0
        ? wordObj.extraLetters.map((plainLetter, index) => {
            return (
              <div
                className="letter"
                status="extra"
                key={`Extra${plainLetter}${index}`}
              >
                {plainLetter}
              </div>
            );
          })
        : null}
    </div>
  );
};

export default Word;
