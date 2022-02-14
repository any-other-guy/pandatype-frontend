import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { typingtestSelectors } from './typingtestSlice';
import ZhZi from './ZhZi';
import Caret from './Caret';

const ZhWord = ({ wordId }) => {
  // By only passing in the wordId itself instead of the wordObj, unnecessary rerender is prevented
  const language = useSelector((state) => state.typingtest.options.language);
  const wordObj = useSelector((state) => typingtestSelectors[language].selectById(state, wordId));
  const thisWord = useRef(null);

  return (
    <div className="ZhWord">
      <div className="ci">
        {wordObj.ziArray.map((zi) => (
          <ZhZi key={`${zi.zi}${zi.ziIndex}`} zi={zi.zi} status={zi.status} />
        ))}
      </div>
      <div className="word" id={wordId} active={wordObj.active.toString()} ref={thisWord}>
        {/* Render blinking cursor on active word */}
        {wordObj.active ? (
          <Caret
            left={
              wordObj.cursorPosition === 0
                ? 2
                : wordObj.cursorPosition * 16 - wordObj.cursorPosition * 1.5 + 1
            }
          />
        ) : null}
        {/* Render letters in the word */}
        {wordObj.letters.map((letterObj) => (
          <div
            className="letter"
            key={`${letterObj.letter}${letterObj.letterIndex}`}
            status={letterObj.status}
          >
            {letterObj.letter}
          </div>
        ))}
        {/* Render extra letters typed in mistake color */}
        {wordObj.extraLetters.length !== 0
          ? wordObj.extraLetters.map((plainLetter) => (
              <div className="letter" status="extra" key={`Extra${plainLetter.id}`}>
                {plainLetter}
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

ZhWord.propTypes = {
  wordId: PropTypes.string.isRequired,
};

export default ZhWord;
