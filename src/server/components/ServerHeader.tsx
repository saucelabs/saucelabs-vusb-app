import React from 'react';
import Styles from './ServerHeader.module.css';
import SauceLogo from '../../assets/images/sauce-white-logo-small.png';
import { VusbServerStatusEnum } from '../ServerTypes';
import { DeviceSessionStatusEnum } from '../../devices/DeviceTypes';

interface ServerHeaderInterface {
  centerComponent?: JSX.Element;
  serverError: boolean;
  serverStatus: string;
  rightComponent: JSX.Element;
}

const ServerHeader: React.FC<ServerHeaderInterface> = ({
  centerComponent,
  serverError,
  serverStatus,
  rightComponent,
}) => {
  const status =
    // eslint-disable-next-line no-nested-ternary
    serverStatus === VusbServerStatusEnum.RUNNING ||
    serverStatus === DeviceSessionStatusEnum.CONNECTED
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
