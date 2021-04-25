// @flow
import React, {Component} from 'react';
import Styles from './DevicesOverview.styles.css';
import DeviceDetails from './DeviceDetails';
import {Link, Redirect} from 'react-router-dom';
import {API_STATUS} from '../duck/actions';
import {ROUTES} from '../../Routes';
import Input from '../../components/Input';
import Notification, {NOTIFICATIONS} from '../../components/Notification';
import {isAndroidError, isIOSError} from "../../helpers/checks";
import {getGenericStorage} from "../../settings/duck/settings.storage";

type Props = {
  devicesChecked: boolean,
  location: string,
  // API
  apiStatus: string,
  apiError: string,
  connectedDevices: [],
  devices: [],
  fetchDevices: () => [],
  // Vusb-server
  vusbStatus: string,
  // Device
  clearDeviceLogs: () => void,
  closeDeviceSession: () => void,
  deviceStatus: string,
  deviceQuery: string,
  fetchAvailableDevices: () => void,
  getDeviceSessions: () => void,
  fetchSessions: () => void,
  sessionID: string,
  searchDevices: () => void,
  setTunnelIdentifier: () => void,
  startDeviceSession: () => void,
  toggleDeviceLogs: () => void,
  tokenId: string,
};

export default class DevicesOverview extends Component<Props> {
  props: Props;

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.handleDeviceSelection = this.handleDeviceSelection.bind(this);
    this.handleDeviceSearch = this.handleDeviceSearch.bind(this);
    this.handleSetTunnelIdentifier = this.handleSetTunnelIdentifier.bind(this);
    const {server} = getGenericStorage();
    this.server = server;
  }

  async componentDidMount() {
    const {
      connectedDevices,
      fetchDevices,
      fetchSessions,
      fetchAvailableDevices
    } = this.props;
      // Only fetch when there is no connected device,
      // otherwise it will reset everything and we loose
      // all information from the connected device when
      // we switch from the device catalog to for example
      // the settings and back
      if (connectedDevices.length === 0) {
        await fetchDevices();
      }

      this.fetchSessions = setInterval(() => fetchSessions(), 5000);
      this.fetchAvailableDevices = setInterval(() => fetchAvailableDevices(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchSessions);
    clearInterval(this.fetchAvailableDevices);
  }

  handleDeviceSelection(id) {
    const {startDeviceSession} = this.props;
    startDeviceSession(id);
  }

  handleDeviceSearch(e) {
    this.props.searchDevices(e.target.value.trim());
  }

  handleSetTunnelIdentifier(e) {
    this.props.setTunnelIdentifier(e.target.value.trim());
  }

  render() {
    const {
      clearDeviceLogs,
      closeDeviceSession,
      devices,
      devicesChecked,
      deviceQuery,
      adbAutoConnect,
      startDeviceSession,
      apiStatus,
      apiError,
      toggleDeviceLogs,
      tokenId,
      vusbStatus
    } = this.props;
    const platformErrorMessage = isAndroidError() && isIOSError() ? 'Android and iOS' : isAndroidError() ? 'Android' : 'iOS';
    const hasHave = isAndroidError() && isIOSError() ? 'have' : 'has';
    // const isUnauthorized = false;
    const isUnauthorized = apiError && apiError.message.includes('code 401');

    return (
      isUnauthorized
        ? (
          <Redirect to={ROUTES.LOGIN}/>
        )
        : (
          <div className={Styles.container}>
            {(isAndroidError() || isIOSError()) && (
              <Notification type={NOTIFICATIONS.WARNING} floatingCenter>
                Your {platformErrorMessage} environment {hasHave} <strong>NOT</strong> been set up properly, please check
                the{' '} <Link to={ROUTES.HOME}>Home</Link> page to see what needs to be fixed.
              </Notification>
            )}
            <span className={Styles.title}>Device Catalog</span>
            {apiStatus === API_STATUS.LOADING ? (
              <div>Loading devices....</div>
            ) : apiStatus === API_STATUS.ERROR ? (
              <Notification type={NOTIFICATIONS.ERROR}>
                There was an error retrieving the devices, please see below for more
                information.
                <pre>{apiError.message}</pre>
              </Notification>
            ) : Object.entries(devices).length === 0 && deviceQuery === '' ? (
              <Notification type={NOTIFICATIONS.WARNING}>
                No devices could be found. Reasons for this could be that you don't have private devices, please contact
                your Customer Success Manager at Sauce Labs
              </Notification>
            ) : (
              <div>
                <div className={Styles['flex-container']}>
                  <div className={Styles['flex-1-2']}>
                    <div className={Styles['search-box']}>
                      <Input
                        onChange={this.handleDeviceSearch}
                        label="Search devices"
                      />
                    </div>
                  </div>
                  <div className={Styles['flex-1-2']}>
                    <div className={Styles['tunnel-identifier']}>
                      <Input
                        onChange={this.handleSetTunnelIdentifier}
                        label='Tunnel Identifier'
                        placeholder="Will be used for when a vUSB connection is established."
                      />
                    </div>
                  </div>
                </div>
                <div className={Styles.text}>
                  <p>
                    Please select your device. Can't find your device listed?
                    Contact your Customer Success Manager.
                  </p>
                </div>
                <div className={Styles['devices-wrapper']}>
                  {Object.entries(devices).length === 0 ? (
                    <Notification type={NOTIFICATIONS.WARNING}>
                      <p>No matching devices found</p>
                    </Notification>
                  ) : (
                    Object.values(devices).map(device => (
                      <DeviceDetails
                        adbAutoConnect={adbAutoConnect}
                        androidError={isAndroidError()}
                        clearDeviceLogs={clearDeviceLogs}
                        closeSession={closeDeviceSession}
                        device={device}
                        devicesChecked={devicesChecked}
                        iosError={isIOSError()}
                        key={device.id}
                        location={device.location.toUpperCase()}
                        launchTest={startDeviceSession}
                        toggleDeviceLogs={toggleDeviceLogs}
                        tokenId={tokenId}
                        vusbStatus={vusbStatus}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )
    );
  }
}
