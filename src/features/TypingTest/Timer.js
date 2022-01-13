import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useInterval } from "./useIntervalHook";
import { testTimerDepletedAction } from "./typingtestSlice";

const Timer = () => {
  const dispatch = useDispatch();

  const testStatus = useSelector((state) => state.typingtest.status);
  const totalTime = useSelector(
    (state) => state.typingtest.options.time
  );
  const [timeRemaining, setTimeRemaining] = useState(totalTime);

  // Set new totalTime on rerender caused by tate.typingtest.testTimeOption change
  useEffect(() => {
    setTimeRemaining(totalTime);
  }, [totalTime]);

  // Timer
  useInterval(() => {
    if (testStatus === "started") {
      if (timeRemaining > 0) {
        setTimeRemaining(timeRemaining - 1);
      } else {
        // Send testCompletedAction action to store
        dispatch(testTimerDepletedAction());
        // Timer should be unmounted along with TypingTest
      }
    }
  }, 1000);

  return (
    <div className="timer">
      {testStatus === "started"
        ? timeRemaining
        : null}
    </div>
  );
};

export default Timer;
