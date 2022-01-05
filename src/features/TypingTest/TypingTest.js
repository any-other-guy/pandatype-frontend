import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTestContent, selectWordsIds, keyAction } from "./typingtestSlice";
import Word from "./Word";
import { useKeyPress } from "./keypressHook";
import { Spinner } from "./Spinner";
import Timer from "./Timer";
import WordCounter from "./WordCounter";

const TypingTest = () => {
  const dispatch = useDispatch();
  const wordIds = useSelector(selectWordsIds);
  const testMode = useSelector((state) => state.typingtest.testMode);

  // Handling input letters
  useKeyPress((key) => {
    dispatch(keyAction({ key: key }));
  });

  // Select loading status from store
  const testContentLoadingStatus = useSelector(
    (state) => state.typingtest.loadingStatus
  );
  const testContentLoadingError = useSelector(
    (state) => state.typingtest.loadingError
  );

  // Fetch test content only after first load
  useEffect(() => {
    if (testContentLoadingStatus === "idle") {
      dispatch(fetchTestContent());
    }
  }, [testContentLoadingStatus, dispatch]);

  // Populate test content UI
  let content;

  if (testContentLoadingStatus === "loading") {
    content = <Spinner />; //TODO: add spinner here
  } else if (testContentLoadingStatus === "succeeded") {
    content = wordIds.map((wordId) => {
      return <Word key={wordId} wordId={wordId}></Word>;
    });
  } else if (testContentLoadingStatus === "failed") {
    content = <div>{testContentLoadingError}</div>;
  }

  return (
    <div className="typingTestWrapper">
      {/* Timer/word count display area */}
      {testMode === "time" ? <Timer /> : null}
      {testMode === "word" || testMode === "quote" ? <WordCounter /> : null}
      {/* The words area */}
      <div className="typingTest">{content}</div>
      {/* TODO: Restart Button here */}
    </div>
  );
};

export default TypingTest;
