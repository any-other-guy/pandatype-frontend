import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useInterval } from "./useIntervalHook";
import { testCompletedAction } from "./typingtestSlice";

const Timer = () => {
  const dispatch = useDispatch();

  const testStatus = useSelector((state) => state.typingtest.testStatus);
  const totalTime = useSelector(
    (state) => state.typingtest.testTimeOption
  );
  const [timeRemaining, setTimeRemaining] = useState(totalTime);

  // Timer
  useInterval(() => {
    if (testStatus === "started") {
      if (timeRemaining > 0) {
        setTimeRemaining(timeRemaining - 1);
      } else {
        // Send testCompletedAction action to store
        dispatch(testCompletedAction());
        // Timer should be unmounted along with TypingTest
      }
    }
  }, 1000);

  // Setup timer UI
  let formattedTime = new Date(0);
  formattedTime.setSeconds(timeRemaining);
  //TODO: better formatting, no zeros on single digit
  let formattedTimeString = formattedTime.toISOString().slice(17, 19);

  return (
    <div className="timer">
      {testStatus === "started"
        ? formattedTimeString
        : null}
    </div>
  );
};

export default Timer;
