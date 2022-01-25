import React from 'react';
import { FaGithub, FaPalette } from 'react-icons/fa';
import { loadState } from './localStorage';

const Footer = () => (
  <div className="footerWrapper">
    <div className="keyTips">
      <span>tab</span>+<span>Enter</span> - restart test
      <br />
      <br />
      {/* <span>esc</span> or <span>ctrl/cmd</span>+<span>shift</span>+<span>p</span> - command line */}
    </div>
    <div className="footer">
      <div className="linksGroup">
        <a href="https://github.com/any-other-guy/pandatype-frontend">
          <FaGithub size="12px" />
          <span className="link">Github</span>
        </a>
      </div>
      <div className="themeVersion">
        <a href="https://github.com/any-other-guy/pandatype-frontend">
          <FaPalette size="12px" />
          <span className="link">{loadState('theme').name}</span>
        </a>
      </div>
    </div>
  </div>
);

export default Footer;
