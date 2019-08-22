import React, { FC } from 'react';

interface SettingsButtonProps {
  classes: any,
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

export const SettingsButton: FC<SettingsButtonProps> = React.memo(({ classes, onClick }) => {

  return (
    <button className={classes.settingsButton} aria-label={'Settings'} onClick={onClick}>
      Settings
    </button>
  );
});

export default SettingsButton;
