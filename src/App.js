import React from "react";
import { useSelector } from "react-redux";
import "./App.css";
import TestResult from "./features/TypingTest/TestResult";
import TypingTest from "./features/TypingTest/TypingTest";

const App = () => {
  const testStatus = useSelector((state) => state.typingtest.testStatus);

  return (
    <div>
      {testStatus === 'completed' ? <TestResult /> : <TypingTest />}
    </div>
  );
};

export default App;
