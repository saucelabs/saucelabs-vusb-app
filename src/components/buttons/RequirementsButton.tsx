import React from 'react';
import { Link } from 'react-router-dom';
import Styles from './RequirementsButton.module.css';
import { ROUTES } from '../../utils/Constants';

interface RequirementsButtonInterface {
  isError: boolean;
}

const RequirementsButton: React.FC<RequirementsButtonInterface> = ({
  isError,
}) => {
  const icon = isError ? 'fa-exclamation-triangle' : 'fa-tasks';
  const colorClass = isError ? 'danger' : 'accept';

  return (
    <Link to={ROUTES.REQUIREMENTS} replace>
      <i
        className={`${Styles.icon} ${Styles.hover} fas ${icon} ${Styles[colorClass]}`}
      />
    </Link>
  );
};

export default RequirementsButton;
