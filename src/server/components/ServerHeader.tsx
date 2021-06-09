import React from 'react';
import Styles from './ServerHeader.module.css';
import SauceLogo from '../../assets/images/sauce-white-logo-small.png';
import { ServerHeaderType } from '../../types/ComponentTypes';
import { VUSB_SERVER_STATUS } from '../../store/actions/ServerActions';
import { DEVICE_SESSION_STATUS } from '../../store/actions/DeviceActions';

const ServerHeader: React.FC<ServerHeaderType> = ({
  centerComponent,
  serverError,
  serverStatus,
  rightComponent,
}) => {
  const status =
    // eslint-disable-next-line no-nested-ternary
    serverStatus === VUSB_SERVER_STATUS.RUNNING ||
    serverStatus === DEVICE_SESSION_STATUS.CONNECTED
      ? 'running'
      : serverError
      ? 'error'
      : '';

  return (
    <>
      <div className={`${Styles.container} ${Styles[status]}`}>
        <img alt="" src={SauceLogo} />
        {centerComponent && (
          <div className={Styles.center}>{centerComponent}</div>
        )}
        <div className={Styles.right}>{rightComponent}</div>
      </div>
    </>
  );
};

export default ServerHeader;
