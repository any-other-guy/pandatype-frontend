import React from "react";
import { AiFillAlipayCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import {
  setLanguageAction,
  setTestModeAction,
  setTestTimeOptionAction,
  setTestWordOptionAction,
  setTestQuoteOptionAction,
} from "../features/TypingTest/typingtestSlice";

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
    dispatch(setLanguageAction({ mode: target.getAttribute("mode") }));
    markAllSiblingNotActive(target);
    target.classList.add("active");
  };
  const setTestMode = ({ target }) => {
    let mode = target.getAttribute("mode");
    dispatch(setTestModeAction({ mode: mode }));
    markAllSiblingNotActive(target);
    target.classList.add("active");
    target.parentNode.parentNode.childNodes.forEach((node, index) => {
      if(node.classList.contains(`${mode}Options`)){
        node.classList.remove("hidden");
      }
      else if(!node.classList.contains('modeOptions')){
        node.classList.add("hidden");
      }
    })

  };
  const setTestTimeOption = ({ target }) => {
    dispatch(setTestTimeOptionAction({ mode: target.getAttribute("mode") }));
    markAllSiblingNotActive(target);
    target.classList.add("active");
  };
  const setTestWordOption = ({ target }) => {
    dispatch(setTestWordOptionAction({ mode: target.getAttribute("mode") }));
    markAllSiblingNotActive(target);
    target.classList.add("active");
  };
  const setTestQuoteOption = ({ target }) => {
    dispatch(setTestQuoteOptionAction({ mode: target.getAttribute("mode") }));
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
        <div className="configGroup wordOptions hidden">
          <div
            className="text-button"
            mode="10"
            onClick={(e) => setTestWordOption(e)}
          >
            10
          </div>
          <div
            className="text-button"
            mode="25"
            onClick={(e) => setTestWordOption(e)}
          >
            25
          </div>
          <div
            className="text-button active"
            mode="50"
            onClick={(e) => setTestWordOption(e)}
          >
            50
          </div>
          <div
            className="text-button"
            mode="100"
            onClick={(e) => setTestWordOption(e)}
          >
            100
          </div>
        </div>
        <div className="configGroup quoteOptions hidden">
          <div
            className="text-button"
            mode="all"
            onClick={(e) => setTestQuoteOptionAction(e)}
          >
            all
          </div>
          <div
            className="text-button"
            mode="short"
            onClick={(e) => setTestQuoteOptionAction(e)}
          >
            short
          </div>
          <div
            className="text-button active"
            mode="medium"
            onClick={(e) => setTestQuoteOptionAction(e)}
          >
            medium
          </div>
          <div
            className="text-button"
            mode="long"
            onClick={(e) => setTestQuoteOptionAction(e)}
          >
            long
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
