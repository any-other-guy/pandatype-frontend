/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { VscDebugRestart } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';
import { useKeyPress } from './keypressHook';
import { resetTestAction } from './typingtestSlice';

const RestartButton = () => {
  const dispatch = useDispatch();
  const [isHighlighted, setIsHighlighted] = useState(false);

  useKeyPress((key) => {
    if (key !== 'Tab' && key !== 'Enter') return;
    if (!isHighlighted && key === 'Tab') setIsHighlighted(!isHighlighted);
    if (isHighlighted && key === 'Enter') {
      dispatch(resetTestAction({ options: {} }));
      setIsHighlighted(false);
    }
  });
  const classname = `restartButton ${isHighlighted ? 'highlighted' : ''}`;
  return (
    <div className="restartButtonWrapper">
      <div
        className={classname}
        onMouseOver={() => setIsHighlighted(true)}
        onMouseLeave={() => setIsHighlighted(false)}
        onClick={() => dispatch(resetTestAction({ options: {} }))}
      >
        <VscDebugRestart size="1.25rem" />
      </div>
    </div>
  );
};

export default RestartButton;
