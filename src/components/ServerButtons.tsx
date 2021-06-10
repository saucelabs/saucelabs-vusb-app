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

  return (
    <>
      <div className={Styles.container}>
        <span>
          <i className={`${Styles.icon} fab fa-android`} />
          <i className={`${Styles.icon} fab fa-apple`} />
          <i
            className={`${Styles.icon} ${monitorHoverClass} ${Styles[status]} fas fa-server`}
            {...(disableShowMonitor
              ? {}
              : { onClick: () => toggleVusbServerMonitor() })}
          />
          {serverStatus === VusbServerStatusEnum.RUNNING ? (
            <i
              role="button"
              tabIndex={0}
              aria-label="Stop server"
              className={`${Styles.icon} ${Styles.hover} ${
                Styles['stop-server']
              } ${
                serverStatus !== VusbServerStatusEnum.RUNNING
                  ? Styles.disabled
                  : ''
              } far fa-stop-circle`}
              onClick={() => stopVusbServer()}
              onKeyDown={() => stopVusbServer()}
            />
          ) : (
            <i
              role="button"
              tabIndex={0}
              aria-label="Start server"
              className={`${Styles.icon} ${Styles.hover} ${
                serverStatus === VusbServerStatusEnum.RUNNING
                  ? Styles.disabled
                  : ''
              }  far fa-play-circle`}
              onClick={() => startVusbServer()}
              onKeyDown={() => startVusbServer()}
            />
          )}
          {afterComponent}
        </span>
      </div>
    </>
  );
};

export default ServerButtons;
