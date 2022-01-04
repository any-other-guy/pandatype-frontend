import React from 'react'
import { AiFillAlipayCircle } from "react-icons/ai";
const Header = () => {
  return (
    <div className='headerWrapper'>
      <div className='logo'>
        pandatype
      </div>
      <div className="navbar">
        <div className="icon"><AiFillAlipayCircle size={"1.5rem"} /></div>
        <div className="icon"><AiFillAlipayCircle size={"1.5rem"} /></div>
        <div className="icon"><AiFillAlipayCircle size={"1.5rem"} /></div>
        <div className="icon"><AiFillAlipayCircle size={"1.5rem"} /></div>
        <div className="icon"><AiFillAlipayCircle size={"1.5rem"} /></div>
      </div>

      <div className="configGroupWrapper">
        <div className="configGroup">
          <div className="text-button" mode="chinese">中文</div>
          <div className="text-button" mode="english">ENG</div>
        </div>
        <div className="configGroup">
          <div className="text-button" mode="time">time</div>
          <div className="text-button" mode="word">word</div>
          <div className="text-button" mode="quote">quote</div>
        </div>
        <div className="configGroup">
          <div className="text-button" mode="15">15</div>
          <div className="text-button" mode="30">30</div>
          <div className="text-button" mode="60">60</div>
        </div>
        <div className="configGroup">
          <div className="text-button" mode="10">15</div>
          <div className="text-button" mode="25">25</div>
          <div className="text-button" mode="50">50</div>
          <div className="text-button" mode="100">100</div>
        </div>
      </div>

    </div>
  )
}

export default Header
