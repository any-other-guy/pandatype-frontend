import React from "react";
import { useSelector } from "react-redux";

const WordCounter = () => {
  const testStatus = useSelector((state) => state.typingtest.status);
  const wordsCompleted = useSelector(
    (state) => state.typingtest.statistics.wordsCompleted
  );
  const testMode = useSelector((state) => state.typingtest.options.mode);
  const testWordOption = useSelector((state) => state.typingtest.options.words);
  const quoteWordCount = useSelector((state) => state.typingtest.loading.quoteWordCount);
  let totalNumber = null;
  if(testMode === "words") totalNumber = testWordOption;
  if(testMode === "quote") totalNumber = quoteWordCount;

  return (
    <div className="wordCounter">
      {testStatus === "started" ? (
        <span>
          {wordsCompleted}/{totalNumber}
        </span>
      ) : null}
    </div>
  );
};

export default WordCounter;
