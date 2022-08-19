import React, { useState } from 'react';
import Styles from './DeviceDetails.module.css';
import Switch from '../Switch';
import DeviceServerMonitor from './DeviceServerMonitor';
import {
  DeviceSessionStatusEnum,
  DeviceStateType,
  ToggleLogsType,
} from '../../../types/DeviceTypes';
import DeviceDetailsModal from './DeviceDetailsModal';
import { ServerActionEnum } from '../../../types/ServerTypes';
import OpenManualTestModal from './OpenManualTestModal';

interface DeviceDetailsInterface {
  adbAutoConnect: boolean;
  clearDeviceLogs: (descriptorId: string) => void;
  closeSession: ({
    descriptorId,
    manualConnect,
    portNumber,
    sessionId,
    status,
  }: {
    descriptorId: string;
    manualConnect: boolean;
    portNumber: number;
    sessionId: string;
    status: DeviceSessionStatusEnum;
  }) => void;
  device: DeviceStateType;
  launchTest: (descriptorId: string, sessionId: string) => void;
  toggleDeviceLogs: ({ descriptorId, showLogs }: ToggleLogsType) => void;
  tokenId: string;
  vusbStatus: string;
}
interface ConnectMessageInterface {
  adbAutoConnect: boolean;
  device: DeviceStateType;
}

