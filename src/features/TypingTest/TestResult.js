import React from "react";
import { useSelector } from "react-redux";
import RestartButton from "./RestartButton";
import ResultChart from "./ResultChart";

const TestResult = () => {
  const {
    perSecondWpm,
    wpm,
    accuracy,
    consistency,
    elapsedTime,
    rawWpm,
    correctCount,
    mistakeCount,
    extraCount,
    missedCount,
  } = useSelector((state) => state.typingtest.statistics);

  //TODO: 研究下这样会不会只更改state.typingtest里面任何的obj就会trigger rerender? 不过反正结算界面目前也没修改typingtest state里的东西的
  const { language, mode, time, words, quote } = useSelector(
    (state) => state.typingtest.options
  );

  let modeOption;
  switch (mode) {
    case "time":
      modeOption = time;
      break;
    case "words":
      modeOption = words;
      break;
    case "quote":
      modeOption = quote;
      break;
    default:
      break;
  }
  const wpmString = !isNaN(wpm) !== null ? wpm.toFixed(0) : "N/A";
  const accuracyString =
    !isNaN(accuracy) !== null ? `${accuracy.toFixed(0)}%` : "N/A";
  const testTypeString =
    language !== null && mode !== null && modeOption !== null
      ? `${language} ${mode}`
      : "N/A";
  const rawWpmString = !isNaN(rawWpm) !== null ? rawWpm.toFixed(0) : "N/A";
  const consistencyString =
    !isNaN(consistency) && consistency >= 0
      ? `${consistency.toFixed(0)}%`
      : "N/A";
  const timeString =
    !isNaN(elapsedTime) !== null ? `${Math.floor(elapsedTime / 1000)}s` : "N/A";

  return (
    <div className="testResult">
      <div className="stats">
        <div className="resultGroup wpm">
          <div className="top">wpm</div>
          <div className="bottom">{wpmString}</div>
        </div>
        <div className="resultGroup acc">
          <div className="top">acc</div>
          <div className="bottom">{accuracyString}</div>
        </div>
      </div>
      <div className="chart">
        <ResultChart perSecondWpm={perSecondWpm} elapsedTime={elapsedTime} />
      </div>
      <div className="moreStats">
        <div className="resultGroup testType">
          <div className="top">test type</div>
          <div className="bottom">
            {testTypeString}
            <br />
            {modeOption}
          </div>
        </div>
        {/* <div className="resultGroup info">
          <div className="top">other</div>
          <div className="bottom">any-other-guy</div>
        </div> */}
        <div className="resultGroup raw">
          <div className="top">raw</div>
          <div className="bottom">{rawWpmString}</div>
        </div>
        <div className="resultGroup keyStat">
          <div className="top">characters</div>
          <div className="bottom">
            {`${correctCount}/${mistakeCount}/${extraCount}/${missedCount}`}
          </div>
        </div>
        <div className="resultGroup consistency">
          <div className="top">consistency</div>
          <div className="bottom">{consistencyString}</div>
        </div>
        <div className="resultGroup time">
          <div className="top">time</div>
          <div className="bottom">{timeString}</div>
        </div>
      </div>
      <div className="bottom">
        <RestartButton language={language} />
      </div>
    </div>
  );
};

export default TestResult;
