import { APP_VERSION } from 'renderer/utils/Constants';
import { useContext } from 'react';
import { StoreContext } from 'renderer/Store';
import { openProductTour } from 'renderer/actions/ProductTourActions';
import RequirementsButton from './buttons/RequirementsButton';
import SettingsButton from './buttons/SettingsButton';
import LogoSL from '../assets/images/sauce-white-logo-small-color.png';
import Styles from './Footer.module.css';
import InfoButton from './buttons/InfoButton';

const Footer = () => {
  const {
    state: {
      systemChecks: { isSystemOperational },
    },
    dispatch,
  } = useContext(StoreContext);
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
        <div className={Styles.footerItem}>
          <InfoButton onClick={skipProductTour} />
        </div>
        <div className={Styles.separator} />
        <div className={Styles.footerItem}>
          <RequirementsButton isError={!isSystemOperational} />
        </div>
        <div className={Styles.separator} />
        <div className={Styles.footerItem}>
          <SettingsButton />
        </div>
      </div>
    </>
  );
};

export default Footer;
