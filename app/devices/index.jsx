import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {getGenericStorage} from '../settings/duck/settings.storage';
import DevicesOverview from './components/DevicesOverview';
import {getActiveDevices, getAvailableDevices, getDevices} from './duck/api.operations';
import {
  clearDeviceLogs,
  searchDevices,
  setTunnelIdentifier,
  toggleDeviceLogs
} from './duck/actions';
import {
  closeDeviceSession,
  startDeviceSession
} from './duck/device.operations';

function mapStateToProps(state) {
  return {
    apiStatus: state.deviceApi.status,
    apiError: state.deviceApi.error,
    connectedDevices: state.deviceApi.connectedDevices,
    devices: state.deviceApi.queryResults,
    devicesChecked: state.deviceApi.devicesChecked,
    deviceQuery: state.deviceApi.deviceQuery,
    adbAutoConnect: getGenericStorage().server.auto_adb_connect,
    tokenId: state.authentication.tokenId,
    vusbStatus: state.server.status
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearDeviceLogs: clearDeviceLogs,
      closeDeviceSession: closeDeviceSession,
      fetchDevices: getDevices,
      fetchAvailableDevices: getAvailableDevices,
      fetchSessions: getActiveDevices,
      startDeviceSession: startDeviceSession,
      searchDevices: searchDevices,
      setTunnelIdentifier: setTunnelIdentifier,
      toggleDeviceLogs: toggleDeviceLogs
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicesOverview);
