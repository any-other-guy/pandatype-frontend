/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef } from 'react';
import { FaGithub, FaPalette } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { loadState } from './localStorage';

const Footer = () => {
  const testStatus = useSelector((state) => state.typingtest.status);
  const language = useSelector((state) => state.typingtest.options.language);
  const footer = useRef(null);

  // hide when test is started
  useEffect(() => {
    if (testStatus === 'started') {
      footer.current.classList.add('transparent');
    } else if (testStatus === 'unstarted' || testStatus === 'completed') {
      footer.current.classList.remove('transparent');
    }
  }, [testStatus]);

  const text = {
    en: 'restart test',
    zh: '重开吧',
  }[language];

  return (
    <div className="footerWrapper">
      <div className="keyTips">
        <span>tab</span> + <span>Enter</span>
        {` = ${text}`}
        <br />
        <br />
      </div>
      <div className="footer" ref={footer}>
        <div className="linksGroup">
          <a href="https://github.com/any-other-guy/pandatype-frontend" tabIndex="-1">
            <FaGithub size="12px" />
            <span className="link">Github</span>
          </a>
        </div>
        <div className="themeVersion">
          <a href="#" tabIndex="-1">
            <FaPalette size="12px" />
            <span className="link">{loadState('theme')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
