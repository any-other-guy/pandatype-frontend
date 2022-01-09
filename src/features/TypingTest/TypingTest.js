import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTestContent,
  selectWordsIds,
  keyAction,
  // scrollPositionAction,
} from "./typingtestSlice";
import Word from "./Word";
import { useKeyPress } from "./keypressHook";
import { Spinner } from "./Spinner";
import Timer from "./Timer";
import WordCounter from "./WordCounter";
import { unmountComponentAtNode } from "react-dom";

const TypingTest = () => {
  const dispatch = useDispatch();
  const wordIds = useSelector(selectWordsIds);
  const testLanguage = useSelector((state) => state.typingtest.testLanguage);
  const testMode = useSelector((state) => state.typingtest.testMode);
  const wordWrapper = useRef(null);
  const firstLineOffsetTop = useRef(null);
  const [wordsToUnmount, setWordsToUnmount] = useState([]);

  // Handling input letters
  useKeyPress((key) => {
    dispatch(keyAction({ key: key }));
    if (wordWrapper.current.childNodes.length < 50) {
      console.log("fetching more tests");
      dispatch(fetchTestContent({ language: testLanguage, type: testMode }));
    }
    //TODO: might have better check on when to unmount first row
    if (/\s/.test(key)) {
      const activeWord = Array.from(wordWrapper.current.childNodes).find(
        (node) => {
          return node.getAttribute("active") === "true";
        }
      );
      if (activeWord === undefined) return;
      firstLineOffsetTop.current =
        activeWord.parentNode.childNodes[0].offsetTop;
      if (
        activeWord.previousElementSibling !== null &&
        activeWord.previousElementSibling.offsetTop >
          firstLineOffsetTop.current &&
        activeWord.previousElementSibling.offsetTop < activeWord.offsetTop
      ) {
        let arr = Array.from(activeWord.parentNode.childNodes)
          .filter((node) => node.offsetTop === firstLineOffsetTop.current)
          .map((e) => e.getAttribute("id"))
          .concat(wordsToUnmount);

        setWordsToUnmount(arr);
      }
    }
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
      console.log("initial fetch");
      dispatch(fetchTestContent({ language: testLanguage, type: testMode }));
    }
  }, [testContentLoadingStatus, dispatch]);

  // Populate test content UI
  let content;
  if (testContentLoadingStatus === "loading") {
    content = <Spinner />;
  } else if (testContentLoadingStatus === "succeeded") {
    content = wordIds.map((wordId) => {
      if (wordsToUnmount.includes(wordId)) return;
      return <Word key={wordId} wordId={wordId}></Word>;
    });
  } else if (testContentLoadingStatus === "failed") {
    content = <div>{testContentLoadingError}</div>;
  }

  return (
    <div className="typingTestWrapper">
      {/* Timer/word count display area */}
      {testMode === "time" ? <Timer /> : null}
      {testMode === "words" || testMode === "quote" ? <WordCounter /> : null}
      {/* The words area */}
      <div className="typingTest" ref={wordWrapper}>
        {content}
      </div>
      {/* TODO: Restart button group */}
    </div>
  );
};

export default TypingTest;
