/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import { useContext, useEffect, useRef, useState } from 'react';
import semver from 'semver';
import {
  deviceActions,
  deviceSearch,
  deviceSessionClearLogs,
  deviceSessionToggleLogs,
  setTunnelIdentifier,
} from 'renderer/actions/DeviceActions';
import {
  vusbServerStartActions,
  vusbServerStopAction,
} from 'renderer/actions/ServerActions';
import {
  getAvailableDevices,
  getDevices,
  getInUseDevices,
} from 'renderer/api/DevicesAPI';
import ServerMonitorButton from 'renderer/components/buttons/ServerMonitorButton';
import StartStopServerButton from 'renderer/components/buttons/StartStopServerButton';
import DeviceDetails from 'renderer/components/device/DeviceDetails';
import DeviceDetailsEmptyCard from 'renderer/components/devices/DeviceDetailsEmptyCard';
import Input, { InputType } from 'renderer/components/Input';
import { StoreContext } from 'renderer/Store';
import { APP_VERSION, LOCATION, ROUTES } from 'renderer/utils/Constants';
import getTunnels from 'renderer/api/TunnelsAPI';
import Dropdown from 'renderer/components/Dropdown';
import { Link } from 'react-router-dom';
import {
  DeviceActionEnum,
  DeviceSessionStatusEnum,
} from '../../types/DeviceTypes';
import { ServerActionEnum } from '../../types/ServerTypes';
import Header from '../components/Header';
import Styles from './DevicesOverview.module.css';
import ProductTour from './ProductTour';
import { openProductTour } from '../actions/ProductTourActions';
import Notification, { NotificationsEnum } from '../components/Notification';

