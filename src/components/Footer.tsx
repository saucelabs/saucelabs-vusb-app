import React, { useEffect } from 'react';
import Styles from './Footer.module.css';
import LogoSL from '../assets/images/sauce-white-logo-small-color.png';
import { APP_VERSION } from '../utils/Constants';
import { StoreContext } from '../store/Store';
import Requirements from '../requirements/Requirements';
import {
  openRequirementsContainer,
  updateRequirementsError,
} from '../store/actions/RequirementsActions';
import { isMac, SYSTEM_CHECKS } from '../utils/Checks';
import RequirementsButton from './buttons/RequirementsButton';
import Settings from '../settings/Settings';
import SettingsButton from './buttons/SettingsButton';
import { openSettingsContainer } from '../store/actions/SettingsActions';
import { openProductTour } from '../store/actions/ProductTourActions';
import InfoButton from './buttons/InfoButton';

const Footer = () => {
  const {
    state: {
      requirements: { isError, isOpen: isRequirementsOpen },
      settings: { isOpen: isSettingsOpen },
    },
    dispatch,
  } = React.useContext(StoreContext);
  useEffect(() => {
    const { ADB, ANDROID_HOME, JAVA_HOME, XCODE } = SYSTEM_CHECKS;
    const androidCheck = ADB.check && ANDROID_HOME.check && JAVA_HOME.check;
    const isSystemOperational = isMac()
      ? androidCheck && XCODE.check
      : androidCheck;
    dispatch(updateRequirementsError(!isSystemOperational));
  }, [dispatch]);
  const openCloseSettingsScreen = () => dispatch(openSettingsContainer());
  const openCloseRequirementsContainer = () =>
    dispatch(openRequirementsContainer());
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
          <RequirementsButton
            isError={isError}
            toggleRequirementsScreen={openCloseRequirementsContainer}
          />
        </div>
        <div className={Styles.separator} />
        <div
          className={`${Styles.requirementsTextContainer} ${Styles.footerItem}`}
        >
          <SettingsButton toggleSettingsScreen={openCloseSettingsScreen} />
        </div>
      </div>
      {isRequirementsOpen && (
        <Requirements
          systemData={SYSTEM_CHECKS}
          onClick={openCloseRequirementsContainer}
        />
      )}
      {isSettingsOpen && <Settings onClick={openCloseSettingsScreen} />}
    </>
  );
};

export default Footer;
