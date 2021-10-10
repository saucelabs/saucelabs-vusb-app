import React from 'react';
import Styles from './RequirementsButton.module.css';

interface RequirementsButtonInterface {
  isError: boolean;
  toggleRequirementsScreen: () => void;
}

const RequirementsButton: React.FC<RequirementsButtonInterface> = ({
  isError,
  toggleRequirementsScreen,
}) => {
  const icon = isError ? 'fa-exclamation-triangle' : 'fa-tasks';
  const colorClass = isError ? 'danger' : 'accept';

  return (
    <>
      <i
        role="button"
        tabIndex={0}
        aria-label="Open product tour"
        className={`${Styles.icon} ${Styles.hover} fas ${icon} ${Styles[colorClass]}`}
        onClick={toggleRequirementsScreen}
        onKeyDown={toggleRequirementsScreen}
      />
    </>
  );
};

export default RequirementsButton;
