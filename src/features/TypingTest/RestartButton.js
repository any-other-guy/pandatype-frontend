import React, { useState } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { useKeyPress } from "./keypressHook";
import { resetTestAction } from "./typingtestSlice";

const RestartButton = ({ testLanguage, testMode }) => {
  const dispatch = useDispatch();

  useKeyPress((key) => {
    if (key !== "Tab" && key !== "Enter") return;
    if (!isHighlighted && key === "Tab") setIsHighlighted(!isHighlighted);
    if (isHighlighted && key === "Enter") {
      dispatch(
        resetTestAction({ testLanguage: testLanguage, testMode: testMode })
      );
      setIsHighlighted(false);
    }
  });
  const [isHighlighted, setIsHighlighted] = useState(false);
  const highlighted = isHighlighted ? "highlighted" : "";
  const color = isHighlighted ? "MediumSpringGreen" : "#646669";
  const classes = `restartButton ${highlighted}`;
  return (
    <div className="restartButtonWrapper">
      <div
        className={classes}
        onMouseOver={() => setIsHighlighted(true)}
        onMouseLeave={() => setIsHighlighted(false)}
        onClick={() =>
          dispatch(
            resetTestAction({ testLanguage: testLanguage, testMode: testMode })
          )
        }
      >
        <VscDebugRestart size={"1.25rem"} color={color} />
      </div>
    </div>
  );
};

export default RestartButton;