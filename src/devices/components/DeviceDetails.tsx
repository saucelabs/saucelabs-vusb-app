import React, { useState } from 'react';
import Styles from './DeviceDetails.module.css';
import DeviceServerMonitor from '../../server/DeviceServerMonitor';
import Switch from '../../components/Switch';
import DeviceDetailsModal from './DeviceDetailsModal';
import { DeviceStateInterface } from '../DeviceInterfaces';
import { VusbServerStatusEnum } from '../../server/ServerTypes';
import { DeviceSessionStatusEnum } from '../DeviceTypes';

interface DeviceDetailsInterface {
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
  device: DeviceStateInterface;
  devicesChecked: boolean;
  iosError: boolean;
  launchTest: (deviceId: string, sessionId: string) => void;
  toggleDeviceLogs: (deviceId: string, showLogs: boolean) => void;
  vusbStatus: string;
}
interface ConnectMessageInterface {
  adbAutoConnect: boolean;
  device: DeviceStateInterface;
}

const DeviceDetails: React.FC<DeviceDetailsInterface> = ({
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
  }: ConnectMessageInterface) => {
    const { adbConnected, os, port, status } = connectedDevice;
    const deviceConnected = status === DeviceSessionStatusEnum.CONNECTED;
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
  const serverRunning = vusbStatus === VusbServerStatusEnum.RUNNING;
  const isError = status === DeviceSessionStatusEnum.ERROR;
  const deviceConnecting = status === DeviceSessionStatusEnum.CONNECTING;
  const deviceConnected = status === DeviceSessionStatusEnum.CONNECTED;
  const deviceStopping = status === DeviceSessionStatusEnum.STOPPING;
  // eslint-disable-next-line no-nested-ternary
  const switchLabel = isError
    ? 'ERROR'
    : deviceStopping
    ? 'STOPPING'
    : // eslint-disable-next-line no-nested-ternary
      `CONNECT${deviceConnecting ? 'ING' : deviceConnected ? 'ED' : ''}`;
  const inCleaningProcess =
    isBusy && !inUse && status === DeviceSessionStatusEnum.STOPPED;

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
                  <button
                    className={`${Styles['details-link']} ${Styles.detailsButton}`}
                    onClick={handleClickOpenDialog}
                    type="button"
                  >
                    Details
                  </button>
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
            <button
              // Only show an active link of the logs if there are logs
              className={`${Styles.link} ${Styles.detailsButton} ${
                log.length === 0 ? Styles.disabled : ''
              }`}
              onClick={() => toggleDeviceLogs(descriptorId, showLogs)}
              type="button"
            >
              View logs
            </button>
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