const DeviceDetails: React.FC<DeviceDetailsInterface> = ({
  adbAutoConnect,
  clearDeviceLogs,
  closeSession,
  device,
  launchTest,
  toggleDeviceLogs,
  tokenId,
  vusbStatus,
}) => {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isManualTestModalOpen, setIsManualTestModalOpen] = useState(false);
  const handleDetailsDialog = () =>
    setIsDetailsDialogOpen(!isDetailsDialogOpen);
  const handleOpenManualTestModal = () =>
    setIsManualTestModalOpen(!isManualTestModalOpen);
  const connectedMessage = ({
    adbAutoConnect: adbConnect,
    device: connectedDevice,
  }: ConnectMessageInterface) => {
    const { adbConnected, os, portNumber, status } = connectedDevice;
    const deviceConnected = status === DeviceSessionStatusEnum.CONNECTED;
    const isAndroid = os.toLowerCase() === 'android';
    // eslint-disable-next-line no-nested-ternary
    const adbMessage = adbConnected
      ? `ADB connected to portNumber: ${portNumber}`
      : portNumber
      ? `Connect to portNumber: ${portNumber}`
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
    dc,
    descriptorId,
    error,
    // Means the device is not in the list of available devices
    // from the Sauce API
    isBusy,
    // Means the device is in used through live or automated tests
    // comes from the vUSB sessions response
    inUse,
    log,
    manualConnect,
    name,
    os,
    osVersion,
    portNumber,
    resolutionHeight,
    resolutionWidth,
    screenSize,
    sessionID,
    showLogs,
    status,
  } = device;
  const imgUrl = `https://d3ty40hendov17.cloudfront.net/device-pictures/${descriptorId}_optimised.png`;
  const isAndroid = os.toLowerCase() === 'android';
  const platform = isAndroid ? 'Android' : 'iOS';
  const serverRunning = vusbStatus === ServerActionEnum.VUSB_RUNNING;
  const isError = status === DeviceSessionStatusEnum.ERROR;
  const deviceConnecting = status === DeviceSessionStatusEnum.CONNECTING;
  const deviceConnected = status === DeviceSessionStatusEnum.CONNECTED;
  const deviceStopped = status === DeviceSessionStatusEnum.STOPPED;
  const deviceStopping = status === DeviceSessionStatusEnum.STOPPING;
  // eslint-disable-next-line no-nested-ternary
  const switchLabel = isError
    ? 'ERROR'
    : deviceStopping
    ? 'STOPPING'
    : // eslint-disable-next-line no-nested-ternary
      `CONNECT${deviceConnecting ? 'ING' : deviceConnected ? 'ED' : ''}`;
  const canTakeOver =
    isBusy && inUse && serverRunning && !deviceConnected && !manualConnect;
  const inCleaningProcess = isBusy && deviceStopped && manualConnect;
  const deviceIsBusy =
    isBusy && !canTakeOver && !inCleaningProcess && !deviceConnected && !inUse;
  const isDisabledSwitch =
    (!serverRunning && (deviceIsBusy || !canTakeOver)) ||
    inCleaningProcess ||
    deviceConnecting ||
    deviceStopping;

  return (
    <div>
      <div className={`${Styles.container}`}>
        {canTakeOver && (
          <div className={`${Styles.badge} ${Styles.busy}`}>
            Can take
            <br />
            over
          </div>
        )}
        {deviceIsBusy && (
          <div className={`${Styles.badge} ${Styles.busy}`}>Busy</div>
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
          className={`${Styles.deviceTile} ${isError ? Styles.error : ''}`}
          id={descriptorId}
        >
          <div
            className={
              (deviceIsBusy && !canTakeOver) || inCleaningProcess
                ? Styles.disabled
                : ''
            }
          >
            <div className={Styles.header}>
              <span className={Styles.title}>{name}</span>
            </div>
            <div className={Styles.content}>
              <div className={Styles.imageWrapper}>
                <img alt={name} src={imgUrl} />
              </div>
              <div className={Styles.deviceDataWrapper}>
                <div>
                  <div>
                    {platform} {osVersion}
                  </div>
                  <div>
                    {screenSize}&ldquo; | {resolutionWidth} x {resolutionHeight}
                  </div>
                </div>
                <div>
                  <div
                    className={`${
                      isDisabledSwitch ? Styles.disabledSwitchContainer : ''
                    }`}
                  >
                    <Switch
                      checked={deviceConnected || deviceStopping}
                      disabled={isDisabledSwitch}
                      error={isError}
                      label={switchLabel}
                      onChange={() =>
                        deviceConnected
                          ? closeSession({
                              descriptorId,
                              manualConnect,
                              portNumber,
                              sessionId: sessionID,
                              status,
                            })
                          : launchTest(descriptorId, sessionID)
                      }
                    />
                    {!serverRunning && (
                      <div className={Styles.infoContainer}>
                        <span>
                          First start the vUSB server by clicking the
                          Play-button
                        </span>
                      </div>
                    )}
                  </div>
                  {connectedMessage({ adbAutoConnect, device })}
                </div>
              </div>
            </div>
          </div>
          <div className={Styles.deviceActionWrapper}>
            <button
              // Only show an active link of the logs if there are logs
              className={`${Styles.link} ${Styles.detailsButton} ${
                log.length === 0 ? Styles.disabled : ''
              }`}
              onClick={() => toggleDeviceLogs({ descriptorId, showLogs })}
              type="button"
            >
              View logs
            </button>
            {sessionID && manualConnect && deviceConnected && (
              <button
                type="button"
                className={Styles.link}
                onClick={handleOpenManualTestModal}
              >
                Start Manual Test
              </button>
            )}
            <>
              <button
                className={`${Styles.detailsLink} ${Styles.detailsButton}`}
                onClick={handleDetailsDialog}
                type="button"
              >
                DETAILS
              </button>
              <DeviceDetailsModal
                deviceDetails={device}
                handleClose={handleDetailsDialog}
                open={isDetailsDialogOpen}
              />
            </>
          </div>
        </div>
      </div>
      {isManualTestModalOpen && (
        <OpenManualTestModal
          dc={dc}
          descriptorId={descriptorId}
          handleClose={handleOpenManualTestModal}
          platform={platform}
          portNumber={portNumber}
          sessionID={sessionID}
          status={status as DeviceSessionStatusEnum}
          tokenId={tokenId}
        />
      )}
      {showLogs && (
        <DeviceServerMonitor
          clearLogs={clearDeviceLogs}
          device={name}
          descriptorId={descriptorId}
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
