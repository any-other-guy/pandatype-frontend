import React from "react";
import { useSelector } from "react-redux";
import "./App.css";
import Header from "./app/Header";
import Footer from "./app/Footer";
import TestResult from "./features/TypingTest/TestResult";
import TypingTest from "./features/TypingTest/TypingTest";
import StatsTracker from "./features/TypingTest/StatsTracker";
import ZhTypingTest from "./features/TypingTest/ZhTypingTest";

const App = () => {
  // Not using testStatus as a flag to prevent rerender when the test started
  const isTestCompleted = useSelector(
    (state) => state.typingtest.isTestCompleted
  );

  const language = useSelector((state) => state.typingtest.options.language);
  return (
    <div className="mainWrapper">
      <Header />
      {/* The test */}
      {isTestCompleted ? (
        <TestResult />
      ) : language === "zh" ? (
        <ZhTypingTest />
      ) : (
        <TypingTest />
      )}
      {/* Hidden stat tracker */}
      <StatsTracker />
      <Footer />
    </div>
  );
};

export default App;
