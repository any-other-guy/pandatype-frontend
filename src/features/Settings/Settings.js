/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { saveState } from '../../app/localStorage';
import { setTheme } from '../../utils/utils';
import Themes from './themes.json';

const Settings = () => {
  const _setTheme = (themeObj) => {
    saveState(themeObj.name, 'theme');
    setTheme(themeObj);
  };

  const themes = Themes.map((theme) => {
    const classname = `themeSelection ${theme.name}`;
    const style = {
      color: theme['main-color'],
      backgroundColor: theme['bg-color'],
    };
    return (
      <div key={theme.name} className={classname} style={style} onClick={() => _setTheme(theme)}>
        {theme.name}
      </div>
    );
  });

  return <div className="settings">{themes}</div>;
};

export default Settings;
