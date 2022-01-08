import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTestContent,
  selectWordsIds,
  keyAction,
  scrollPositionAction,
} from "./typingtestSlice";
import Word from "./Word";
import { useKeyPress } from "./keypressHook";
import { Spinner } from "./Spinner";
import Timer from "./Timer";
import WordCounter from "./WordCounter";

const TypingTest = () => {
  const dispatch = useDispatch();
  const wordIds = useSelector(selectWordsIds);
  const testMode = useSelector((state) => state.typingtest.testMode);
  const wordWrapper = useRef(null);
  const remount = useRef(0);
  const scrollCount = useSelector((state) => state.typingtest.scrollCount);
  const firstLineOffsetTop = useRef(null);

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
    content = <Spinner />;
    content = null;
  } else if (testContentLoadingStatus === "succeeded") {
    content = wordIds.map((wordId) => {
      return <Word key={wordId} wordId={wordId}></Word>;
    });
  } else if (testContentLoadingStatus === "failed") {
    content = <div>{testContentLoadingError}</div>;
  }

  useLayoutEffect(() => {
    const wordNodeArray = Array.from(wordWrapper.current.childNodes);
    //TODO: I AM INSANE!!
    if (wordNodeArray.length == 0) {
      remount.current++;
    }
    if (wordNodeArray.length === 0) return;
    firstLineOffsetTop.current = wordNodeArray[0].offsetTop;
    // FIXME: hardcoding 80px here;
    const thirdLineOffsetTop = firstLineOffsetTop.current + 80;
    const scrollTriggerNode = wordNodeArray.find((obj) => {
      if (obj.offsetTop == thirdLineOffsetTop) return obj.getAttribute("id");
    });
    console.log(scrollTriggerNode.getAttribute("id"));
    dispatch(
      scrollPositionAction({ wordId: scrollTriggerNode.getAttribute("id") })
    );
  }, [remount.current]);

  useLayoutEffect(
    (params) => {
      if (scrollCount != 0) {
        console.log("scroll");
        // wordWrapper.current.setAttribute('style', 'margin-top: -2.5rem;');

        let removeCount = 0;
        while (
          wordWrapper.current.childNodes[removeCount].offsetTop ===
          firstLineOffsetTop.current
        ) {
          removeCount++;
        }

        while (removeCount > 0) {
          wordWrapper.current.removeChild(wordWrapper.current.childNodes[0]);
          removeCount--;
        }

        const wordNodeArray = Array.from(wordWrapper.current.childNodes);
        const thirdLineOffsetTop = firstLineOffsetTop.current + 80;
        const scrollTriggerNode = wordNodeArray.find((obj) => {
          if (obj.offsetTop == thirdLineOffsetTop)
            return obj.getAttribute("id");
        });
        // console.log(scrollTriggerNode.getAttribute("id"));
        if (scrollTriggerNode !== undefined) {
          dispatch(
            scrollPositionAction({
              wordId: scrollTriggerNode.getAttribute("id"),
            })
          );
        }
      }
    },
    [scrollCount]
  );

  return (
    <div className="typingTestWrapper">
      {/* Timer/word count display area */}
      {testMode === "time" ? <Timer /> : null}
      {testMode === "words" || testMode === "quote" ? <WordCounter /> : null}
      {/* The words area */}
      <div className="mask">
        <div className="typingTest" ref={wordWrapper}>
          {content}
        </div>
      </div>

      {/* TODO: Restart button group */}
    </div>
  );
};

export default TypingTest;
