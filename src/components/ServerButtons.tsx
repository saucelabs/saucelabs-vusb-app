import React from 'react';
import Styles from './ServerButtons.module.css';
import { VusbServerStatusEnum } from '../server/ServerTypes';

interface ServerButtonsInterface {
  afterComponent?: JSX.Element;
  disableShowMonitor?: boolean;
  serverError: boolean;
  serverStatus: string;
  startVusbServer: () => void;
  stopVusbServer: () => void;
  toggleVusbServerMonitor: () => void;
}

const ServerButtons: React.FC<ServerButtonsInterface> = ({
  afterComponent,
  disableShowMonitor,
  serverError,
  serverStatus,
  startVusbServer,
  stopVusbServer,
  toggleVusbServerMonitor,
}) => {
  const status =
    // eslint-disable-next-line no-nested-ternary
    serverStatus === VusbServerStatusEnum.RUNNING
      ? 'running'
      : serverError
      ? 'error'
      : '';
  const monitorHoverClass = disableShowMonitor ? '' : Styles.hover;
  const isServerRunning = serverStatus === VusbServerStatusEnum.RUNNING;

  return (
    <>
      <div className={Styles.container}>
        <span>
          <i
            role="button"
            tabIndex={0}
            aria-label={`${isServerRunning ? 'Stop' : 'Start'} server`}
            className={`${Styles.icon} ${Styles.hover} fas fa-${
              isServerRunning ? 'stop' : 'play'
            }-circle`}
            onClick={isServerRunning ? stopVusbServer : startVusbServer}
            onKeyDown={() => startVusbServer()}
          />
          <i
            className={`${Styles.icon} ${monitorHoverClass} ${Styles[status]} fas fa-server`}
            {...(disableShowMonitor
              ? {}
              : { onClick: () => toggleVusbServerMonitor() })}
          />
          {afterComponent}
        </span>
      </div>
    </>
  );
};

export default ServerButtons;
