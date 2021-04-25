import { connect } from 'react-redux';
import Settings from './components/Settings';
import { getGenericStorage } from './duck/settings.storage';

function mapStateToProps(state) {
  return {
    androidVusbStatus: state.server.status,
    settingsData: getGenericStorage()
  };
}

export default connect(mapStateToProps)(Settings);
