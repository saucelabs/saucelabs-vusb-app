/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FormEvent, useContext, useEffect, useState } from 'react';
import CloseIconButton from 'renderer/components/buttons/CloseIconButton';
import Button from 'renderer/components/buttons/Button';
import ConnectionTab from 'renderer/components/settings/ConnectionTab';
import DeviceProxy from 'renderer/components/settings/DeviceProxyTab';
import ServerProxy from 'renderer/components/settings/ServerProxyTab';
import ServerTab from 'renderer/components/settings/ServerTab';
import Tabs from 'renderer/components/Tabs';
import { StoreContext } from 'renderer/Store';
import { ServerActionEnum } from 'types/ServerTypes';
import { Link } from 'react-router-dom';
import { ROUTES } from 'renderer/utils/Constants';
import Notification, { NotificationsEnum } from '../components/Notification';
import Header from '../components/Header';
import Styles from './Settings.module.css';

const Settings: React.FC = () => {
  let closeNotification: ReturnType<typeof setTimeout>;
  const {
    state: {
      server: { status: vusbStatus },
    },
  } = useContext(StoreContext);
  const settingsData = window.electron.store.get();
  const [state, setState] = useState({ dataIsStored: false, ...settingsData });
  const handleGenericSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setState({
      ...state,
      dataIsStored: true,
    });
    window.electron.store.set({
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
      window.electron.reload();
    }, 3000);
  };
  // @ts-ignore
  useEffect(() => () => clearTimeout(closeNotification), [closeNotification]);
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
      <Header
        title="Settings"
        headerComponents={[
          <Link to={ROUTES.DEVICES} replace>
            <CloseIconButton key="CloseIconButton" />
          </Link>,
        ]}
      />
      <form onSubmit={handleGenericSubmit} className={Styles.formContainer}>
        {dataIsStored && (
          <Notification
            background
            dismissible={false}
            type={NotificationsEnum.INFO}
            title="Info"
          >
            <span>
              Data has been stored. <br /> The app will be reloaded in a few
              seconds.
            </span>
          </Notification>
        )}
        <Tabs>
          <div data-label="Connection" data-iconClass="fa-link">
            <ConnectionTab
              connectionData={connection}
              onChange={handleConnectionChange}
            />
          </div>
          <div data-label="Server" data-iconClass="fa-server">
            <ServerTab serverData={server} onChange={handleServerChange} />
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
          <Button
            disabled={
              vusbStatus !== ServerActionEnum.VUSB_IDLE &&
              vusbStatus !== ServerActionEnum.VUSB_STOPPED &&
              vusbStatus !== ServerActionEnum.VUSB_ERROR
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
