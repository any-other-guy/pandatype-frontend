import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTestContent, keyAction, typingtestSelectors } from './typingtestSlice';
import ZhWord from './ZhWord';
import { useKeyPress } from './keypressHook';
import Timer from './Timer';
import WordCounter from './WordCounter';
import RestartButton from './RestartButton';
import ZhQuote from './ZhQuote';

const ZhTypingTest = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.typingtest.options.language);
  const wordIds = useSelector((state) => typingtestSelectors[language].selectIds(state));
  const mode = useSelector((state) => state.typingtest.options.mode);
  const quoteOption = useSelector((state) => state.typingtest.options.quote);
  const wordWrapper = useRef(null);
  const firstLineOffsetTop = useRef(null);
  const [wordsToUnmount, setWordsToUnmount] = useState([]);

  // Handling key input
  useKeyPress((key) => {
    if (mode === 'quote') return;
    // Dispatch all keypress for now
    dispatch(keyAction({ key }));

    // FOR TESTING PURPOSE
    // FIXME: discover how to fix the blinking issue when refetched and rerendered
    if (key === '=') {
      dispatch(fetchTestContent({ language, type: mode }));
    }

    // Fetch action only triggered by pressing space, for less checking done
    if (/\s/.test(key)) {
      // Remove first row when cursor is at a specific position (buttom left)
      const activeWord = Array.from(wordWrapper.current.childNodes).find(
        (node) => node.childNodes[1].getAttribute('active') === 'true'
      );
      // Remember the relative position of the first row element
      if (activeWord === undefined) return;
      firstLineOffsetTop.current = activeWord.parentNode.childNodes[0].offsetTop;
      // If the cursor is at bottom left, which means that the last sibling of the current word is at the last position on the second row
      if (
        activeWord.previousElementSibling !== null &&
        activeWord.previousElementSibling.offsetTop > firstLineOffsetTop.current &&
        activeWord.previousElementSibling.offsetTop < activeWord.offsetTop
      ) {
        // Add first row to wordsToUnmount
        const arr = Array.from(activeWord.parentNode.childNodes).reduce(
          (list, node) => {
            if (node.offsetTop === firstLineOffsetTop.current) {
              list.push(node.childNodes[1].getAttribute('id'));
            }
            return list;
          },
          [...wordsToUnmount]
        );
        // Then trigger re-render here for the actual 'unmounting' process
        setWordsToUnmount(arr);

        // Fetch for more, only do this after the initial render for time mode
        // console.log(wordWrapper.current.childNodes.length);
        if (mode === 'time' && wordWrapper.current.childNodes.length < 30) {
          // console.log('fetching more tests');
          dispatch(fetchTestContent({ language, type: mode }));
        }
      }
    }
  });

  // Select loading status from store
  const testContentLoadingStatus = useSelector((state) => state.typingtest.loading.status);
  const testContentLoadingError = useSelector((state) => state.typingtest.loading.error);

  // Fetch test content only after first load
  useEffect(() => {
    if (testContentLoadingStatus === 'idle') {
      let queryObj = { language, type: mode };
      if (mode === 'quote') queryObj = { ...queryObj, quoteLength: quoteOption };
      dispatch(fetchTestContent(queryObj));
    }
  }, [testContentLoadingStatus, language, mode, quoteOption, dispatch]);

  // Populate test content UI
  let content;
  if (testContentLoadingStatus === 'loading') {
    // content = <Spinner />;
  } else if (testContentLoadingStatus === 'succeeded') {
    if (mode === 'quote') {
      content = <ZhQuote ziIds={wordIds} />;
    } else {
      content = wordIds.reduce((list, wordId) => {
        if (wordsToUnmount.includes(wordId)) return list;
        list.push(<ZhWord key={wordId} wordId={wordId} />);
        return list;
      }, []);
    }
  } else if (testContentLoadingStatus === 'failed') {
    content = <div>{testContentLoadingError}</div>;
  }

  return (
    <div className="typingTestWrapper">
      {/* Timer/word count display area */}
      {mode === 'time' ? <Timer /> : null}
      {mode === 'words' || mode === 'quote' ? <WordCounter /> : null}
      {/* The words area */}
      <div className="zhTypingTest" ref={wordWrapper}>
        {content}
      </div>
      {/* Restart button group */}
      <RestartButton />
    </div>
  );
};

export default ZhTypingTest;
