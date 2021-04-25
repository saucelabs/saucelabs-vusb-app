// @flow
import React, { Component } from 'react';
import Styles from './ServerButtons.styles.css';
import { VUSB_SERVER_STATUS } from '../monitor/duck/actions';

type Props = {
  afterComponent?: {},
  disableShowMonitor?: boolean,
  serverError: boolean,
  serverStatus: string,
  startVusbServer: () => void,
  stopVusbServer: () => void,
  toggleVusbServerMonitor: () => void
};

export default class ServerButtons extends Component<Props> {
  props: Props;

  static defaultProps = {
    afterComponent: null,
    disableShowMonitor: false
  };

  render() {
    const {
      afterComponent,
      disableShowMonitor,
      serverError,
      serverStatus,
      startVusbServer,
      stopVusbServer,
      toggleVusbServerMonitor
    } = this.props;
    const status =
      // eslint-disable-next-line no-nested-ternary
      serverStatus === VUSB_SERVER_STATUS.RUNNING
        ? 'running'
        : serverError
        ? 'error'
        : '';
    const monitorHoverClass = disableShowMonitor ? '' : Styles.hover;

    return (
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
          {serverStatus === VUSB_SERVER_STATUS.RUNNING ? (
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
    );
  }
}
