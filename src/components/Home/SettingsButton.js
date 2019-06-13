import React from 'react';

export const SettingsButton = React.memo(({ classes, onClick }) => {

  return (
    <button className={classes.settingsButton} aria-label={'Settings'} onClick={onClick}>
      Settings
    </button>
  );
});

export default SettingsButton;
