import React, { FormEvent, useEffect, useState } from 'react';
import { remote } from 'electron';
import Styles from './SettingsPage.module.css';
import Tabs from '../components/Tabs';
import SubmitButton from '../components/buttons/SubmitButton';
import Connection from './components/Connection';
import ServerProxy from './components/ServerProxy';
import Server from './components/Server';
import Notification, { NotificationsType } from '../components/Notification';
import DeviceProxy from './components/DeviceProxy';
import { getGenericStorage, setGenericStorage } from './SettingsStorage';
import { StoreContext } from '../store/Store';
import { VusbServerStatusEnum } from '../server/ServerTypes';
import CloseIconButton from '../components/buttons/CloseIconButton';
import SauceBolt from '../assets/images/sauce-bolt.png';

const Settings: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  let closeNotification: ReturnType<typeof setTimeout>;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useEffect(() => () => clearTimeout(closeNotification), [closeNotification]);
  const {
    state: {
      server: { status: vusbStatus },
    },
  } = React.useContext(StoreContext);
  const settingsData = getGenericStorage();
  const [state, setState] = useState({ dataIsStored: false, ...settingsData });
  const handleGenericSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setState({
      ...state,
      dataIsStored: true,
    });
    setGenericStorage({
      connection: {
        ...state.connection,
      },
      proxy: {
        ...state.proxy,
      },
      server: {
        ...state.server,
      },
      device: {
        proxy: {
          ...state.device.proxy,
        },
      },
    });
    closeNotification = setTimeout(() => {
      setState({
        ...state,
        dataIsStored: false,
      });
      // Reload the app
      remote.getCurrentWindow().reload();
    }, 3000);
  };
  const handleConnectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setState({
      ...state,
      connection: {
        ...state.connection,
        ...{ [name]: value },
      },
    });
  };
  const handleServerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name, value } = event.target;

    setState({
      ...state,
      server: {
        ...state.server,
        ...{ [name]: typeof value === 'string' ? value : checked },
      },
    });
  };
  const handleProxyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setState({
      ...state,
      proxy: {
        ...state.proxy,
        ...{ [name]: value },
      },
    });
  };
  const handleDeviceProxyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setState({
      ...state,
      device: {
        proxy: {
          ...state.device.proxy,
          ...{ [name]: value },
        },
      },
    });
  };
  const { connection, dataIsStored, device, proxy, server } = state;

  return (
    <div className={Styles.container}>
      <div className={Styles.containerHeader}>
        <div className={Styles.logo}>
          <img src={SauceBolt} alt="Sauce Labs Bolt" />
        </div>
        <div className={Styles.label}>Settings</div>
        <div className={Styles.divider} />
        <div className={Styles.buttonContainer}>
          <CloseIconButton onClick={onClick} />
        </div>
      </div>
      <form onSubmit={handleGenericSubmit} className={Styles.formContainer}>
        {dataIsStored && (
          <Notification blocking type={NotificationsType.INFO} title="Info">
            <span>
              Data has been stored. <br /> The app will be reloaded in a few
              seconds.
            </span>
          </Notification>
        )}
        <Tabs>
          <div data-label="Connection" data-iconClass="fa-link">
            <Connection
              connectionData={connection}
              onChange={handleConnectionChange}
            />
          </div>
          <div data-label="Server" data-iconClass="fa-server">
            <Server serverData={server} onChange={handleServerChange} />
          </div>
          <div data-label="Server Proxy" data-iconClass="fa-server">
            <ServerProxy proxyData={proxy} onChange={handleProxyChange} />
          </div>
          <div data-label="Device Proxy" data-iconClass="fa-mobile-alt">
            <DeviceProxy
              proxyData={device.proxy}
              onChange={handleDeviceProxyChange}
            />
          </div>
        </Tabs>
        <div className={Styles.submitButtonContainer}>
          <SubmitButton
            disabled={
              vusbStatus !== VusbServerStatusEnum.IDLE &&
              vusbStatus !== VusbServerStatusEnum.STOPPED &&
              vusbStatus !== VusbServerStatusEnum.ERROR
            }
            toolTip="There is still a Virtual USB server running, please stop it before changing the settings"
            label="Update"
          />
        </div>
      </form>
    </div>
  );
};

export default Settings;
