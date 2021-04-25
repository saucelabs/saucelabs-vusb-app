// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ServerButtons from './ServerButtons';
import VusbServerMonitor from '../monitor/VusbServerMonitor';
import {startServer, stopServer} from '../monitor/duck/server.operations';
import {clearVusbServerLogs, toggleVusbServerMonitor} from '../monitor/duck/actions';
import Styles from './Header.styles.css';
import {ROUTES} from "../Routes";

type Props = {
  clearVusbServerLogs: () => void,
  logLines: [],
  showMonitor: boolean,
  startVusbServer: () => void,
  stopVusbServer: () => void,
  toggleVusbServerMonitor: () => void,
  vusbError: string,
  vusbStatus: string
};

class Header extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    const {history} = this.props;
    history.push(ROUTES.LOGIN);
  }

  render() {
    const {
      clearVusbServerLogs,
      logLines,
      showMonitor,
      startVusbServer,
      stopVusbServer,
      toggleVusbServerMonitor,
      vusbError,
      vusbStatus
    } = this.props;

    return (
      <div className={Styles.container}>
        <div className={Styles.separator}/>
        <div className={Styles['logout-container']} onClick={this.logOut}>
            <span className={Styles['logout-label']}>Log out</span>
            <i className={`${Styles.icon} fas fa-sign-out-alt`}/>
        </div>
        <div className={Styles.separator}/>
        <div className={Styles['button-container']}>
          <ServerButtons
            serverError={vusbError}
            serverStatus={vusbStatus}
            startVusbServer={startVusbServer}
            stopVusbServer={stopVusbServer}
            toggleVusbServerMonitor={toggleVusbServerMonitor}
          />
        </div>
        {showMonitor && (
          <VusbServerMonitor
            clearLogs={clearVusbServerLogs}
            logLines={logLines}
            serverError={vusbError}
            serverStatus={vusbStatus}
            startVusbServer={startVusbServer}
            stopVusbServer={stopVusbServer}
            toggleVusbServerMonitor={toggleVusbServerMonitor}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    logLines: state.server.log,
    showMonitor: state.server.showMonitor,
    vusbError: state.server.error,
    vusbStatus: state.server.status
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearVusbServerLogs,
      startVusbServer: startServer,
      stopVusbServer: stopServer,
      toggleVusbServerMonitor
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
