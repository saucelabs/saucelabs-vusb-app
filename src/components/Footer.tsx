import React from 'react';
import Styles from './Footer.module.css';
import LogoSL from '../assets/images/sauce-white-logo-small-color.png';
import { APP_VERSION } from '../utils/Constants';
import { StoreContext } from '../store/Store';
import RequirementsButton from './buttons/RequirementsButton';
import SettingsButton from './buttons/SettingsButton';
import { openProductTour } from '../store/actions/ProductTourActions';
import InfoButton from './buttons/InfoButton';

const Footer = () => {
  const { dispatch } = React.useContext(StoreContext);
  const skipProductTour = () => dispatch(openProductTour());

  return (
    <>
      <div className={Styles.container}>
        <div className={Styles.logoContainer}>
          <img src={LogoSL} alt="Sauce Labs Logo" />
        </div>
        <div className={Styles.footerItem}>
          <span className={Styles.versionTitle}>Virtual USB</span>
          <span className={Styles.versionNumber}>{APP_VERSION}</span>
        </div>
        <div className={Styles.divider} />
        <div className={Styles.separator} />
        <div
          className={`${Styles.requirementsTextContainer} ${Styles.footerItem}`}
        >
          <InfoButton toggleProductTourScreen={skipProductTour} />
        </div>
        <div className={Styles.separator} />
        <div
          className={`${Styles.requirementsTextContainer} ${Styles.footerItem}`}
        >
          <RequirementsButton isError={false} />
        </div>
        <div className={Styles.separator} />
        <div
          className={`${Styles.requirementsTextContainer} ${Styles.footerItem}`}
        >
          <SettingsButton />
        </div>
      </div>
    </>
  );
};

export default Footer;
