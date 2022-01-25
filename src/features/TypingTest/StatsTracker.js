import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { perSecondWpmAction } from './typingtestSlice';
import { useInterval } from './useIntervalHook';

const StatsTracker = () => {
  const dispatch = useDispatch();

  const testStatus = useSelector((state) => state.typingtest.status);

  const atSecond = useRef(0);

  // Timer
  useInterval(() => {
    atSecond.current += 1;
    if (testStatus === 'started' && testStatus !== 'completed') {
      dispatch(perSecondWpmAction({ atSecond: atSecond.current }));
    }
  }, 1000);

  return <div className="statsTracker display-none" />;
};

export default StatsTracker;
