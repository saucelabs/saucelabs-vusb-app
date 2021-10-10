import React from 'react';
import Styles from './InfoButton.module.css';

interface InfoButtonInterface {
  toggleProductTourScreen: () => void;
}

const InfoButton: React.FC<InfoButtonInterface> = ({
  toggleProductTourScreen,
}) => {
  return (
    <>
      <i
        role="button"
        tabIndex={0}
        aria-label="Open product tour"
        className={`${Styles.icon} ${Styles.hover} fas fa-info-circle`}
        onClick={toggleProductTourScreen}
        onKeyDown={toggleProductTourScreen}
      />
    </>
  );
};

export default InfoButton;
