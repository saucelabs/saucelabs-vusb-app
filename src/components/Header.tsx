import React, { useContext } from 'react';
import Styles from './Header.module.css';
import { StoreContext } from '../store/Store';
import SauceBolt from '../assets/images/sauce-bolt.png';
import ServerMonitorButton from './buttons/ServerMonitorButton';
import { startServer, stopServer } from '../server/ServerOperations';
import {
  vusbServerClearLogsAction,
  vusbServerMonitorToggleAction,
} from '../store/actions/ServerActions';
import VusbServerMonitor from '../server/VusbServerMonitor';
import StartStopServerButton from './buttons/StartStopServerButton';

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
      <div className={Styles.logo}>
        <img src={SauceBolt} alt="Sauce Labs Bolt" />
      </div>
      <div className={Styles.label}>Device Catalog</div>
      <div className={Styles.divider} />
      <div className={Styles.separator} />
      <div className={Styles.buttonContainer}>
        <StartStopServerButton
          serverStatus={status}
          startVusbServer={startVusbServer}
          stopVusbServer={stopVusbServer}
        />
      </div>
      <div className={Styles.separator} />
      <div className={Styles.buttonContainer}>
        <ServerMonitorButton
          serverError={error}
          serverStatus={status}
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
          toggleVusbServerMonitor={() =>
            dispatch(vusbServerMonitorToggleAction())
          }
        />
      )}
    </div>
  );
};

export default Header;
