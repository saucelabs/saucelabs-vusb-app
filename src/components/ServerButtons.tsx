import React from 'react';
import Styles from './ServerButtons.module.css';
import { VUSB_SERVER_STATUS } from '../store/actions/ServerActions';
import { ServerButtonsType } from '../types/ComponentTypes';

const ServerButtons: React.FC<ServerButtonsType> = ({
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
    serverStatus === VUSB_SERVER_STATUS.RUNNING
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
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(disableShowMonitor
              ? {}
              : { onClick: () => toggleVusbServerMonitor() })}
          />
          {serverStatus === VUSB_SERVER_STATUS.RUNNING ? (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
            <i
              className={`${Styles.icon} ${Styles.hover} ${
                Styles['stop-server']
              } ${
                serverStatus !== VUSB_SERVER_STATUS.RUNNING
                  ? Styles.disabled
                  : ''
              } far fa-stop-circle`}
              onClick={() => stopVusbServer()}
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
            <i
              className={`${Styles.icon} ${Styles.hover} ${
                serverStatus === VUSB_SERVER_STATUS.RUNNING
                  ? Styles.disabled
                  : ''
              }  far fa-play-circle`}
              onClick={() => startVusbServer()}
            />
          )}
          {afterComponent}
        </span>
      </div>
    </>
  );
};

export default ServerButtons;
