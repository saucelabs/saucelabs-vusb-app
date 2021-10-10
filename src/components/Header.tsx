import React, { useContext } from 'react';
import Styles from './Header.module.css';
import { StoreContext } from '../store/Store';
import SauceBolt from '../assets/images/sauce-bolt.png';
import ServerButtons from './ServerButtons';
import { startServer, stopServer } from '../server/ServerOperations';
import {
  vusbServerClearLogsAction,
  vusbServerMonitorToggleAction,
} from '../store/actions/ServerActions';
import VusbServerMonitor from '../server/VusbServerMonitor';
import SettingsButton from './SettingsButton';
import { openSettingsContainer } from '../store/actions/SettingsActions';
import Settings from '../settings/Settings';
import { openProductTour } from '../store/actions/ProductTourActions';
import InfoButton from './InfoButton';

const Header: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const {
    devices: { connectedDevices },
    server: { error, log, showMonitor, status },
    settings: { isOpen },
  } = state;
  const startVusbServer = () => startServer(dispatch, status);
  const stopVusbServer = () => stopServer(dispatch, connectedDevices);
  const openCloseSettingsScreen = () => dispatch(openSettingsContainer());
  const skipProductTour = () => dispatch(openProductTour());

  return (
    <div className={Styles.container}>
      <div className={Styles.logo}>
        <img src={SauceBolt} alt="Sauce Labs Bolt" />
      </div>
      <div className={Styles.label}>Device Catalog</div>
      <div className={Styles.divider} />
      <div className={Styles.buttonContainer}>
        <InfoButton toggleProductTourScreen={skipProductTour} />
      </div>
      <div className={Styles.separator} />
      <div className={Styles.buttonContainer}>
        <SettingsButton toggleSettingsScreen={openCloseSettingsScreen} />
      </div>
      <div className={Styles.separator} />
      <div className={Styles.buttonContainer}>
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
          toggleVusbServerMonitor={() =>
            dispatch(vusbServerMonitorToggleAction())
          }
        />
      )}
      {isOpen && <Settings onClick={openCloseSettingsScreen} />}
    </div>
  );
};

export default Header;
