import React from 'react';
import { Link } from 'react-router-dom';
import Styles from './SettingsButton.module.css';
import { ROUTES } from '../../utils/Constants';

const SettingsButton: React.FC = () => {
  return (
    <Link to={ROUTES.SETTINGS} replace>
      <i className={`${Styles.icon} ${Styles.hover} fas fa-cog`} />
    </Link>
  );
};

export default SettingsButton;
