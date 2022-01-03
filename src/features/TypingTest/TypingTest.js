import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTestContent, selectWordsIds, keyAction } from "./typingtestSlice";
import Word from "./Word";
import { useKeyPress } from "./keypressHook";

const TypingTest = () => {
  const dispatch = useDispatch();

  //Handling input letters
  useKeyPress((key) => {
    dispatch(keyAction({key: key}));
  });

  //Select loading status from store
  const testContentLoadingStatus = useSelector(
    (state) => state.typingtest.loadingStatus
  );
  const testContentLoadingError = useSelector(
    (state) => state.typingtest.loadingError
  );

  //Fetch test content only after the first render
  useEffect(() => {
    if (testContentLoadingStatus === "idle") {
      dispatch(fetchTestContent());
    }
  }, [testContentLoadingStatus, dispatch]);

  //Populate test content UI
  let content;
  const wordIds = useSelector(selectWordsIds);

  if (testContentLoadingStatus === "loading") {
    content = ""; //TODO:
  } else if (testContentLoadingStatus === "succeeded") {
    // console.log(wordIds);
    content = wordIds.map((wordId) => {
      return <Word key={wordId} wordId={wordId}></Word>;
    });
  } else if (testContentLoadingStatus === "failed") {
    content = <div>{testContentLoadingError}</div>;
  }

  return <div className="typingTest">{content}</div>;
};

export default TypingTest;
