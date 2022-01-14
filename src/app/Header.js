import React from "react";
import { AiFillAlipayCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { resetTestAction } from "../features/TypingTest/typingtestSlice";

const Header = () => {
  const dispatch = useDispatch();

  const markAllSiblingNotActive = ({ parentNode }) => {
    parentNode.childNodes.forEach((child) => {
      if (child.classList.contains("active")) {
        child.classList.remove("active");
      }
    });
  };

  const selectLanguage = ({ target }) => {
    //TODO: change here after adding multi language support
    // dispatch(setLanguageAction({ language: target.getAttribute("mode") }));
    markAllSiblingNotActive(target);
    target.classList.add("active");
  };

  const setTestMode = ({ target }) => {
    let mode = target.getAttribute("mode");
    // dispatch(setTestModeAction({ mode: mode }));
    dispatch(resetTestAction({ options: { mode: mode } }));
    markAllSiblingNotActive(target);
    target.classList.add("active");
    target.parentNode.parentNode.childNodes.forEach((node, index) => {
      if (node.classList.contains(`${mode}Options`)) {
        node.classList.remove("hidden");
      } else if (!node.classList.contains("modeOptions")) {
        node.classList.add("hidden");
      }
    });
  };
  const setTestTimeOption = ({ target }) => {
    let testTimeOption = target.getAttribute("mode");
    // dispatch(setTestTimeOptionAction({ mode: target.getAttribute("mode") }));
    dispatch(resetTestAction({ options: { time: testTimeOption } }));
    markAllSiblingNotActive(target);
    target.classList.add("active");
  };
  const setTestWordsOption = ({ target }) => {
    let testWordsOption = target.getAttribute("mode");
    // dispatch(setTestWordOptionAction({ mode: target.getAttribute("mode") }));
    dispatch(resetTestAction({ options: { words: testWordsOption } }));
    markAllSiblingNotActive(target);
    target.classList.add("active");
  };
  const setTestQuoteOption = ({ target }) => {
    let testQuoteOption = target.getAttribute("mode");
    // dispatch(setTestQuoteOptionAction({ mode: target.getAttribute("mode") }));
    dispatch(resetTestAction({ options: { quote: testQuoteOption } }));
    markAllSiblingNotActive(target);
    target.classList.add("active");
  };

  return (
    <div className="headerWrapper">
      <div className="logo">pandatype</div>
      <div className="navbar">
        <div className="icon">
          <AiFillAlipayCircle size={"1.5rem"} />
        </div>
        <div className="icon">
          <AiFillAlipayCircle size={"1.5rem"} />
        </div>
        <div className="icon">
          <AiFillAlipayCircle size={"1.5rem"} />
        </div>
        <div className="icon">
          <AiFillAlipayCircle size={"1.5rem"} />
        </div>
        <div className="icon">
          <AiFillAlipayCircle size={"1.5rem"} />
        </div>
      </div>

      <div className="configGroupWrapper">
        <div className="configGroup modeOptions">
          <div
            className="text-button"
            mode="chinese"
            onClick={(e) => selectLanguage(e)}
          >
            中文
          </div>
          <div
            className="text-button active"
            mode="english"
            onClick={(e) => selectLanguage(e)}
          >
            ENG
          </div>
        </div>
        <div className="configGroup modeOptions">
          <div
            className="text-button active"
            mode="time"
            onClick={(e) => setTestMode(e)}
          >
            time
          </div>
          <div
            className="text-button"
            mode="words"
            onClick={(e) => setTestMode(e)}
          >
            words
          </div>
          <div
            className="text-button"
            mode="quote"
            onClick={(e) => setTestMode(e)}
          >
            quote
          </div>
        </div>
        <div className="configGroup timeOptions">
          <div
            className="text-button"
            mode="15"
            onClick={(e) => setTestTimeOption(e)}
          >
            15
          </div>
          <div
            className="text-button active"
            mode="30"
            onClick={(e) => setTestTimeOption(e)}
          >
            30
          </div>
          <div
            className="text-button"
            mode="60"
            onClick={(e) => setTestTimeOption(e)}
          >
            60
          </div>
        </div>
        <div className="configGroup wordsOptions hidden">
          <div
            className="text-button"
            mode="10"
            onClick={(e) => setTestWordsOption(e)}
          >
            10
          </div>
          <div
            className="text-button"
            mode="25"
            onClick={(e) => setTestWordsOption(e)}
          >
            25
          </div>
          <div
            className="text-button active"
            mode="50"
            onClick={(e) => setTestWordsOption(e)}
          >
            50
          </div>
          <div
            className="text-button"
            mode="100"
            onClick={(e) => setTestWordsOption(e)}
          >
            100
          </div>
        </div>
        <div className="configGroup quoteOptions hidden">
          <div
            className="text-button"
            mode="all"
            onClick={(e) => setTestQuoteOption(e)}
          >
            all
          </div>
          <div
            className="text-button"
            mode="short"
            onClick={(e) => setTestQuoteOption(e)}
          >
            short
          </div>
          <div
            className="text-button active"
            mode="medium"
            onClick={(e) => setTestQuoteOption(e)}
          >
            medium
          </div>
          <div
            className="text-button"
            mode="long"
            onClick={(e) => setTestQuoteOption(e)}
          >
            long
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
