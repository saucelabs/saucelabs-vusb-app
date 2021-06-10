import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeviceDetails from './components/DeviceDetails';
import Input, { InputType } from '../components/Input';
import Notification, { NotificationsType } from '../components/Notification';
import { isAndroidError, isIOSError } from '../utils/Checks';
import { StoreContext } from '../store/Store';
import { getInUseDevices, getDevices, getAvailableDevices } from './DevicesAPI';
import {
  deviceSearch,
  deviceSessionClearLogs,
  deviceSessionToggleLogs,
} from '../store/actions/DeviceActions';
import Styles from './DevicesOverview.module.css';
import { ROUTES } from '../utils/Constants';
import { getGenericStorage } from '../settings/SettingsStorage';
import {
  connectToDeviceSession,
  disconnectDeviceSession,
} from './DeviceOperations';
import { ApiStatusEnum } from './DeviceTypes';

const DevicesOverview = () => {
  let fetchInUseDevices: ReturnType<typeof setTimeout>;
  let fetchAvailableDevices: ReturnType<typeof setTimeout>;
  const { state, dispatch } = React.useContext(StoreContext);
  const {
    devices: {
      connectedDevices,
      devices,
      devicesChecked,
      deviceQuery,
      error: apiError,
      status: apiStatus,
    },
    server: { status: vusbStatus },
  } = state;
  const {
    server: { autoAdbConnect },
  } = getGenericStorage();

  useEffect(() => {
    async function fetchDevices() {
      await getDevices(dispatch);
    }

    // Only fetch the devices when no device is connected over vUSB, otherwise
    // we would overwrite all current settings/data
    if (connectedDevices.length === 0 && deviceQuery === '') {
      fetchDevices();
    }
  }, []);
  useEffect(() => {
    fetchInUseDevices = setInterval(
      () => getInUseDevices(dispatch, vusbStatus),
      5000
    );
    fetchAvailableDevices = setInterval(
      () => getAvailableDevices(dispatch),
      5000
    );

    return () => {
      clearInterval(fetchInUseDevices);
      clearInterval(fetchAvailableDevices);
    };
  }, [vusbStatus]);

  const handleDeviceSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(deviceSearch(event.target.value));
  };
  const clearDeviceLogs = (deviceId: string) => {
    dispatch(deviceSessionClearLogs(deviceId));
  };
  const closeDeviceSession = ({
    descriptorId,
    port,
    sessionId,
    status,
  }: {
    descriptorId: string;
    port: number;
    sessionId: string;
    status: string;
  }) => {
    disconnectDeviceSession({
      descriptorId,
      dispatch,
      port,
      sessionId,
      status,
    });
  };
  const startDeviceSession = (deviceId: string, sessionId: string) => {
    connectToDeviceSession(dispatch, deviceId, sessionId);
  };
  const toggleDeviceLogs = (deviceId: string, showLogs: boolean) => {
    dispatch(deviceSessionToggleLogs(deviceId, showLogs));
  };
  const platformErrorMessage =
    // eslint-disable-next-line no-nested-ternary
    isAndroidError() && isIOSError()
      ? 'Android and iOS'
      : isAndroidError()
      ? 'Android'
      : 'iOS';
  const hasHave = isAndroidError() && isIOSError() ? 'have' : 'has';

  return (
    <div className={Styles.container}>
      {(isAndroidError() || isIOSError()) && (
        <Notification type={NotificationsType.WARNING} floatingCenter>
          <span>
            Your {platformErrorMessage} environment {hasHave}{' '}
            <strong>NOT</strong> been set up properly, please check the{' '}
            <Link to={ROUTES.HOME}>Home</Link> page to see what needs to be
            fixed.
          </span>
        </Notification>
      )}
      <span className={Styles.title}>Device Catalog</span>
      {/* eslint-disable-next-line no-nested-ternary */}
      {apiStatus === ApiStatusEnum.LOADING ||
      (apiStatus === ApiStatusEnum.IDLE && devices.length === 0) ? (
        <div>Loading devices....</div>
      ) : // eslint-disable-next-line no-nested-ternary
      apiStatus === ApiStatusEnum.ERROR ? (
        <Notification type={NotificationsType.ERROR}>
          <div>
            There was an error retrieving the devices, please see below for more
            information.
            <pre>{apiError?.message}</pre>
          </div>
        </Notification>
      ) : devices.length === 0 && deviceQuery === '' ? (
        <Notification type={NotificationsType.WARNING}>
          <span>
            No devices could be found. Reasons for this could be that you
            don&lsquo;t have private devices, please contact your Customer
            Success Manager at Sauce Labs
          </span>
        </Notification>
      ) : (
        <div>
          <div className={Styles['flex-container']}>
            <div className={Styles['flex-1-2']}>
              <div className={Styles['search-box']}>
                <Input
                  name="searchDevices"
                  label="Search devices"
                  onChange={handleDeviceSearch}
                  type={InputType.TEXT}
                  value={deviceQuery}
                />
              </div>
            </div>
          </div>
          <div className={Styles.text}>
            <p>
              Please select your device. Can&lsquo;t find your device listed?
              Contact your Customer Success Manager.
            </p>
          </div>
          <div className={Styles['devices-wrapper']}>
            {devices.length === 0 ? (
              <Notification type={NotificationsType.WARNING}>
                <p>No matching devices found</p>
              </Notification>
            ) : (
              devices.map(
                (device) =>
                  device.showDevice && (
                    <DeviceDetails
                      adbAutoConnect={autoAdbConnect}
                      androidError={isAndroidError()}
                      clearDeviceLogs={clearDeviceLogs}
                      closeSession={closeDeviceSession}
                      device={device}
                      devicesChecked={devicesChecked}
                      iosError={isIOSError()}
                      key={device.descriptorId}
                      launchTest={startDeviceSession}
                      toggleDeviceLogs={toggleDeviceLogs}
                      vusbStatus={vusbStatus}
                    />
                  )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesOverview;
