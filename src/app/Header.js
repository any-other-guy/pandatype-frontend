/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef } from 'react';
import { FaKeyboard, FaCrown, FaCog, FaUserAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { showLeaderboardAction } from '../features/Leaderboard/leaderboardSlice';
import { resetTestAction, showTypingtestAction } from '../features/TypingTest/typingtestSlice';
import { showSettingsAction } from '../features/Settings/settingsSlice';
import { showLoginFormAction } from '../features/Auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();

  // TODO: 研究下这样会不会只更改state.typingtest里面任何的obj就会trigger rerender? 不过反正结算界面目前也没修改typingtest state里的东西的
  const { language, mode, time, words, quote } = useSelector((state) => state.typingtest.options);

  const showTypingtest = useSelector((state) => state.typingtest.showTypingtest);
  const showSettings = useSelector((state) => state.settings.showSettings);
  const showLoginForm = useSelector((state) => state.auth.showLoginForm);

  const handleShowHide = (nextTabName) => {
    const showHide = [
      {
        name: 'typingtest',
        show: showTypingtest,
        dispatch: showTypingtestAction,
      },
      { name: 'settings', show: showSettings, dispatch: showSettingsAction },
      {
        name: 'loginform',
        show: showLoginForm,
        dispatch: showLoginFormAction,
      },
    ];

    // hide/show components
    const current = showHide.find((tab) => tab.show);
    if (nextTabName !== current.name) {
      // hide current
      dispatch(showHide.find((tab) => tab.show).dispatch({ show: false }));
      // show next
      dispatch(showHide.find((tab) => tab.name === nextTabName).dispatch({ show: true }));
    } else if (nextTabName === 'typingtest' && nextTabName === current.name) {
      dispatch(resetTestAction({ options: {} }));
    }
  };

  const configGroupWrapper = useRef(null);

  useEffect(() => {
    // Initialize options UI
    Array.from(
      Array.from(configGroupWrapper.current.childNodes).find(
        (node) => node.id === 'languageOptions'
      ).childNodes
    )
      .find((node) => node.getAttribute('mode') === language.toString())
      .classList.add('active');
    Array.from(
      Array.from(configGroupWrapper.current.childNodes).find((node) => node.id === 'modeOptions')
        .childNodes
    )
      .find((node) => node.getAttribute('mode') === mode.toString())
      .classList.add('active');

    Array.from(
      Array.from(configGroupWrapper.current.childNodes).find((node) => node.id === 'timeOptions')
        .childNodes
    )
      .find((node) => node.getAttribute('mode') === time.toString())
      .classList.add('active');
    Array.from(
      Array.from(configGroupWrapper.current.childNodes).find((node) => node.id === 'wordsOptions')
        .childNodes
    )
      .find((node) => node.getAttribute('mode') === words.toString())
      .classList.add('active');
    Array.from(
      Array.from(configGroupWrapper.current.childNodes).find((node) => node.id === 'quoteOptions')
        .childNodes
    )
      .find((node) => node.getAttribute('mode') === quote.toString())
      .classList.add('active');

    Array.from(configGroupWrapper.current.childNodes)
      .find((node) => node.id === `${mode}Options`)
      .classList.remove('display-none');
  }, []);

  const markAllSiblingNotActive = ({ parentNode }) => {
    parentNode.childNodes.forEach((child) => {
      if (child.classList.contains('active')) {
        child.classList.remove('active');
      }
    });
  };

  const selectLanguage = ({ target }) => {
    const testLanguageOption = target.getAttribute('mode');
    dispatch(resetTestAction({ options: { language: testLanguageOption } }));
    markAllSiblingNotActive(target);
    target.classList.add('active');
  };

  const setTestMode = ({ target }) => {
    const _mode = target.getAttribute('mode');
    dispatch(resetTestAction({ options: { mode: _mode } }));
    markAllSiblingNotActive(target);
    target.classList.add('active');
    target.parentNode.parentNode.childNodes.forEach((node) => {
      if (node.classList.contains(`${_mode}Options`)) {
        node.classList.remove('display-none');
      } else if (!node.classList.contains('modeOptions')) {
        node.classList.add('display-none');
      }
    });
  };
  const setTestTimeOption = ({ target }) => {
    const testTimeOption = target.getAttribute('mode');
    dispatch(resetTestAction({ options: { time: testTimeOption } }));
    markAllSiblingNotActive(target);
    target.classList.add('active');
  };
  const setTestWordsOption = ({ target }) => {
    const testWordsOption = target.getAttribute('mode');
    dispatch(resetTestAction({ options: { words: testWordsOption } }));
    markAllSiblingNotActive(target);
    target.classList.add('active');
  };
  const setTestQuoteOption = ({ target }) => {
    const testQuoteOption = target.getAttribute('mode');
    dispatch(resetTestAction({ options: { quote: testQuoteOption } }));
    markAllSiblingNotActive(target);
    target.classList.add('active');
  };

  return (
    <div className="headerWrapper">
      <div className="logo">pandatype</div>
      <div className="navbar">
        <div className="icon" onClick={() => handleShowHide('typingtest')}>
          <FaKeyboard size="1.2rem" />
        </div>
        <div className="icon">
          <FaCrown size="1.2rem" onClick={() => dispatch(showLeaderboardAction({ show: true }))} />
        </div>
        {/* <div className="icon">
          <FaInfo size={"1.2rem"} />
        </div> */}
        <div className="icon" onClick={() => handleShowHide('settings')}>
          <FaCog size="1.2rem" />
        </div>
        <div className="icon">
          <FaUserAlt size="1.2rem" onClick={() => handleShowHide('loginform')} />
        </div>
      </div>

      <div className="configGroupWrapper" ref={configGroupWrapper}>
        <div className="configGroup modeOptions" id="languageOptions">
          <div className="text-button" mode="zh" onClick={(e) => selectLanguage(e)}>
            中文
          </div>
          <div className="text-button" mode="en" onClick={(e) => selectLanguage(e)}>
            ENG
          </div>
        </div>
        <div className="configGroup modeOptions" id="modeOptions">
          <div className="text-button" mode="time" onClick={(e) => setTestMode(e)}>
            time
          </div>
          <div className="text-button" mode="words" onClick={(e) => setTestMode(e)}>
            words
          </div>
          <div className="text-button" mode="quote" onClick={(e) => setTestMode(e)}>
            quote
          </div>
        </div>
        <div className="configGroup timeOptions display-none" id="timeOptions">
          <div className="text-button" mode="15" onClick={(e) => setTestTimeOption(e)}>
            15
          </div>
          <div className="text-button" mode="30" onClick={(e) => setTestTimeOption(e)}>
            30
          </div>
          <div className="text-button" mode="60" onClick={(e) => setTestTimeOption(e)}>
            60
          </div>
        </div>
        <div className="configGroup wordsOptions display-none" id="wordsOptions">
          <div className="text-button" mode="10" onClick={(e) => setTestWordsOption(e)}>
            10
          </div>
          <div className="text-button" mode="25" onClick={(e) => setTestWordsOption(e)}>
            25
          </div>
          <div className="text-button" mode="50" onClick={(e) => setTestWordsOption(e)}>
            50
          </div>
          <div className="text-button" mode="100" onClick={(e) => setTestWordsOption(e)}>
            100
          </div>
        </div>
        <div className="configGroup quoteOptions display-none" id="quoteOptions">
          <div className="text-button" mode="all" onClick={(e) => setTestQuoteOption(e)}>
            all
          </div>
          <div className="text-button" mode="short" onClick={(e) => setTestQuoteOption(e)}>
            short
          </div>
          <div className="text-button" mode="medium" onClick={(e) => setTestQuoteOption(e)}>
            medium
          </div>
          <div className="text-button" mode="long" onClick={(e) => setTestQuoteOption(e)}>
            long
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
