import React from 'react';
import Styles from './CloseIcon.module.css';

const CloseIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <i
      className={`${Styles.icon} ${Styles.hover} far fa-window-close`}
      onClick={() => onClick()}
    />
  );
};

export default CloseIcon;
