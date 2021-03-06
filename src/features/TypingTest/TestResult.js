import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RestartButton from './RestartButton';
import ResultChart from './ResultChart';
import { postTestResult } from './typingtestSlice';
import { useKeyPress } from './keypressHook';

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

  const dispatch = useDispatch();
  // TODO: 研究下这样会不会只更改state.typingtest里面任何的obj就会trigger rerender? 不过反正结算界面目前也没修改typingtest state里的东西的
  const { language, mode, time, words, quote } = useSelector((state) => state.typingtest.options);
  const hasLogin = useSelector((state) => state.auth.hasLogin);
  const token = useSelector((state) => state.auth.token);

  // Handle 'tab'  input for restart menu
  useKeyPress((key) => {});

  let modeOption;
  switch (mode) {
    case 'time':
      modeOption = time;
      break;
    case 'words':
      modeOption = words;
      break;
    case 'quote':
      modeOption = quote;
      break;
    default:
      break;
  }

  const now = new Date();
  const utcMilllisecondsSinceEpoch = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const utcSecondsSinceEpoch = Math.round(utcMilllisecondsSinceEpoch / 1000);

  useEffect(() => {
    const identifierStr = token === null ? null : token.split(' ')[1];
    dispatch(
      postTestResult({
        identifierStr,
        testLanguage: language,
        testType: mode,
        testOption: modeOption,
        wpm: wpm.toFixed(2),
        rawWpm: rawWpm.toFixed(2),
        accuracy: accuracy.toFixed(2),
        consistency: consistency.toFixed(2),
        testDate: utcSecondsSinceEpoch,
        elapsedTime: elapsedTime.toFixed(2),
      })
    );
  }, [hasLogin]);

  const wpmString = !Number.isNaN(wpm) !== null ? wpm.toFixed(0) : 'N/A';
  const accuracyString = !Number.isNaN(accuracy) !== null ? `${accuracy.toFixed(0)}%` : 'N/A';
  const testTypeString =
    language !== null && mode !== null && modeOption !== null
      ? `${
          {
            words: {
              en: 'words',
              zh: '按字数',
            }[language],
            quote: {
              en: 'quote',
              zh: '写段子',
            }[language],
            time: {
              en: 'time',
              zh: '倒计时',
            }[language],
          }[mode]
        } ${
          {
            time,
            words,
            quote: {
              all: {
                en: 'all',
                zh: '所有长度',
              }[language],
              short: {
                en: 'words',
                zh: '一句话',
              }[language],
              medium: {
                en: 'words',
                zh: '一段话',
              }[language],
              long: {
                en: 'words',
                zh: '小作文',
              }[language],
            }[quote],
          }[mode]
        }`
      : 'N/A';
  const rawWpmString = !Number.isNaN(rawWpm) !== null ? rawWpm.toFixed(0) : 'N/A';
  const consistencyString =
    !Number.isNaN(consistency) && consistency >= 0 ? `${consistency.toFixed(0)}%` : 'N/A';
  const timeString = !Number.isNaN(elapsedTime) !== null ? `${Math.floor(elapsedTime)}s` : 'N/A';

  return (
    <div className="testResult">
      <div className="stats">
        <div className="resultGroup wpm">
          <div className="top">
            {
              {
                en: 'wpm',
                zh: '速度',
              }[language]
            }
          </div>
          <div className="bottom">{wpmString}</div>
        </div>
        <div className="resultGroup acc">
          <div className="top">
            {
              {
                en: 'acc',
                zh: '准确度',
              }[language]
            }
          </div>
          <div className="bottom">{accuracyString}</div>
        </div>
      </div>
      <div className="chart">
        <ResultChart perSecondWpm={perSecondWpm} elapsedTime={elapsedTime} />
      </div>
      <div className="moreStats">
        <div className="resultGroup testType">
          <div className="top">
            {
              {
                en: 'test type',
                zh: '测试类型',
              }[language]
            }
          </div>
          <div className="bottom">
            {testTypeString}
            <br />
            {
              {
                en: 'English',
                zh: '中文',
              }[language]
            }
          </div>
        </div>
        {/* <div className="resultGroup info">
          <div className="top">other</div>
          <div className="bottom">any-other-guy</div>
        </div> */}
        <div className="resultGroup raw">
          <div className="top">
            {
              {
                en: 'raw',
                zh: '原始速度',
              }[language]
            }
          </div>
          <div className="bottom">{rawWpmString}</div>
        </div>
        <div className="resultGroup keyStat">
          <div className="top">
            {
              {
                en: 'characters',
                zh: '字母统计',
              }[language]
            }
          </div>
          <div className="bottom">
            {`${correctCount}/${mistakeCount}/${extraCount}/${missedCount}`}
          </div>
        </div>
        <div className="resultGroup consistency">
          <div className="top">
            {
              {
                en: 'consistency',
                zh: '速度一致性',
              }[language]
            }
          </div>
          <div className="bottom">{consistencyString}</div>
        </div>
        <div className="resultGroup time">
          <div className="top">
            {
              {
                en: 'time',
                zh: '时间',
              }[language]
            }
          </div>
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
