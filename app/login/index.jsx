import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Login from './components/Login';
import {authenticate, getUserInfo} from "./duck/api.operations";
import {getGenericStorage} from "../settings/duck/settings.storage";

function mapStateToProps(state) {
  return {
    androidVusbStatus: state.server.status,
    username: getGenericStorage().connection.username,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      authenticate: authenticate,
      getUserInfo: getUserInfo,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
