// @flow
import React, {Component} from 'react';
import {openDeviceWindow} from '../../helpers/utils';
import Styles from './DeviceDetails.styles.css';
import DeviceServerMonitor from '../../monitor/DeviceServerMonitor';
import Switch from '../../components/Switch';
import {DEVICE_SESSION_STATUS} from '../duck/actions';
import {VUSB_SERVER_STATUS} from '../../monitor/duck/actions';
import DeviceDetailsModal from './DeviceDetailsModal';

type Props = {
  adbAutoConnect: boolean,
  androidError: boolean,
  clearDeviceLogs: () => void,
  closeSession: () => void,
  device: {},
  devicesChecked: boolean,
  iosError: boolean,
  launchTest: () => void,
  location: string,
  toggleDeviceLogs: () => void,
  tokenId: string,
  vusbStatus: string
};

export default class DeviceDetails extends Component<Props> {
  props: Props;

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };

    this.handleClickOpenDialog = this.handleClickOpenDialog.bind(this);
    this.handleClickCloseDialog = this.handleClickCloseDialog.bind(this);
    this.connectedMessage = this.connectedMessage.bind(this);
  }

  handleClickOpenDialog() {
    this.setState({open: true});
  }

  handleClickCloseDialog() {
    this.setState({open: false});
  }

  connectedMessage() {
    const {adbAutoConnect, device} = this.props;
    const {adbConnected, os, port, status} = device;
    const deviceConnected = status === DEVICE_SESSION_STATUS.CONNECTED;
    const isAndroid = os.toLowerCase() === 'android';
    const adbMessage = adbConnected
      ? `ADB connected to port: ${port}`
      : port
        ? `Connect to port: ${port}`
        : 'Waiting for port';

    return deviceConnected ? (
        isAndroid ? (
          <div>
            {adbAutoConnect && !adbConnected
              ? 'Auto connecting to ADB'
              : adbMessage}
          </div>
        ) : (
          // iOS
          ''
        )
      ) : // Do nothing
      null;
  }

  render() {
    const {
      androidError,
      clearDeviceLogs,
      closeSession,
      device,
      devicesChecked,
      iosError,
      launchTest,
      location,
      toggleDeviceLogs,
      tokenId,
      vusbStatus
    } = this.props;
    const {open} = this.state;
    const {
      error,
      id,
      // Means the device is not in the list of available devices
      // from the Sauce API
      isBusy,
      // Means the device is in use through live or automated tests
      // comes from the vUSB sessions response
      inUse,
      isPrivate,
      log,
      // Means the device has a vUSB session that has been started with `startSession`
      manualConnect,
      name,
      os,
      osVersion,
      resolutionHeight,
      resolutionWidth,
      screenSize,
      sessionID,
      showLogs,
      status
    } = device;
    const imgUrl = `https://d3ty40hendov17.cloudfront.net/device-pictures/${id}_optimised.png`;
    const isAndroid = os.toLowerCase() === 'android';
    const isIOS = !isAndroid;
    const platform = isAndroid ? 'Android' : 'iOS';
    const serverRunning = vusbStatus === VUSB_SERVER_STATUS.RUNNING;
    const isError = status === DEVICE_SESSION_STATUS.ERROR;
    const deviceConnecting = status === DEVICE_SESSION_STATUS.CONNECTING;
    const deviceConnected = status === DEVICE_SESSION_STATUS.CONNECTED;
    const deviceStopping = status === DEVICE_SESSION_STATUS.STOPPING;
    const switchLabel = isError
      ? 'ERROR'
      : deviceStopping
        ? 'STOPPING'
        : `CONNECT${deviceConnecting ? 'ING' : deviceConnected ? 'ED' : ''}`;
    const inCleaningProcess = isBusy && !inUse && status === DEVICE_SESSION_STATUS.STOPPED;

    return (
      <div>
        <div className={`${Styles.container}`}>
          {!inUse && isBusy && !inCleaningProcess && !deviceConnected && (
            <div className={`${Styles.badge} ${Styles.busy}`}>
              Busy
            </div>
          )}
          {inUse && isBusy && !inCleaningProcess && !deviceConnected && (
            <div className={`${Styles.badge} ${Styles.inUse}`}>
              Used for manual or automated session.
            </div>
          )}
          {inCleaningProcess && (
            <div className={`${Styles.badge} ${Styles.busy}`}>
              Cleaning<br/>device
            </div>
          )}
          {deviceConnected && (
            <div className={`${Styles.badge} ${Styles.busy}`}>
              Using vUSB
            </div>
          )}
          <div
            className={`${Styles['device-tile']} ${
              serverRunning &&
              devicesChecked &&
              // We should still be able to connect to the device
              // so don't disable it
              (!isBusy || inUse || manualConnect) &&
              !inCleaningProcess &&
              ((isAndroid && !androidError) || (isIOS && !iosError))
                ? ''
                : Styles.disabled
            } ${isError ? Styles.error : ''}`}
            id={id}
          >
            <div className={Styles.header}>
              {isPrivate ? (
                <span className={Styles['private-device-label']}>PRIVATE</span>
              ) : null}
              <span className={Styles.title}>{name}</span>
            </div>
            <div className={Styles.content}>
              <div className={Styles['image-wrapper']}>
                <img alt={name} src={imgUrl}/>
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
                    <a
                      onClick={this.handleClickOpenDialog}
                      className={Styles['details-link']}
                    >
                      Details
                    </a>
                    <DeviceDetailsModal
                      deviceDetails={device}
                      handleClose={this.handleClickCloseDialog}
                      open={open}
                    />
                  </div>
                </div>
                <div className={Styles['device-connection-wrapper']}>
                  <Switch
                    checked={deviceConnected || deviceStopping}
                    disabled={!serverRunning || deviceConnecting || deviceStopping}
                    error={isError}
                    label={switchLabel}
                    onChange={() =>
                      deviceConnected ? closeSession(id) : launchTest(id)
                    }
                  />
                  {this.connectedMessage()}
                </div>
              </div>
            </div>
            <div className={Styles['device-action-wrapper']}>
              <a className={`${Styles.link} ${log.length === 0 ? Styles.disabled : ''}`}
                 onClick={() => toggleDeviceLogs(id)}>
                View logs
              </a>
              {/*// Only show the live session button when it has been started as a manual session*/}
              {isBusy && !inCleaningProcess && (
                <a
                  className={`${Styles.link} ${
                    sessionID &&
                    deviceConnected &&
                    manualConnect && 
                    tokenId &&
                    !deviceStopping ?
                      '' :
                      Styles.disabled
                  }`}
                  onClick={() =>
                    openDeviceWindow(
                      {
                        dc:location.toLowerCase(),
                        deviceName: id,
                        tokenId,
                        sessionID,
                        platform,
                        closeSession,
                      }
                    )
                  }
                >
                  {/* When `inUse`, then there is already a live session started in Sauce Labs */}
                  {inUse ? 'Check the Sauce Labs UI' : 'Launch Live Test'}
                </a>
              )}
            </div>
          </div>
        </div>
        {showLogs && (
          <DeviceServerMonitor
            clearLogs={clearDeviceLogs}
            device={name}
            deviceID={id}
            logLines={log}
            platform={os}
            serverError={error}
            serverStatus={status}
            toggleDeviceLogs={toggleDeviceLogs}
          />
        )}
      </div>
    );
  }
}