const DevicesOverview = () => {
  const [busyDevicesLoaded, setBusyDevicesLoaded] = useState(false);
  const [manualClosedDevices, setManualClosedDevices] = useState<string[]>([]);
  const fetchInUseDevices = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchAvailableDevices = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const fetchTunnels = useRef<ReturnType<typeof setInterval> | null>(null);
  const { state, dispatch } = useContext(StoreContext);
  const {
    authentication: { tokenId },
    devices: {
      connectedDevices,
      devices,
      deviceQuery,
      error: deviceApiError,
      tunnelIdentifier,
    },
    productTour: { isOpen: showProductTour },
    server: { error: vusbError, status: vusbStatus },
    systemChecks: { isAndroidError, isIOSError, isLinux, isMac, isWindows },
    tunnels: { tunnels },
  } = state;
  const storageData = window.electron.store.get();
  const {
    connection: { location, username, accessKey },
    productTour = { appVersion: APP_VERSION },
    server: { autoAdbConnect },
  } = storageData;
  const isUserDataStored = Boolean(username && accessKey);
  const { appVersion } = productTour;
  /**
   * Fetches the devices from the API
   */
  useEffect(() => {
    async function fetchDevices() {
      await getDevices({
        dispatch,
        isWindows,
        isLinux,
        isMac,
        storageData,
      });
    }

    // Only fetch the devices when no device is connected over vUSB, otherwise
    // we would overwrite all current settings/data
    if (
      connectedDevices.length === 0 &&
      deviceQuery === '' &&
      devices.length === 0 &&
      isUserDataStored
    ) {
      fetchDevices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    connectedDevices,
    deviceQuery,
    dispatch,
    isWindows,
    isLinux,
    isMac,
    // @TODO: added the eslint-disable-next-line react-hooks/exhaustive-deps
    // for `storageData`, when I add that to the deps then it keeps re-rendering.
    // I can't find the root cause of this.
    // storageData,
  ]);
  /**
   * Fetches the devices that are in use with vUSB
   */
  useEffect(() => {
    fetchInUseDevices.current = setInterval(
      () =>
        isUserDataStored
          ? getInUseDevices(dispatch, storageData, vusbStatus)
          : null,
      3000
    );

    return () => {
      if (fetchInUseDevices.current) {
        clearInterval(fetchInUseDevices.current);
      }
    };
  }, [
    dispatch,
    // @TODO: added the eslint-disable-next-line react-hooks/exhaustive-deps
    // for `storageData`, when I add that to the deps then it keeps re-rendering.
    // I can't find the root cause of this.
    // storageData,
    vusbStatus,
  ]);
  /**
   * Fetches the devices that are in available with the API
   */
  useEffect(() => {
    fetchAvailableDevices.current = setInterval(
      () =>
        isUserDataStored
          ? getAvailableDevices(dispatch, storageData)
              .then(() => setBusyDevicesLoaded(true))
              .catch(() => setBusyDevicesLoaded(false))
          : null,
      5000
    );

    return () => {
      if (fetchAvailableDevices.current) {
        clearInterval(fetchAvailableDevices.current);
      }
    };
  }, [
    dispatch,
    // @TODO: added the eslint-disable-next-line react-hooks/exhaustive-deps
    // for `storageData`, when I add that to the deps then it keeps re-rendering.
    // I can't find the root cause of this.
    // storageData,
    vusbStatus,
  ]);
  /**
   * Fetch all tunnels from the API
   */
  useEffect(() => {
    fetchTunnels.current = setInterval(
      () => (isUserDataStored ? getTunnels({ dispatch, storageData }) : null),
      5000
    );
  }, [dispatch]);
  /**
   * Determines if the product tour needs to be shown and if so update the
   * store with the latest version for the next time the app is opened
   */
  useEffect(() => {
    if (semver.gt(APP_VERSION, appVersion)) {
      dispatch(openProductTour());
      window.electron.store.set({
        ...storageData,
        productTour: {
          ...storageData.productTour,
          appVersion: APP_VERSION,
        },
      });
    }
    // }, [appVersion, dispatch, storageData]);
  }, [appVersion, dispatch]);

  /**
   * Server
   */
  const startVusbServer = () => {
    window.electron.vusb.start(vusbStatus);
    window.electron.vusb.onRunning(({ logLine, status }) =>
      vusbServerStartActions({ dispatch, logLine, status })
    );
  };
  const stopVusbServer = () => {
    const connectionMessage =
      connectedDevices.length > 0 ? 'There are still devices connected! ' : '';
    if (
      window.confirm(
        `${connectionMessage}Are you sure you want to stop the vUSB server?`
      )
    ) {
      window.electron.vusb.stop();
      window.electron.vusb.onStopping(({ logLine }) =>
        dispatch(vusbServerStopAction(logLine))
      );
    }
  };
  useEffect(() => {
    if (vusbStatus === ServerActionEnum.VUSB_IDLE) {
      window.electron.vusb.removeAllListeners();
    }
  }, [vusbStatus]);

  /**
   * Devices
   */
  const startDeviceSession = async (
    descriptorId: string,
    sessionId: string | null = null
  ) => {
    deviceActions({
      descriptorId,
      dispatch,
      logLine: '',
      status: DeviceActionEnum.DEVICE_SESSION_STARTING,
    });
    const {
      adbConnected,
      connectionError,
      logLines,
      manualConnect,
      portNumber,
    } = await window.electron.device.start({
      descriptorId,
      sessionId,
      storageData,
      tunnelIdentifier,
    });
    deviceActions({
      adbConnected,
      descriptorId,
      dispatch,
      logLine: logLines,
      manualConnect,
      port: portNumber,
      status: connectionError
        ? DeviceActionEnum.DEVICE_SESSION_ERROR
        : DeviceActionEnum.DEVICE_SESSION_RUNNING,
    });
  };
  const clearDeviceLogs = (descriptorId: string) => {
    dispatch(deviceSessionClearLogs(descriptorId));
  };
  const closeDeviceSession = async ({
    descriptorId,
    manualConnect,
    port,
    sessionId,
    status,
  }: {
    descriptorId: string;
    manualConnect: boolean;
    port: number;
    sessionId: string;
    status: DeviceSessionStatusEnum;
  }) => {
    deviceActions({
      descriptorId,
      dispatch,
      logLine: '',
      status: DeviceActionEnum.DEVICE_SESSION_STOPPING,
    });
    const { adbConnected, logLines, portNumber } =
      await window.electron.device.stop({
        descriptorId,
        manualConnect,
        port,
        sessionId,
        status,
        storageData,
      });
    deviceActions({
      adbConnected,
      descriptorId,
      dispatch,
      logLine: logLines,
      port: portNumber,
      status: DeviceActionEnum.DEVICE_SESSION_STOPPED,
    });
  };
  const toggleDeviceLogs = (descriptorId: string, showLogs: boolean) => {
    dispatch(deviceSessionToggleLogs(descriptorId, showLogs));
  };
  const handleDeviceSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(deviceSearch(event.target.value));
  };
  const handleTunnelIdentifier = (selected: string) => {
    dispatch(setTunnelIdentifier(selected));
  };
  // Close the device with the correct status when it is being closing from the
  // manual device session window
  useEffect(() => {
    window.electron.device.onManualSessionClose(async (args) => {
      if (!manualClosedDevices.includes(args.descriptorId)) {
        setManualClosedDevices([...manualClosedDevices, args.descriptorId]);
        await closeDeviceSession(args);
        setManualClosedDevices([
          ...manualClosedDevices.filter((id) => id !== args.descriptorId),
        ]);
      }
    });
  }, [window.electron.device.onManualSessionClose]);
  /**
   * Product Tour
   */
  const skipProductTour = () => dispatch(openProductTour());

  // The tunnels url
  // @ts-ignore
  const region = LOCATION[location.toUpperCase()].endpoint;
  const tunnelsUrl = `https://accounts.saucelabs.com/am/XUI/?region=${region}&next=/tunnels`;

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
        {
          // @ts-ignore
          deviceApiError && deviceApiError.response.status === 401 && (
            <Notification title="Error" type={NotificationsEnum.ERROR}>
              <>
                There is an authentication error for retrieving the devices. You
                might want to check if you <em>username</em> and{' '}
                <em>access key</em> are correct. <br />
                See below for the original message.
                <pre>{deviceApiError?.message}</pre>
                Click{' '}
                <Link to={ROUTES.SETTINGS} replace>
                  here
                </Link>{' '}
                to go to the <em>Settings</em>-page and check your settings.
              </>
            </Notification>
          )
        }
        {busyDevicesLoaded && devices.length === 0 && (
          <Notification
            background
            title="Warning"
            type={NotificationsEnum.WARNING}
          >
            <>
              No devices could be found. Reasons for this could be that you
              don&#39;t have private devices, please contact your Customer
              Success Manager at Sauce Labs
            </>
          </Notification>
        )}
        {(isAndroidError || isIOSError) && (
          <Notification type={NotificationsEnum.WARNING} title="Warning">
            <>
              Your environment has <strong>NOT</strong> been set up properly,
              please click <Link to={ROUTES.REQUIREMENTS}>here</Link> to go to
              the <em>Requirements</em>-page to see what needs to be fixed.
            </>
          </Notification>
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
            <div className={Styles['flex-1-2']}>
              <div className={Styles.searchBox}>
                <div className={Styles.dropdownMainContainer}>
                  <div className={Styles.dropdownLabel}>
                    <strong>Tunnel Proxies:</strong>
                    <svg
                      height="14"
                      width="14"
                      viewBox="0 0 24 24"
                      className={Styles.tunnelInfoIcon}
                    >
                      <path d="M14.27 17.675a.748.748 0 00-.548-.23h-.778v-7a.747.747 0 00-.23-.547.747.747 0 00-.547-.231h-1.89a.747.747 0 00-.546.23.747.747 0 00-.231.547c0 .211.077.393.23.547.155.154.337.231.548.231h.778v6.222h-.778a.748.748 0 00-.547.231.748.748 0 00-.231.547c0 .21.077.393.23.547.155.154.337.231.548.231h3.444c.21 0 .393-.077.547-.23a.748.748 0 00.231-.548.748.748 0 00-.23-.547zM11.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-1.5 0c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12z"
                      />
                    </svg>
                    <span>
                      A tunnel can only be used when you start a NEW session,
                      NOT when you connect to an EXISTING device.
                    </span>
                  </div>
                  <div className={Styles.dropdownContainer}>
                    <Dropdown
                      defaultOption="None"
                      noOptionsComponent={
                        <>
                          No Active Tunnels,
                          <button
                            className={Styles.buttonLink}
                            onClick={() => window.open(tunnelsUrl, '_blank')}
                            type="button"
                          >
                            set up a tunnel
                          </button>
                        </>
                      }
                      options={tunnels}
                      onSelect={handleTunnelIdentifier}
                      selected={tunnelIdentifier as string}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={Styles.devicesWrapper}>
            {(!busyDevicesLoaded && devices.length === 0) || deviceApiError
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
                        tokenId={tokenId}
                        vusbStatus={vusbStatus}
                      />
                    )
                )}
          </div>
          <div className={Styles.textContainer}>
            <span className={Styles.text}>
              <span className={Styles.textBold}>Looking for a device?</span>{' '}
              Please contact your Sauce Labs representative.
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DevicesOverview;
