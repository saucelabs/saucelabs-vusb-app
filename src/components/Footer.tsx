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

const Footer = () => {
  const {
    state: {
      requirements: { isError, isOpen },
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

  const openCloseRequirementsContainer = () =>
    dispatch(openRequirementsContainer());
  const checkIcon = isError ? 'fa-exclamation-triangle' : 'fa-check';
  const colorClass = isError ? 'danger' : 'accept';
  const openCloseIcon = isOpen ? 'fa-chevron-up' : 'fa-chevron-down';

  return (
    <>
      {isOpen && (
        <Requirements
          systemData={SYSTEM_CHECKS}
          onClick={openCloseRequirementsContainer}
        />
      )}
      <div className={Styles.container}>
        <div className={Styles.logoContainer}>
          <img src={LogoSL} alt="Sauce Labs Logo" />
        </div>
        <div className={Styles.footerItem}>
          <span className={Styles.versionTitle}>Virtual USB</span>
          <span className={Styles.versionNumber}>{APP_VERSION}</span>
        </div>
        <div
          className={`${Styles.requirementsTextContainer} ${Styles.footerItem}`}
        >
          <button
            className={Styles.requirementsButton}
            type="button"
            onClick={() => openCloseRequirementsContainer()}
          >
            <i
              className={`${Styles.requirementsIcon} fas ${checkIcon} ${Styles[colorClass]}`}
            />
            Requirements
            <i
              className={`${Styles.requirementsIcon} fas ${openCloseIcon} ${Styles.chevron}`}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Footer;
