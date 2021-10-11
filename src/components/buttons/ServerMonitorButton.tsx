import React from 'react';
import { Link } from 'react-router-dom';
import Styles from './ServerMonitorButton.module.css';
import { VusbServerStatusEnum } from '../../server/ServerTypes';
import { ROUTES } from '../../utils/Constants';

interface ServerMonitorButtonInterface {
  serverError: boolean;
  serverStatus: string;
}

const ServerMonitorButton: React.FC<ServerMonitorButtonInterface> = ({
  serverError,
  serverStatus,
}) => {
  const status =
    // eslint-disable-next-line no-nested-ternary
    serverStatus === VusbServerStatusEnum.RUNNING
      ? 'running'
      : serverError
      ? 'error'
      : '';

  return (
    <Link to={ROUTES.SERVER_MONITOR} replace>
      <i
        className={`${Styles.icon} ${Styles.hover} ${Styles[status]} fas fa-server`}
      />
    </Link>
  );
};

export default ServerMonitorButton;
