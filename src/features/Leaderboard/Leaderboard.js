/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LeaderboardRecordList from './LeaderboardRecordList';
import { Spinner } from '../../app/Spinner';
import { fetchLeaderboard, LeaderboardSelectors, showLeaderboardAction } from './leaderboardSlice';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const showLeaderboard = useSelector((state) => state.leaderboard.showLeaderboard);
  const en15 = useSelector((state) => LeaderboardSelectors.en15.selectEntities(state));
  const en60 = useSelector((state) => LeaderboardSelectors.en60.selectEntities(state));
  const zh15 = useSelector((state) => LeaderboardSelectors.zh15.selectEntities(state));
  const zh60 = useSelector((state) => LeaderboardSelectors.zh60.selectEntities(state));
  const showHideClassName = showLeaderboard ? 'leaderboardModal' : 'leaderboardModal display-none';

  const leaderboardLoadingStatus = useSelector((state) => state.leaderboard.loading.status);
  const leaderboardLoadingError = useSelector((state) => state.leaderboard.loading.error);
  useEffect(() => {
    dispatch(fetchLeaderboard({}));
  }, []);

  let tables;
  if (leaderboardLoadingStatus === 'loading') {
    tables = <Spinner />;
  } else if (leaderboardLoadingStatus === 'succeeded') {
    tables = (
      <div className="tables">
        <LeaderboardRecordList
          recordListObject={zh15}
          testLanguage="zh"
          testType="time"
          testOption="15"
        />
        <LeaderboardRecordList
          recordListObject={en15}
          testLanguage="en"
          testType="time"
          testOption="15"
        />
      </div>
    );
  } else if (leaderboardLoadingStatus === 'failed') {
    tables = <div>{leaderboardLoadingError}</div>;
  }
  return (
    <div
      className={showHideClassName}
      onClick={() => dispatch(showLeaderboardAction({ show: false }))}
    >
      <div className="leaderboard">
        <div className="leaderboardTop">
          <div className="title">Leaderboards</div>
          <div className="leaderboardFilter" />
          <div className="subtitle">Next update in: 00:00</div>
        </div>
        {tables}
      </div>
    </div>
  );
};

export default Leaderboard;
