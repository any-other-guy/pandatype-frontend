import React, { useRef, useEffect, useState } from "react";
import { getZhStrLength, useComponentDidUpdate } from "../../utils/utils";
import ZhZi from "./ZhZi";

const ZhQuote = ({ ziIds }) => {
  const inputFields = useRef([]);
  const currentField = useRef(0);
  const ziPerLine = 38;
  const linesToRemove = useRef(3);
  const [rerender, setRerender] = useState(0);
  let content;
  useEffect(() => {
    inputFields.current[0].focus();
  }, []);

  useComponentDidUpdate(() => {});

  const onInputChange = (e) => {
    let zhStrLength = getZhStrLength(
      inputFields.current[currentField.current].value
    );
    if (zhStrLength >= ziPerLine) {
      // Append extra Zi into the next line as well
      let appendToNextLine = "";
      if (zhStrLength > ziPerLine) {
        appendToNextLine = inputFields.current[currentField.current].value
          .split("")
          .slice(-(zhStrLength - ziPerLine))
          .join("");
      }

      // and remove extra from current line
      // inputFields.current[currentField.current].value = inputFields.current[
      //   currentField.current
      // ].value.slice(0, -appendToNextLine.length);

      // Move cursor to the next line
      currentField.current++;
      inputFields.current[currentField.current].focus();
      inputFields.current[currentField.current].value += appendToNextLine;

      // remove first line
      linesToRemove.current += ziPerLine + 2;
      setRerender(rerender + 1);
    }
  };

  content = ziIds.reduce((list, ziId, index) => {
    if (index === 0)
      list.push(
        <span key={`spacer${ziId}${index}1`} className="zhQuoteLineSpacer">
          &nbsp;
        </span>
      );
    if (index % ziPerLine === 0) {
      list.push(
        <input
          key={index}
          ref={(input) => inputFields.current.push(input)}
          type="text"
          onChange={onInputChange}
        ></input>
      );
      list.push(
        <span key={`spacer${ziId}${index}2`} className="zhQuoteLineSpacer">
          &nbsp;
        </span>
      );
    }
    list.push(<ZhZi key={`${ziId}${index}`} ziId={ziId} />);

    if (index === ziIds.length - 1) {
      list.push(
        <span key={`spacer${ziId}${index}1`} className="zhQuoteLineSpacer">
          &nbsp;
        </span>
      );
      list.push(
        <input
          key={index}
          ref={(input) => inputFields.current.push(input)}
          type="text"
          onChange={onInputChange}
        ></input>
      );
    }

    return list;
  }, []);
  content.splice(0, linesToRemove.current);

  return <div className="zhQuote">{content}</div>;
};

export default ZhQuote;
