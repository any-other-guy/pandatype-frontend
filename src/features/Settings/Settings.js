import React from "react";
import { saveState } from "../../app/localStorage";
import { setTheme } from "../../utils/utils";
import Themes from "./themes";

const Settings = () => {
  const _setTheme = (themeObj) => {
    saveState(themeObj, "theme");
    setTheme(themeObj);
  };

  let themes = Themes.map((theme) => {
    let classname = "themeSelection " + theme.name;
    let style = {
      color: theme["main-color"],
      backgroundColor: theme["bg-color"],
    };
    return (
      <div
        key={theme.name}
        className={classname}
        style={style}
        onClick={() => _setTheme(theme)}
      >
        {theme.name}
      </div>
    );
  });

  return <div className="settings">{themes}</div>;
};

export default Settings;
