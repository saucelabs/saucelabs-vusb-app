import React from 'react';
import Styles from './ServerMonitorButton.module.css';
import { VusbServerStatusEnum } from '../../server/ServerTypes';

interface ServerMonitorButtonInterface {
  serverError: boolean;
  serverStatus: string;
  toggleVusbServerMonitor: () => void;
}

const ServerMonitorButton: React.FC<ServerMonitorButtonInterface> = ({
  serverError,
  serverStatus,
  toggleVusbServerMonitor,
}) => {
  const status =
    // eslint-disable-next-line no-nested-ternary
    serverStatus === VusbServerStatusEnum.RUNNING
      ? 'running'
      : serverError
      ? 'error'
      : '';

  return (
    <>
      <i
        role="button"
        tabIndex={0}
        aria-label="Toggle server monitor"
        className={`${Styles.icon} ${Styles.hover} ${Styles[status]} fas fa-server`}
        onClick={toggleVusbServerMonitor}
        onKeyDown={toggleVusbServerMonitor}
      />
    </>
  );
};

export default ServerMonitorButton;
