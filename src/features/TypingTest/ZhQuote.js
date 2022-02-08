/* eslint-disable react/no-array-index-key */
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { getZhStrLength } from '../../utils/utils';
import { zhQuoteInputAction } from './typingtestSlice';
import ZhZi from './ZhZi';

const ZhQuote = ({ ziIds }) => {
  const inputFields = useRef([]);
  const currentField = useRef(0);
  const ziPerLine = 38;
  const linesToRemove = useRef(3);
  const [rerender, setRerender] = useState(0);
  const typedString = useRef('');
  const dispatch = useDispatch();

  useEffect(() => {
    inputFields.current[currentField.current].focus();
    inputFields.current[currentField.current].addEventListener('keydown', (e) => {
      if (e.which === 9) {
        e.preventDefault();
      }
    });
  }, []);

  const onInputChange = () => {
    const currentTypedValue = inputFields.current[currentField.current].value;
    typedString.current = inputFields.current.reduce((str, field, index) => {
      if (index <= currentField.current && field != null) {
        str = str.concat(field.value);
      }
      return str;
    }, '');
    dispatch(zhQuoteInputAction({ inputString: typedString.current }));

    // "auto scrolling" visual effect
    const zhStrLength = getZhStrLength(currentTypedValue);
    if (zhStrLength >= ziPerLine) {
      // Append extra Zi into the next line as well
      let appendToNextLine = '';
      if (zhStrLength > ziPerLine) {
        appendToNextLine = inputFields.current[currentField.current].value
          .split('')
          .slice(-(zhStrLength - ziPerLine))
          .join('');
      }

      // and remove extra from current line
      inputFields.current[currentField.current].value = inputFields.current[
        currentField.current
      ].value.slice(0, -appendToNextLine.length);

      // Move cursor to the next line
      currentField.current += 1;
      inputFields.current[currentField.current].focus();
      inputFields.current[currentField.current].value += appendToNextLine;

      // remove first line
      linesToRemove.current += ziPerLine + 2;
      setRerender(rerender + 1);
    }
  };

  const content = ziIds.reduce((list, ziId, index) => {
    if (index === 0)
      list.push(
        <span key={`spacer${ziId}${index}1`} className="zhQuoteLineSpacer">
          &nbsp;
        </span>
      );
    if (index % ziPerLine === 0) {
      list.push(
        <input
          key={`input${ziId}${index}`}
          ref={(input) => inputFields.current.push(input)}
          type="text"
          onChange={onInputChange}
        />
      );
      list.push(
        <span key={`spacer${ziId}${index}2`} className="zhQuoteLineSpacer">
          &nbsp;
        </span>
      );
    }
    list.push(<ZhZi key={`zi${ziId}${index}`} ziId={ziId} />);

    if (index === ziIds.length - 1) {
      list.push(
        <span key={`spacer${ziId}${index}1`} className="zhQuoteLineSpacer">
          &nbsp;
        </span>
      );
      list.push(
        <input
          key={`input${ziId}${index}`}
          ref={(input) => inputFields.current.push(input)}
          type="text"
          onChange={onInputChange}
        />
      );
    }

    return list;
  }, []);
  content.splice(0, linesToRemove.current);
  return <div className="zhQuote">{content}</div>;
};

ZhQuote.propTypes = {
  ziIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ZhQuote;
