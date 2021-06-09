import React, { useState } from 'react';
import Styles from './DeviceDetails.module.css';
import DeviceServerMonitor from '../../server/DeviceServerMonitor';
import Switch from '../../components/Switch';
import DeviceDetailsModal from './DeviceDetailsModal';
import { DeviceStateType } from '../../types/DeviceTypes';
import { DEVICE_SESSION_STATUS } from '../../store/actions/DeviceActions';
import { VUSB_SERVER_STATUS } from '../../store/actions/ServerActions';

type DeviceDetailsType = {
  adbAutoConnect: boolean;
  androidError: boolean;
  clearDeviceLogs: (deviceId: string) => void;
  closeSession: ({
    descriptorId,
    port,
    sessionId,
    status,
  }: {
    descriptorId: string;
    port: number;
    sessionId: string;
    status: string;
  }) => void;
  device: DeviceStateType;
  devicesChecked: boolean;
  iosError: boolean;
  launchTest: (deviceId: string, sessionId: string) => void;
  toggleDeviceLogs: (deviceId: string, showLogs: boolean) => void;
  vusbStatus: string;
};
type ConnectMessageType = {
  adbAutoConnect: boolean;
  device: DeviceStateType;
};

const DeviceDetails: React.FC<DeviceDetailsType> = ({
  adbAutoConnect,
  androidError,
  clearDeviceLogs,
  closeSession,
  device,
  devicesChecked,
  iosError,
  launchTest,
  toggleDeviceLogs,
  vusbStatus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClickOpenDialog = () => setIsOpen(true);
  const handleClickCloseDialog = () => setIsOpen(false);
  const connectedMessage = ({
    adbAutoConnect: adbConnect,
    device: connectedDevice,
  }: ConnectMessageType) => {
    const { adbConnected, os, port, status } = connectedDevice;
    const deviceConnected = status === DEVICE_SESSION_STATUS.CONNECTED;
    const isAndroid = os.toLowerCase() === 'android';
    // eslint-disable-next-line no-nested-ternary
    const adbMessage = adbConnected
      ? `ADB connected to port: ${port}`
      : port
      ? `Connect to port: ${port}`
      : 'Waiting for port';

    // eslint-disable-next-line no-nested-ternary
    return deviceConnected ? (
      isAndroid ? (
        <div>
          {adbConnect && !adbConnected ? 'Auto connecting to ADB' : adbMessage}
        </div>
      ) : (
        // iOS
        ''
      )
    ) : // Do nothing
    null;
  };
  const {
    error,
    descriptorId,
    // Means the device is not in the list of available devices
    // from the Sauce API
    isBusy,
    // Means the device is in use through live or automated tests
    // comes from the vUSB sessions response
    inUse,
    log,
    name,
    os,
    osVersion,
    port,
    resolutionHeight,
    resolutionWidth,
    sessionID,
    screenSize,
    showLogs,
    status,
  } = device;
  const imgUrl = `https://d3ty40hendov17.cloudfront.net/device-pictures/${descriptorId}_optimised.png`;
  const isAndroid = os.toLowerCase() === 'android';
  const isIOS = !isAndroid;
  const platform = isAndroid ? 'Android' : 'iOS';
  const serverRunning = vusbStatus === VUSB_SERVER_STATUS.RUNNING;
  const isError = status === DEVICE_SESSION_STATUS.ERROR;
  const deviceConnecting = status === DEVICE_SESSION_STATUS.CONNECTING;
  const deviceConnected = status === DEVICE_SESSION_STATUS.CONNECTED;
  const deviceStopping = status === DEVICE_SESSION_STATUS.STOPPING;
  // eslint-disable-next-line no-nested-ternary
  const switchLabel = isError
    ? 'ERROR'
    : deviceStopping
    ? 'STOPPING'
    : // eslint-disable-next-line no-nested-ternary
      `CONNECT${deviceConnecting ? 'ING' : deviceConnected ? 'ED' : ''}`;
  const inCleaningProcess =
    isBusy && !inUse && status === DEVICE_SESSION_STATUS.STOPPED;

  return (
    <div>
      <div className={`${Styles.container}`}>
        {!inUse && isBusy && !inCleaningProcess && !deviceConnected && (
          <div className={`${Styles.badge} ${Styles.busy}`}>Busy</div>
        )}
        {inUse && isBusy && !inCleaningProcess && !deviceConnected && (
          <div className={`${Styles.badge} ${Styles.inUse}`}>
            Used for manual or automated session.
          </div>
        )}
        {inCleaningProcess && (
          <div className={`${Styles.badge} ${Styles.busy}`}>
            Cleaning
            <br />
            device
          </div>
        )}
        {deviceConnected && (
          <div className={`${Styles.badge} ${Styles.busy}`}>Using vUSB</div>
        )}
        <div
          className={`${Styles['device-tile']} ${
            serverRunning &&
            devicesChecked &&
            // We should still be able to connect to the device
            // so don't disable it
            (!isBusy || inUse) &&
            !inCleaningProcess &&
            ((isAndroid && !androidError) || (isIOS && !iosError))
              ? ''
              : Styles.disabled
          } ${isError ? Styles.error : ''}`}
          id={descriptorId}
        >
          <div className={Styles.header}>
            <span className={Styles.title}>{name}</span>
          </div>
          <div className={Styles.content}>
            <div className={Styles['image-wrapper']}>
              <img alt={name} src={imgUrl} />
            </div>
            <div className={Styles['device-data-wrapper']}>
              <div>
                <div>
                  {platform} {osVersion}
                </div>
                <div>
                  {screenSize}&ldquo; ({resolutionWidth} x {resolutionHeight})
                </div>
                <div>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                  <a
                    onClick={handleClickOpenDialog}
                    className={Styles['details-link']}
                  >
                    Details
                  </a>
                  <DeviceDetailsModal
                    deviceDetails={device}
                    handleClose={handleClickCloseDialog}
                    open={isOpen}
                  />
                </div>
              </div>
              <div className={Styles['device-connection-wrapper']}>
                <Switch
                  checked={deviceConnected || deviceStopping}
                  disabled={
                    !serverRunning ||
                    deviceConnecting ||
                    deviceStopping ||
                    !inUse
                  }
                  error={isError}
                  label={switchLabel}
                  onChange={() =>
                    deviceConnected
                      ? closeSession({
                          descriptorId,
                          port,
                          sessionId: sessionID,
                          status,
                        })
                      : launchTest(descriptorId, sessionID)
                  }
                />
                {connectedMessage({ adbAutoConnect, device })}
              </div>
            </div>
          </div>
          <div className={Styles['device-action-wrapper']}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <a
              // Only show an active link of the logs if there are logs
              className={`${Styles.link} ${
                log.length === 0 ? Styles.disabled : ''
              }`}
              onClick={() => toggleDeviceLogs(descriptorId, showLogs)}
            >
              View logs
            </a>
          </div>
        </div>
      </div>
      {showLogs && (
        <DeviceServerMonitor
          clearLogs={clearDeviceLogs}
          device={name}
          deviceID={descriptorId}
          logLines={log}
          serverError={error}
          serverStatus={status}
          showLogs={showLogs}
          toggleDeviceLogs={toggleDeviceLogs}
        />
      )}
    </div>
  );
};

export default DeviceDetails;
