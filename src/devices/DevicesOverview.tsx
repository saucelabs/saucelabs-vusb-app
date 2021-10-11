import React, { useEffect } from 'react';
import semver from 'semver';
import DeviceDetails from './components/DeviceDetails';
import Input, { InputType } from '../components/Input';
import { StoreContext } from '../store/Store';
import { getInUseDevices, getDevices, getAvailableDevices } from './DevicesAPI';
import {
  deviceSearch,
  deviceSessionClearLogs,
  deviceSessionToggleLogs,
} from '../store/actions/DeviceActions';
import Styles from './DevicesOverview.module.css';
import {
  getGenericStorage,
  setGenericStorage,
} from '../settings/SettingsStorage';
import {
  connectToDeviceSession,
  disconnectDeviceSession,
} from './DeviceOperations';
import DevicesNotifications from './components/DevicesNotifications';
import DeviceDetailsEmptyCard from './components/DeviceDetailsEmptyCard';
import { ApiStatusEnum } from './DeviceApiTypes';
import ProductTour from '../productTour/ProductTour';
import { APP_VERSION } from '../utils/Constants';
import { openProductTour } from '../store/actions/ProductTourActions';

const DevicesOverview = () => {
  let fetchInUseDevices: ReturnType<typeof setTimeout>;
  let fetchAvailableDevices: ReturnType<typeof setTimeout>;
  const { state, dispatch } = React.useContext(StoreContext);
  const {
    devices: {
      connectedDevices,
      devices,
      deviceQuery,
      error: apiError,
      status: apiStatus,
    },
    productTour: { isOpen: showProductTour },
    server: { status: vusbStatus },
    settings: { isOpen: isSettingsModalOpen },
  } = state;
  const storageData = getGenericStorage();
  const {
    connection: { username, accessKey },
    productTour = { appVersion: APP_VERSION },
    server: { autoAdbConnect },
  } = storageData;
  const { appVersion } = productTour;
  const isUserDataStored = Boolean(username && accessKey);

  useEffect(() => {
    if (semver.gt(APP_VERSION, appVersion)) {
      dispatch(openProductTour());
      // Update the version in the storage
      setGenericStorage({
        ...storageData,
        productTour: {
          appVersion: APP_VERSION,
        },
      });
    }
  }, [appVersion, dispatch, storageData]);
  useEffect(() => {
    async function fetchDevices() {
      await getDevices(dispatch);
    }

    // Only fetch the devices when no device is connected over vUSB, otherwise
    // we would overwrite all current settings/data
    if (
      connectedDevices.length === 0 &&
      deviceQuery === '' &&
      isUserDataStored
    ) {
      fetchDevices();
    }
  }, [connectedDevices.length, deviceQuery, dispatch, isUserDataStored]);
  useEffect(() => {
    fetchInUseDevices = setInterval(
      () => (isUserDataStored ? getInUseDevices(dispatch, vusbStatus) : null),
      5000
    );
    fetchAvailableDevices = setInterval(
      () => (isUserDataStored ? getAvailableDevices(dispatch) : null),
      5000
    );

    return () => {
      clearInterval(fetchInUseDevices);
      clearInterval(fetchAvailableDevices);
    };
  }, [vusbStatus, isUserDataStored]);

  const skipProductTour = () => dispatch(openProductTour());
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

  return (
    <div className={Styles.container}>
      {showProductTour && (
        <ProductTour
          isUserDataStored={isUserDataStored}
          skipProductTour={skipProductTour}
        />
      )}
      {/* Only show when the settings screen is not open */}
      {!isSettingsModalOpen && (
        <DevicesNotifications
          apiStatus={apiStatus}
          apiError={apiError}
          devices={devices}
          deviceQuery={deviceQuery}
        />
      )}
      <div>
        <div className={Styles.flexContainer}>
          <div className={Styles['flex-1-2']}>
            <div className={Styles.searchBox}>
              <Input
                name="searchDevices"
                placeholder="Search by device name, manufacturer or OS"
                onChange={handleDeviceSearch}
                type={InputType.SEARCH}
                value={deviceQuery}
              />
            </div>
          </div>
        </div>
        <div className={Styles.textContainer}>
          <span className={Styles.text}>
            <span className={Styles.textBold}>Looking for a device?</span>{' '}
            Please contact your Sauce Labs representative.
          </span>
        </div>
        <div className={Styles.devicesWrapper}>
          {devices.length === 0 || apiStatus === ApiStatusEnum.ERROR ? (
            <>
              <DeviceDetailsEmptyCard />
              <DeviceDetailsEmptyCard />
              <DeviceDetailsEmptyCard />
              <DeviceDetailsEmptyCard />
              <DeviceDetailsEmptyCard />
              <DeviceDetailsEmptyCard />
            </>
          ) : (
            devices.map(
              (device) =>
                device.showDevice && (
                  <DeviceDetails
                    adbAutoConnect={autoAdbConnect}
                    clearDeviceLogs={clearDeviceLogs}
                    closeSession={closeDeviceSession}
                    device={device}
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
    </div>
  );
};

export default DevicesOverview;
