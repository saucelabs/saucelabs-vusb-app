import React from 'react';
import { Link } from 'react-router-dom';
import Styles from './CloseIconButton.module.css';
import { ROUTES } from '../../utils/Constants';

const CloseIconButton = () => {
  return (
    <Link to={ROUTES.DEVICES} replace>
      <i className={`${Styles.icon} ${Styles.hover} fas fa-times`} />
    </Link>
  );
};

export default CloseIconButton;
