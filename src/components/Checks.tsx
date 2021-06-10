import React from 'react';
import Icon from '@material-ui/core/Icon';
import Styles from './Checks.module.css';
import { SYSTEM_CHECKS } from '../utils/Checks';

const ChecksContainer: React.FC = () => {
  return (
    <div className={Styles['system-checks']}>
      <h3 className={Styles['sub-title']}>Checks</h3>
      <div className={Styles.explain}>
        <span>
          To let this application work properly a few things need to be
          configured. Please see the below list for errors and fix them before
          you can use this application.
        </span>
      </div>
      <div>
        <span className={Styles.label}>
          <Icon
            className={`${
              Styles[SYSTEM_CHECKS.JAVA_HOME.check ? 'check' : 'error']
            } far fa-${
              SYSTEM_CHECKS.JAVA_HOME.check ? 'check' : 'times'
            }-circle`}
          />
          JAVA_HOME:
        </span>
        <span>{SYSTEM_CHECKS.JAVA_HOME.message}</span>
      </div>
      <div>
        <span className={Styles.label}>
          <Icon
            className={`${
              Styles[SYSTEM_CHECKS.ANDROID_HOME.check ? 'check' : 'error']
            } far fa-${
              SYSTEM_CHECKS.ANDROID_HOME.check ? 'check' : 'times'
            }-circle`}
          />
          ANDROID_HOME:
        </span>
        <span>{SYSTEM_CHECKS.ANDROID_HOME.message}</span>
      </div>
      <div>
        <span className={Styles.label}>
          <Icon
            className={`${
              Styles[SYSTEM_CHECKS.ADB.check ? 'check' : 'error']
            } far fa-${SYSTEM_CHECKS.ADB.check ? 'check' : 'times'}-circle`}
          />
          ADB:
        </span>
        <span>{SYSTEM_CHECKS.ADB.message}</span>
      </div>
      <div>
        <span className={Styles.label}>
          <Icon
            className={`${
              Styles[SYSTEM_CHECKS.XCODE.check ? 'check' : 'error']
            } far fa-${SYSTEM_CHECKS.XCODE.check ? 'check' : 'times'}-circle`}
          />
          XCODE:
        </span>
        <span>{SYSTEM_CHECKS.XCODE.message}</span>
      </div>
    </div>
  );
};

export default ChecksContainer;
