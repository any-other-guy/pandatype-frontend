import React from 'react'
import { AiFillGithub } from "react-icons/ai";

const Footer = () => {

  return (
    <div className='footerWrapper'>
      <div className='keyTips'>
        <span>tab</span>+<span>Enter</span> - restart test<br/>
        <br/>
        {/* <span>esc</span> or <span>ctrl/cmd</span>+<span>shift</span>+<span>p</span> - command line */}
      </div>
      <div className='footer'>
        <div className='linksGroup'>
          <a href=''>
            <AiFillGithub />
            <span>Github</span>
          </a>
        </div>
        <div className='themeVersion'>
          <a href=''>
            <AiFillGithub />
            <span>Github</span>
          </a>
          <a href=''>
            <AiFillGithub />
            <span>Github</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Footer
