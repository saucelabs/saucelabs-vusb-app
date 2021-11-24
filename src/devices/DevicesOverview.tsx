import React, { useEffect, useState } from 'react';
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
import Header from '../components/Header';
import StartStopServerButton from '../components/buttons/StartStopServerButton';
import { startServer, stopServer } from '../server/ServerOperations';
import ServerMonitorButton from '../components/buttons/ServerMonitorButton';
import { getGuiVersions } from '../utils/Helpers';

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
    server: { error: vusbError, status: vusbStatus },
  } = state;
  const storageData = getGenericStorage();
  const {
    connection: { username, accessKey },
    productTour = { appVersion: APP_VERSION },
    server: { autoAdbConnect },
  } = storageData;
  const { appVersion } = productTour;
  const isUserDataStored = Boolean(username && accessKey);
  const [isDeprecated, setIsDeprecated] = useState(false);
  const [doUpdate, setDoUpdate] = useState(false);
  useEffect(() => {
    try {
      (async () => {
        const { deprecated, update } = await getGuiVersions();
        setIsDeprecated(deprecated);
        setDoUpdate(update);
      })();
    } catch (ign) {
      // Do nothing, tis is not blocking
    }
  }, []);
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

  const startVusbServer = () => startServer(dispatch, vusbStatus);
  const stopVusbServer = () => stopServer(dispatch, connectedDevices);
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
    <>
      <Header
        title="Device Catalog"
        headerComponents={[
          <StartStopServerButton
            key="StartStopServerButton"
            serverStatus={vusbStatus}
            startVusbServer={startVusbServer}
            stopVusbServer={stopVusbServer}
          />,
          <ServerMonitorButton
            key="ServerMonitorButton"
            serverError={vusbError}
            serverStatus={vusbStatus}
          />,
        ]}
      />
      <div className={Styles.container}>
        {(showProductTour || !isUserDataStored) && (
          <ProductTour
            isUserDataStored={isUserDataStored}
            skipProductTour={skipProductTour}
          />
        )}
        <DevicesNotifications
          apiStatus={apiStatus}
          apiError={apiError}
          devices={devices}
          deviceQuery={deviceQuery}
          doUpdate={doUpdate}
          isDeprecated={isDeprecated}
        />
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
            {devices.length === 0 || apiStatus === ApiStatusEnum.ERROR
              ? [...Array(6)].map((_num, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <DeviceDetailsEmptyCard key={`empty-card-${index}`} />
                ))
              : devices.map(
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
                )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DevicesOverview;
