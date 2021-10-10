import React from 'react';
import Styles from './CloseIconButton.module.css';

const CloseIconButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <i
      role="button"
      aria-label="Close"
      tabIndex={0}
      className={`${Styles.icon} ${Styles.hover} fas fa-times`}
      onClick={() => onClick()}
      onKeyDown={() => onClick()}
    />
  );
};

export default CloseIconButton;
