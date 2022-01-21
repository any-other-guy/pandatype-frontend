import React from "react";
import { useSelector } from "react-redux";
import "./App.css";
import Header from "./app/Header";
import Footer from "./app/Footer";
import TestResult from "./features/TypingTest/TestResult";
import TypingTest from "./features/TypingTest/TypingTest";
import StatsTracker from "./features/TypingTest/StatsTracker";
import ZhTypingTest from "./features/TypingTest/ZhTypingTest";
import Leaderboard from "./features/Leaderboard/Leaderboard";
import LoginForm from "./features/Auth/LoginForm";
import Settings from "./features/Settings/Settings";

const App = () => {
  // Not using testStatus as a flag to prevent rerender when the test started
  const isTestCompleted = useSelector(
    (state) => state.typingtest.isTestCompleted
  );
  const language = useSelector((state) => state.typingtest.options.language);

  const showTypingtest = useSelector(
    (state) => state.typingtest.showTypingtest
  );
  const showSettings = useSelector((state) => state.settings.showSettings);
  const showLoginForm = useSelector((state) => state.auth.showLoginForm);

  return (
    <div className="mainWrapper">
      {/* top section */}
      <Header />
      {/* middle section */}
      {showTypingtest ? (
        isTestCompleted ? (
          <TestResult />
        ) : language === "zh" ? (
          <ZhTypingTest />
        ) : (
          <TypingTest />
        )
      ) : null}

      {/* Hidden at start*/}
      <StatsTracker />
      <Leaderboard />
      {showSettings ? <Settings /> : null}
      {showLoginForm ? <LoginForm /> : null}

      {/* bottom section */}
      <Footer />
    </div>
  );
};

export default App;
