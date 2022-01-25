import React from 'react';
import { useSelector } from 'react-redux';

const WordCounter = () => {
  const testStatus = useSelector((state) => state.typingtest.status);
  const wordsCompleted = useSelector((state) => state.typingtest.statistics.wordsCompleted);
  const zhCompleted = useSelector((state) => state.typingtest.statistics.zhCompleted);
  const testLanguage = useSelector((state) => state.typingtest.options.language);
  const testMode = useSelector((state) => state.typingtest.options.mode);
  const testWordOption = useSelector((state) => state.typingtest.options.words);
  const quoteWordCount = useSelector((state) => state.typingtest.loading.quoteWordCount);
  let totalNumber = null;
  let completed = null;
  if (testMode === 'words') totalNumber = testWordOption;
  if (testMode === 'quote') totalNumber = quoteWordCount;
  if (testLanguage === 'zh') {
    completed = zhCompleted;
  } else {
    completed = wordsCompleted;
  }
  return (
    <div className="wordCounter">
      {testStatus === 'started' ? (
        <span>
          {completed}/{totalNumber}
        </span>
      ) : null}
    </div>
  );
};

export default WordCounter;
