import React from 'react';
import Styles from './Footer.module.css';
import LogoSL from '../assets/images/sauce-white-logo-small-color.png';
import { APP_VERSION } from '../utils/Constants';

const Footer = () => {
  return (
    <div className={Styles.container}>
      <div className={Styles.logoContainer}>
        <img src={LogoSL} alt="Sauce Labs Logo" />
      </div>
      <div className={Styles.versionTextContainer}>
        <span className={Styles.versionTitle}>Virtual USB</span>
        <span className={Styles.versionNumber}>{APP_VERSION}</span>
      </div>
    </div>
  );
};

export default Footer;
