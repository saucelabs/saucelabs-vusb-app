import React from 'react';
import Styles from './ServerMonitor.module.css';
import Header from './ServerHeader';
import Terminal from './Terminal';
import { ServerMonitorType } from '../../types/ComponentTypes';

const ServerMonitor: React.FC<ServerMonitorType> = ({
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
