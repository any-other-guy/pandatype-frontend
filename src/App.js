import React from "react";
import { useSelector } from "react-redux";
import "./App.css";
import Header from "./app/Header";
import Footer from "./app/Footer"
import TestResult from "./features/TypingTest/TestResult";
import TypingTest from "./features/TypingTest/TypingTest";

const App = () => {
  // Not using testStatus as a flag to prevent rerender when the test started
  const isTestCompleted = useSelector((state) => state.typingtest.isTestCompleted);

  return (
    <div className='mainWrapper'>
      <Header />
      {isTestCompleted ? <TestResult /> : <TypingTest />}
      <Footer />
    </div>
  );
};

export default App;
