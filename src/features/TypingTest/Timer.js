import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useInterval } from "./useIntervalHook";
import { testCompleted } from "./typingtestSlice";

const Timer = ({ status }) => {
  const dispatch = useDispatch();

  const testStatus = useSelector((state) => state.typingtest.testStatus);
  const testModeOption = useSelector(
    (state) => state.typingtest.testModeOption
  );
  const [timeRemaining, setTimeRemaining] = useState(testModeOption);
  // Timer
  useInterval(() => {
    if (testStatus === "started") {
      if (timeRemaining > 0) {
        setTimeRemaining(timeRemaining - 1);
      } else {
        // Send testCompleted action to store
        dispatch(testCompleted());
        // Timer should be unmounted along with TypingTest
      }
    }
  }, 1000);

  // Setup timer UI
  let formattedTime = new Date(0);
  formattedTime.setSeconds(timeRemaining);

  return (
    <div className="timer">
      {status === "started" ? formattedTime.toISOString().slice(17, 19) : null}
    </div>
  );
};

export default Timer;
