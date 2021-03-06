import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import './App.css';
import Header from './app/Header';
import Footer from './app/Footer';
import TestResult from './features/TypingTest/TestResult';
import TypingTest from './features/TypingTest/TypingTest';
import StatsTracker from './features/TypingTest/StatsTracker';
import ZhTypingTest from './features/TypingTest/ZhTypingTest';
import Leaderboard from './features/Leaderboard/Leaderboard';
import LoginForm from './features/Auth/LoginForm';
import Settings from './features/Settings/Settings';
import { loadState, saveState } from './app/localStorage';
import { setTheme } from './utils/utils';
import Themes from './features/Settings/themes.json';
import { setAuthFromCookie } from './features/Auth/authSlice';

const App = () => {
  const dispatch = useDispatch();
  // Not using testStatus as a flag to prevent rerender when the test started
  const isTestCompleted = useSelector((state) => state.typingtest.isTestCompleted);
  const language = useSelector((state) => state.typingtest.options.language);

  const showTypingtest = useSelector((state) => state.typingtest.showTypingtest);
  const showLeaderboard = useSelector((state) => state.leaderboard.showLeaderboard);
  const showSettings = useSelector((state) => state.settings.showSettings);
  const showLoginForm = useSelector((state) => state.auth.showLoginForm);

  const [cookie, setCookie, removeCookie] = useCookies([]);

  // Load initial settings
  if (loadState('theme') === undefined) {
    saveState('panda', 'theme');
  } else {
    setTheme(Themes.find((theme) => theme.name === loadState('theme')));
  }

  useEffect(() => {
    if (cookie.username !== undefined && cookie.token !== undefined) {
      dispatch(setAuthFromCookie({ username: cookie.username, token: cookie.token }));
    }
  }, []);

  const username = useSelector((state) => state.auth.username);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (username === null && token === null) return;
    setCookie('username', username, { path: '/' });
    setCookie('token', token, { path: '/' });
  }, [username, token]);

  let TypingTestComponent = null;

  if (showTypingtest) {
    if (isTestCompleted) {
      TypingTestComponent = <TestResult />;
    } else if (language === 'zh') {
      TypingTestComponent = <ZhTypingTest />;
    } else {
      TypingTestComponent = <TypingTest />;
    }
  }

  return (
    <div className="mainWrapper">
      {/* top section */}
      <Header />

      {/* middle section */}
      <div className="middleSection">
        {TypingTestComponent}

        {/* Hidden at start */}
        {showTypingtest ? <StatsTracker /> : null}
        {showLeaderboard ? <Leaderboard /> : null}
        {showSettings ? <Settings /> : null}
        {showLoginForm ? <LoginForm /> : null}
      </div>

      {/* bottom section */}
      <Footer />
    </div>
  );
};

export default App;
