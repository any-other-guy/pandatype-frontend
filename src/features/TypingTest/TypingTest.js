import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTestContent, selectWordsIds } from "./typingtestSlice";
import Word from "./Word";
const TypingTest = () => {
  const dispatch = useDispatch();
  const wordIds = useSelector(selectWordsIds);

  const testContentStatus = useSelector(
    (state) => state.typingtest.loadingStatus
  );
  const error = useSelector((state) => state.typingtest.loadingError);

  useEffect(() => {
    if (testContentStatus === "idle") {
      dispatch(fetchTestContent());
    }
  }, [testContentStatus, dispatch]);

  let content;

  if (testContentStatus === "loading") {
    content = ""; //TODO:
  } else if (testContentStatus === "succeeded") {
    console.log(wordIds);
    content = wordIds.map((wordId) => {
      return <Word key={wordId} wordId={wordId}></Word>;
    });
  } else if (testContentStatus === "failed") {
    content = <div>{error}</div>;
  }

  return <div className="typingTest">{content}</div>;
};

export default TypingTest;
