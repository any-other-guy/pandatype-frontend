<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!-- <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h3 align="center">pandatype</h3>

  <p align="center">
    <p>A competitive typing speed testing, traning, and ranking front-end web application with a minimalistic design, supports typing tests in multiple languages (EN/zhCN).</p>
    <p> 中英文打字速度测试/排行榜的一个网站</p>
  </p>
</div>

![til](./demo.gif)

<p align="center">
    <a href="https://pandatype.chuankai.me/"><strong>Try It Out HERE! 项目展示»</strong></a>
    <br><br/>
    <a href="https://github.com/any-other-guy/pandatype-backend">Backend repo</a>
    ·
    <a href="https://github.com/any-other-guy/pandatype-frontend/issues">Report Bug</a>
    ·
    <a href="https://github.com/any-other-guy/pandatype-frontend/issues">Request Feature</a>
    <br><br/>
  </p>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Pandatype was greatly inspired by [Monkeytype](https://monkeytype.com/), a beloved minimalistic typing test web application. However, it lacks a proper implementation on featuring typing tests with Chinese characters, *hanzi 汉字*, and its romanization system, *pinyin 拼音*. Therefore, to enhance the typing test experience for Chinese typists/speakers, Pandatype saw this opportunity and was created in a similar fashion in terms of visual design, enhanced word sets and testing methodology, especially for the Simplified Chinese language.

就是也想搞个玩中文打字测试，也能体验类似用国外英文打字网站Monkeytype打英文时的那种爽感。界面设计基本参考了人家的，在呈现简体中文词汇和句子打字测试的方面做了一些更加贴近本土化的修改和增强。

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

Front end:
* [React.js](https://reactjs.org/) - pandatype's UI components are coded in JavaScript
* [Redux](https://redux.js.org/) - state management with Redux Toolkit, it also offers redux store setup, creating reducers, updating immutable states in reducers in a convenient way, and much more.
* [Chart.js](https://www.chartjs.org/) - data visualization for result statistics of a typing test

Back end:
* [Spring Boot](https://spring.io/projects/spring-boot) -  built a number of RESTful API microservices
* [Spring Security](https://spring.io/projects/spring-security) - mainly used to handle user authentication with JWK token
* [MyBatis](https://mybatis.org/mybatis-3/) - to access database
* [MySQL](https://hub.docker.com/_/mysql) - relational database storing word sets, leaderboard records, user account, etc
* [Docker](https://www.docker.com/) - to containerize backend services for easier times during deployment

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Typing test
    - [x] take tests in mutiple modes (time/words/quote)
    - [x] word sets for mutiple languages (EN/zhCN)
    - [x] result screen displays typing test statistics in numbers and graph
- [x] Leaderboard
- [x] Customizable theme
- [x] Account system
- [ ] User dashboard


<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

Make sure the [backend services](https://github.com/any-other-guy/pandatype-backend) are up and running locally.
   ```sh
   git clone https://github.com/any-other-guy/pandatype-backend.git
   cd pandatype-backend
   bash local.sh
   ```


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/any-other-guy/pandatype-frontend.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run the app in the development mode. Open http://localhost:3000 to view it in the browser.
   ```sh
   npm start
   ```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []() UI/UX design is inspired by [Monkeytype](https://monkeytype.com/)
* []() List of the most frequently used chinese words taken from [webdict](https://github.com/ling0322/webdict)
* []() Converted chinese character to pinyin with [pypinyin](https://github.com/mozillazg/python-pinyin)

<p align="right">(<a href="#top">back to top</a>)</p>

