/* eslint-disable react/require-default-props */
import React from 'react';
import Styles from './ServerMonitor.module.css';
import Header from './ServerHeader';
import Terminal from './Terminal';

interface ServerMonitorInterface {
  clearLogs: () => void;
  headerCenterComponent?: JSX.Element;
  headerRightComponent: JSX.Element;
  logLines: string[];
  serverError: boolean;
  serverStatus: string;
}

const ServerMonitor: React.FC<ServerMonitorInterface> = ({
  clearLogs,
  headerCenterComponent,
  headerRightComponent,
  logLines,
  serverError,
  serverStatus,
}) => {
  return (
    <>
      <div className={Styles.container}>
        <Header
          serverError={serverError}
          serverStatus={serverStatus}
          centerComponent={headerCenterComponent}
          rightComponent={headerRightComponent}
        />
        <Terminal logLines={logLines} clearLogs={clearLogs} />
      </div>
    </>
  );
};

export default ServerMonitor;
