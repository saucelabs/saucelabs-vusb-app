// @flow
import React, { Component } from 'react';
import CloseIcon from '../components/CloseIcon';
import ServerMonitor from './components/ServerMonitor';
import Styles from './DeviceServerMonitor.styles.css';

type Props = {
  clearLogs: () => void,
  device: string,
  deviceID: string,
  logLines: [],
  serverError: string,
  serverStatus: string,
  toggleDeviceLogs: () => void
};

export default class DeviceServerMonitor extends Component<Props> {
  props: Props;

  render() {
    const {
      clearLogs,
      device,
      deviceID,
      logLines,
      serverError,
      serverStatus,
      toggleDeviceLogs
    } = this.props;

    return (
      <ServerMonitor
        clearLogs={() => clearLogs(deviceID)}
        headerCenterComponent={<span className={Styles.device}>{device}</span>}
        headerRightComponent={
          <CloseIcon onClick={() => toggleDeviceLogs(deviceID)} />
        }
        logLines={logLines}
        serverError={serverError}
        serverStatus={serverStatus}
      />
    );
  }
}
