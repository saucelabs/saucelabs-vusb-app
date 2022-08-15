import React from 'react';
import Styles from './InfoButton.module.css';

interface InfoButtonInterface {
  onClick: () => void;
}

const InfoButton: React.FC<InfoButtonInterface> = ({ onClick }) => {
  return (
    <>
      <i
        role="button"
        tabIndex={0}
        aria-label="Open product tour"
        className={`${Styles.icon} ${Styles.hover} fas fa-info-circle`}
        onClick={onClick}
        onKeyDown={onClick}
      />
    </>
  );
};

export default InfoButton;
