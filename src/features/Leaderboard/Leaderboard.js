import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showLeaderboardAction } from './leaderboardSlice';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const showLeaderboard = useSelector((state) => state.leaderboard.showLeaderboard);

  const showHideClassName = showLeaderboard ? 'leaderboardModal' : 'leaderboardModal display-none';
  return (
    <div className={showHideClassName}>
      <section className="leaderboard">
        <button type="button" onClick={() => dispatch(showLeaderboardAction({ show: false }))}>
          Close
        </button>
      </section>
    </div>
  );
};

export default Leaderboard;
