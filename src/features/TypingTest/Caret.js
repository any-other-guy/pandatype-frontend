import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const Caret = ({ left }) => {
  const status = useSelector((state) => state.typingtest.status);
  const [cursorClassname, setCursorClassname] = useState('cursor');

  useEffect(() => {
    if (status === 'started') {
      setCursorClassname('cursor_started');
    }
  }, [status]);

  return (
    <span className={cursorClassname} style={{ left }}>
      |
    </span>
  );
};

Caret.propTypes = {
  left: PropTypes.number.isRequired,
};

export default Caret;
