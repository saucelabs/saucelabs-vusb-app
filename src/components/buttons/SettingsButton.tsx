import React from 'react';
import Styles from './SettingsButton.module.css';

interface SettingsButtonInterface {
  toggleSettingsScreen: () => void;
}

const SettingsButton: React.FC<SettingsButtonInterface> = ({
  toggleSettingsScreen,
}) => {
  return (
    <>
      <i
        role="button"
        tabIndex={0}
        aria-label="Open settings"
        className={`${Styles.icon} ${Styles.hover} fas fa-cog`}
        onClick={toggleSettingsScreen}
        onKeyDown={toggleSettingsScreen}
      />
    </>
  );
};

export default SettingsButton;
