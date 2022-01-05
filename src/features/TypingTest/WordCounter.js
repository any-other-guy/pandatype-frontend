import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const WordCounter = () => {
  const dispatch = useDispatch();

  const testStatus = useSelector((state) => state.typingtest.testStatus);
  const wordsCompleted = useSelector(
    (state) => state.typingtest.wordsCompleted
  );
  const totalNumber = useSelector((state) => state.typingtest.testWordOption);

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
