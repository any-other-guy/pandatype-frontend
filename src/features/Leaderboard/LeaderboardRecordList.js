import React from 'react';
import PropTypes from 'prop-types';
import { FaCrown } from 'react-icons/fa';
import { formatLocalTime } from '../../utils/utils';

const LeaderboardRecordList = ({ recordListObject, testLanguage, testType, testOption }) => {
  const leaderboardContent = Object.values(recordListObject).map((entry, index) => {
    const dateTime = formatLocalTime(entry.testDate).split('-');

    return (
      <tr key={entry.id}>
        <td className="rank">{index === 0 ? <FaCrown size="1rem" /> : index + 1}</td>
        <td className="username">{entry.identifierStr}</td>
        <td className="wpm">
          {entry.wpm.toFixed(2)}
          <div className="sub">{entry.accuracy.toFixed(2)}</div>
        </td>
        <td className="raw">
          {entry.rawWpm.toFixed(2)}
          <div className="sub">{entry.consistency.toFixed(2)}</div>
        </td>
        <td className="testOption">
          {entry.testType}
          <div className="sub">{entry.testOption}</div>
        </td>
        <td className="testDate">
          <div>{dateTime[0]}</div>
          <div className="sub">{dateTime[1]}</div>
        </td>
      </tr>
    );
  });

  return (
    <div className="leaderboardRecordList">
      <div className="title">
        {
          {
            en: 'English',
            zh: '中文',
          }[testLanguage]
        }{' '}
        {
          {
            words: {
              en: 'words',
              zh: '按字数',
            }[testLanguage],
            quote: {
              en: 'quote',
              zh: '写段子',
            }[testLanguage],
            time: {
              en: 'time',
              zh: '倒计时',
            }[testLanguage],
          }[testType]
        }{' '}
        {
          {
            time: testOption,
            words: testOption,
            quote: {
              all: {
                en: 'all',
                zh: '所有长度',
              }[testLanguage],
              short: {
                en: 'words',
                zh: '一句话',
              }[testLanguage],
              medium: {
                en: 'words',
                zh: '一段话',
              }[testLanguage],
              long: {
                en: 'words',
                zh: '小作文',
              }[testLanguage],
            }[testOption],
          }[testType]
        }
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <td className="rank">#</td>
              <td className="username">name</td>
              <td className="wpm">
                wpm
                <br />
                <div className="sub">accuracy</div>
              </td>
              <td className="raw">
                raw
                <br />
                <div className="sub">consistency</div>
              </td>
              <td className="testOption">test</td>
              <td className="testDate">date</td>
            </tr>
          </thead>
          <tbody>{leaderboardContent}</tbody>
        </table>
      </div>
    </div>
  );
};

LeaderboardRecordList.propTypes = {
  recordListObject: PropTypes.objectOf(PropTypes.object).isRequired,
  testLanguage: PropTypes.string.isRequired,
  testType: PropTypes.string.isRequired,
  testOption: PropTypes.string.isRequired,
};
export default LeaderboardRecordList;
