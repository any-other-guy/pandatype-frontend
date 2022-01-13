import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { perSecondWpmAction, elapsedTimeAction } from "./typingtestSlice";
import { useInterval } from "./useIntervalHook";

const StatsTracker = () => {
  const dispatch = useDispatch();

  const testStatus = useSelector((state) => state.typingtest.status);

  const atSecond = useRef(0);
  const startTimestamp = useRef(0);
  const endTimestamp = useRef(0);
  // Timer
  useInterval(() => {
    atSecond.current++;
    if (testStatus === "started" && testStatus !== "completed") {
      dispatch(perSecondWpmAction({ atSecond: atSecond.current }));
    }
  }, 1000);

  // useEffect(() => {
  //   if (testStatus === "started") {
  //     startTimestamp.current = Date.now();
  //   } else if (testStatus === "completed") {
  //     endTimestamp.current = Date.now();
  //     let elapsedTime = (endTimestamp.current - startTimestamp.current) / 1000;
  //     dispatch(elapsedTimeAction({ elapsedTime: elapsedTime, testDate: endTimestamp.current }));
  //   }
  // }, [testStatus, dispatch]);

  return <div className="hidden"></div>;
};

export default StatsTracker;
