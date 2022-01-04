import React from "react";
import { useSelector } from "react-redux";
import "./App.css";
import Header from "./app/Header";
import Footer from "./app/Footer"
import TestResult from "./features/TypingTest/TestResult";
import TypingTest from "./features/TypingTest/TypingTest";

const App = () => {
  const testStatus = useSelector((state) => state.typingtest.testStatus);

  return (
    <div className='mainWrapper'>
      <Header />
      {testStatus === 'completed' ? <TestResult /> : <TypingTest />}
      <Footer />
    </div>
  );
};

export default App;
