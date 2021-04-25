// @flow
import React, { Component } from 'react';
import Styles from './ServerMonitor.styles.css';
import Header from './Header';
import Terminal from './Terminal';

type Props = {
  clearLogs: () => void,
  headerCenterComponent?: {},
  headerRightComponent?: {},
  logLines: [],
  serverError: string,
  serverStatus: string
};

export default class ServerMonitor extends Component<Props> {
  props: Props;

  static defaultProps = {
    headerCenterComponent: null,
    headerRightComponent: null
  };

  render() {
    const {
      clearLogs,
      headerCenterComponent,
      headerRightComponent,
      logLines,
      serverError,
      serverStatus
    } = this.props;

    return (
      <div className={Styles.container}>
        <Header
          serverError={serverError}
          serverStatus={serverStatus}
          centerComponent={headerCenterComponent}
          rightComponent={headerRightComponent}
        />
        <Terminal logLines={logLines} clearLogs={clearLogs} />
      </div>
    );
  }
}
