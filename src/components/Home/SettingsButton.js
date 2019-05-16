import React from 'react';
import useApp from '../../hooks/useApp'

export const SettingsButton = React.memo(({ classes }) => {
  const { history, dispatch } = useApp();

  return (
    <button className={classes.settingsButton}>
      Settings
    </button>
  );
});

export default SettingsButton;
