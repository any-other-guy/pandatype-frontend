import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { typingtestSelectors } from "./typingtestSlice";

const ZhcnWord = ({ wordId }) => {
  // By only passing in the wordId itself instead of the wordObj, unnecessary rerender is prevented
  const language = useSelector((state) => state.typingtest.options.language);
  const wordObj = useSelector((state) =>
    typingtestSelectors[language].selectById(state, wordId)
  );
  const thisWord = useRef(null);

  return (
    <div className="ZhcnWord">
      <div className="ci">
        {wordObj.ziArray.map((zi) => {
          return (
            <div
              className="zi"
              key={`${zi.zi}${zi.ziIndex}`}
              status={zi.status}
            >
              {zi.zi}
            </div>
          );
        })}
      </div>
      <div
        className="word"
        id={wordId}
        active={wordObj.active.toString()}
        ref={thisWord}
      >
        {/* Render blinking cursor on active word */}
        {wordObj.active ? (
          <span
            className="cursor"
            style={{
              left:
                wordObj.cursorPosition === 0
                  ? 2
                  : wordObj.cursorPosition * 16 -
                    wordObj.cursorPosition * 1.5 +
                    1,
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
    </div>
  );
};

export default ZhcnWord;
