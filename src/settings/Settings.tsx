import React, { FormEvent, useEffect, useState } from 'react';
import Styles from './SettingsPage.module.css';
import Tabs from '../components/Tabs';
import SubmitButton from '../components/SubmitButton';
import Connection from './components/Connection';
import ServerProxy from './components/ServerProxy';
import Server from './components/Server';
import { Notification, NOTIFICATIONS } from '../components/Notification';
import DeviceProxy from './components/DeviceProxy';
import { VUSB_SERVER_STATUS } from '../store/actions/ServerActions';
import { getGenericStorage, setGenericStorage } from './SettingsStorage';
import { StoreContext } from '../store/Store';

type SettingsType = {
  androidVusbStatus: string;
  settingsData: {
    connection: {
      accessKey: string;
      username: string;
      location: string;
    };
    proxy: {
      host: string;
      port: string;
      username: string;
      password: string;
    };
    server: {
      adbPortMin: string;
      adbPortRange: string;
      autoAdbConnect: string;
      host: string;
      logsPath: string;
      logToFile: string;
      port: string;
      verboseLogs: boolean;
      version: string;
    };
    device: {
      proxy: {
        host: string;
        port: string;
        username: string;
        password: string;
      };
    };
  };
};

const Settings: React.FC<SettingsType> = () => {
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

    if (
      vusbStatus !== VUSB_SERVER_STATUS.IDLE &&
      vusbStatus !== VUSB_SERVER_STATUS.STOPPED &&
      vusbStatus !== VUSB_SERVER_STATUS.ERROR
    ) {
      // eslint-disable-next-line no-alert
      alert(
        'There is still a Virtual USB server running, please stop it before changing the settings'
      );
    } else {
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
      }, 3000);
    }
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
        ...{ [name]: value !== undefined ? value : checked },
      },
    });
  };
  const handleProxyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const { value } = event.target;

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
      <span className={Styles.title}>Settings</span>

      <form onSubmit={handleGenericSubmit}>
        {dataIsStored && (
          <Notification type={NOTIFICATIONS.INFO} floatingCenter>
            <span>Data has been stored</span>
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
        <div className={Styles['button-container']}>
          <SubmitButton label="Update" />
        </div>
      </form>
    </div>
  );
};

export default Settings;
