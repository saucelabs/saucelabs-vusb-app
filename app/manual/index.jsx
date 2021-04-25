import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ManualScreen from './components/ManualScreen';
import {getGenericStorage} from "../settings/duck/settings.storage";

function mapStateToProps() {
  return {
    dataCenter: getGenericStorage().connection.location
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {},
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ManualScreen);
