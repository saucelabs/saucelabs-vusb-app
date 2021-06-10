import React, { useContext } from 'react';
import Styles from './Header.module.css';
import { StoreContext } from '../store/Store';
import ServerButtons from './ServerButtons';
import { startServer, stopServer } from '../server/ServerOperations';
import {
  vusbServerClearLogsAction,
  vusbServerMonitorToggleAction,
} from '../store/actions/ServerActions';
import VusbServerMonitor from '../server/VusbServerMonitor';

const Header: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const {
    devices: { connectedDevices },
    server: { error, log, showMonitor, status },
  } = state;
  const startVusbServer = () => startServer(dispatch, status);
  const stopVusbServer = () => stopServer(dispatch, connectedDevices);

  return (
    <div className={Styles.container}>
      <div className={Styles.separator} />
      <div className={Styles.separator} />
      <div className={Styles['button-container']}>
        <ServerButtons
          serverError={error}
          serverStatus={status}
          startVusbServer={startVusbServer}
          stopVusbServer={stopVusbServer}
          toggleVusbServerMonitor={() =>
            dispatch(vusbServerMonitorToggleAction())
          }
        />
      </div>
      {showMonitor && (
        <VusbServerMonitor
          clearLogs={() => dispatch(vusbServerClearLogsAction())}
          logLines={log}
          serverError={error}
          serverStatus={status}
          startVusbServer={startVusbServer}
          stopVusbServer={stopVusbServer}
          toggleVusbServerMonitor={() =>
            dispatch(vusbServerMonitorToggleAction())
          }
        />
      )}
    </div>
  );
};

export default Header;
