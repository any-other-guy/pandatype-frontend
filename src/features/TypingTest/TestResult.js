import React from "react";
import { useSelector } from "react-redux";

const TestResult = () => {
  const {
    perSecondWpm,
    wpm,
    accuracy,
    elapsedTime,
    rawWpm,
    correctCount,
    mistakeCount,
    extraCount,
    missedCount,
    endTime,
    rawTypingHistory,
  } = useSelector((state) => state.typingtest.statistics);

  let formattedTime = new Date(0);
  formattedTime.setSeconds(elapsedTime);
  //TODO: better formatting, no zeros on single digit
  let formattedTimeString = formattedTime.toISOString().slice(17, 19);

  //TODO: 研究下这样会不会只更改state.typingtest里面任何的obj就会trigger rerender?
  const {
    testLanguage,
    testMode,
    testTimeOption,
    testWordOption,
    testQuoteOption,
  } = useSelector((state) => state.typingtest);

  return (
    <div className="testResult">
      <div className="stats">
        <div className="resultGroup wpm">
          <div className="top">wpm</div>
          <div className="bottom">{wpm.toFixed(0)}</div>
        </div>
        <div className="resultGroup acc">
          <div className="top">acc</div>
          <div className="bottom">{`${accuracy.toFixed(0)}%`}</div>
        </div>
      </div>
      <div className="chart"></div>
      <div className="moreStats">
        <div className="resultGroup testType">
          <div className="top">test type</div>
          <div className="bottom">{`${testLanguage} ${testMode}`}</div>
        </div>
        {/* <div className="resultGroup info">
          <div className="top">other</div>
          <div className="bottom">any-other-guy</div>
        </div> */}
        <div className="resultGroup raw">
          <div className="top">raw</div>
          <div className="bottom">{rawWpm.toFixed(0)}</div>
        </div>
        <div className="resultGroup keyStat">
          <div className="top">characters</div>
          <div className="bottom">
            {`${correctCount}/${mistakeCount}/${extraCount}/${missedCount}`}
          </div>
        </div>
        <div className="resultGroup consistency">
          <div className="top">consistency</div>
          <div className="bottom">{`${"100"}%`}</div>
        </div>
        <div className="resultGroup time">
          <div className="top">time</div>
          <div className="bottom">{`${formattedTimeString}s`}</div>
        </div>
      </div>
      <div className="bottom"></div>
    </div>
  );
};

export default TestResult;
