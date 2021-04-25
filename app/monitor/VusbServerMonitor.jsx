// @flow
import React, { Component } from 'react';
import ServerButtons from '../components/ServerButtons';
import CloseIcon from '../components/CloseIcon';
import ServerMonitor from './components/ServerMonitor';

type Props = {
  clearLogs: () => void,
  logLines: [],
  serverError: string,
  serverStatus: string,
  startVusbServer: () => void,
  stopVusbServer: () => void,
  toggleVusbServerMonitor: () => void
};

export default class VusbServerMonitor extends Component<Props> {
  props: Props;

  render() {
    const {
      clearLogs,
      logLines,
      serverError,
      serverStatus,
      startVusbServer,
      stopVusbServer,
      toggleVusbServerMonitor
    } = this.props;

    return (
      <ServerMonitor
        clearLogs={clearLogs}
        serverError={serverError}
        logLines={logLines}
        serverStatus={serverStatus}
        headerRightComponent={
          <ServerButtons
            serverError={serverError}
            serverStatus={serverStatus}
            disableShowMonitor={true}
            startVusbServer={startVusbServer}
            stopVusbServer={stopVusbServer}
            toggleVusbServerMonitor={toggleVusbServerMonitor}
            afterComponent={<CloseIcon onClick={toggleVusbServerMonitor} />}
          />
        }
      />
    );
  }
}
