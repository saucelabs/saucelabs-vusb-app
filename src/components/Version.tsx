import React from 'react';
import { shell } from 'electron';
import Styles from './Version.module.css';
import Vusb from '../assets/images/vusb.png';
import { Notification, NOTIFICATIONS } from './Notification';
import { APP_VERSION } from '../utils/Constants';

const VersionContainer: React.FC = () => {
  return (
    <div>
      <div className={Styles['version-container']}>
        <img src={Vusb} className={Styles['version-image']} alt="Virtual USB" />
        <div className={Styles['version-text-container']}>
          <span className={Styles['version-title']}>Virtual USB</span>
          <span className={Styles['version-number']}>
            Version {APP_VERSION}
          </span>
        </div>
      </div>
      <Notification type={NOTIFICATIONS.INFO}>
        <span>
          Issues can be filed{' '}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <a
            className={Styles.link}
            onClick={() =>
              shell.openExternal(
                'https://github.com/saucelabs/saucelabs-vusb-app/issues/'
              )
            }
          >
            here
          </a>
          .
        </span>
      </Notification>
    </div>
  );
};

export default VersionContainer;
