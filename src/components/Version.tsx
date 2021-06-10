import React from 'react';
import { shell } from 'electron';
import Styles from './Version.module.css';
import Vusb from '../assets/images/vusb.png';
import Notification, { NotificationsType } from './Notification';
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
      <Notification type={NotificationsType.INFO}>
        <span>
          Issues can be filed{' '}
          <button
            type="button"
            className={Styles.link}
            onClick={() =>
              shell.openExternal(
                'https://github.com/saucelabs/saucelabs-vusb-app/issues/'
              )
            }
          >
            here
          </button>
          .
        </span>
      </Notification>
    </div>
  );
};

export default VersionContainer;
