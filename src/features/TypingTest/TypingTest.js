import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTestContent,
  selectWordsIds,
  keyAction,
  resetTestAction,
  // scrollPositionAction,
} from "./typingtestSlice";
import Word from "./Word";
import { useKeyPress } from "./keypressHook";
import { Spinner } from "./Spinner";
import Timer from "./Timer";
import WordCounter from "./WordCounter";
import RestartButton from "./RestartButton";

const TypingTest = () => {
  const dispatch = useDispatch();
  const wordIds = useSelector(selectWordsIds);
  const testLanguage = useSelector((state) => state.typingtest.testLanguage);
  const testMode = useSelector((state) => state.typingtest.testMode);
  const wordWrapper = useRef(null);
  const firstLineOffsetTop = useRef(null);
  const [wordsToUnmount, setWordsToUnmount] = useState([]);

  // Handling key input
  useKeyPress((key) => {
    // Dispatch all keypress for now
    // TODO: filter out some unnecessary ones
    dispatch(keyAction({ key: key }));
    // if (key === "Enter") {
    //   dispatch(
    //     resetTestAction({ testLanguage: testLanguage, testMode: testMode })
    //   );
    // }
    //TODO: might have better check on when to unmount first row
    // Only check
    if (/\s/.test(key)) {
      // Fetch for more, only do this after the initial render for time mode
      if (testMode === "time" && wordWrapper.current.childNodes.length < 50) {
        console.log("fetching more tests");
        dispatch(fetchTestContent({ language: testLanguage, type: testMode }));
      }
      // Remove first row when cursor is at a specific position (buttom left)
      const activeWord = Array.from(wordWrapper.current.childNodes).find(
        (node) => {
          return node.getAttribute("active") === "true";
        }
      );
      // Remember the relative position of the first row element
      if (activeWord === undefined) return;
      firstLineOffsetTop.current =
        activeWord.parentNode.childNodes[0].offsetTop;
      // If the cursor is at bottom left, which means that the last sibling of the current word is at the last position on the second row
      if (
        activeWord.previousElementSibling !== null &&
        activeWord.previousElementSibling.offsetTop >
          firstLineOffsetTop.current &&
        activeWord.previousElementSibling.offsetTop < activeWord.offsetTop
      ) {
        // Add first row to wordsToUnmount
        // const arr = Array.from(activeWord.parentNode.childNodes)
        //   .filter((node) => node.offsetTop === firstLineOffsetTop.current)
        //   .map((e) => e.getAttribute("id"))
        //   .concat(wordsToUnmount);
        // Maybe a better way to write the line above
        const arr = Array.from(activeWord.parentNode.childNodes).reduce(
          (list, node) => {
            if (node.offsetTop === firstLineOffsetTop.current) {
              list.push(node.getAttribute("id"));
            }
            return list;
          },
          [...wordsToUnmount]
        );
        // Then trigger re-render here for the actual 'unmounting' process
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
    // content = <Spinner />;
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
      {/* Restart button group */}
      <RestartButton testLanguage={testLanguage} testMode={testMode}/>
    </div>
  );
};

export default TypingTest;
