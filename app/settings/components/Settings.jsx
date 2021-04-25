import React, {Component} from 'react';
import Styles from './SettingsPage.styles.css';
import {setGenericStorage} from '../duck/settings.storage';
import Tabs from '../../components/Tabs';
import Button from '../../components/Button';
import Connection from './Connection';
import ServerProxy from './ServerProxy';
import Server from './Server';
import {VUSB_SERVER_STATUS} from '../../monitor/duck/actions';
import Notification, {NOTIFICATIONS} from '../../components/Notification';
import DeviceProxy from "./DeviceProxy";

type Props = {
  androidVusbStatus: string,
  settingsData: {
    connection: {
      access_key: string,
      username: string,
      location: string,
    },
    proxy: {
      host: string,
      port: string,
      username: string,
      password: string
    },
    server: {
      adb_port_min: string,
      adb_port_range: string,
      auto_adb_connect: string,
      host: string,
      verbose_logs: boolean,
      logs_path: string,
      log_to_file: string,
      port: string,
      version: string
    },
    device: {
      proxy: {
        host: string,
        port: string,
        username: string,
        password: string
      }
    }
  }
};

export default class Settings extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    const {settingsData} = props;

    this.state = {
      dataIsStored: false,
      ...settingsData,
    };
    this.handleGenericSubmit = this.handleGenericSubmit.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
    this.handleProxyChange = this.handleProxyChange.bind(this);
  }

  handleGenericSubmit(event) {
    event.preventDefault();

    const {androidVusbStatus} = this.props;

    if (
      androidVusbStatus !== VUSB_SERVER_STATUS.IDLE &&
      androidVusbStatus !== VUSB_SERVER_STATUS.STOPPED &&
      androidVusbStatus !== VUSB_SERVER_STATUS.ERROR
    ) {
      alert(
        'There is still a Virtual USB server running, please stop it before changing the settings'
      );
    } else {

      setGenericStorage({
        connection:{
          ...this.state.connection,
        },
        proxy: {
          ...this.state.proxy,
        },
        server: {
          ...this.state.server
        },
        device: {
          proxy: {
            ...this.state.device.proxy
          },
        }
      });

      this.setState({
        dataIsStored: true
      });
      this.closeNotification = setTimeout(() => {
        this.setState({
          dataIsStored: false
        });
      }, 3000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.closeNotification);
  }

  handleConnectionChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      connection: {
        ...this.state.connection,
        ...{[name]: value},
      }
    });
  };

  handleServerChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      server: {
        ...this.state.server,
        ...{[name]: value}
      }
    });
  };

  handleProxyChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      proxy: {
        ...this.state.proxy,
        ...{[name]: value}
      }
    });
  };

  handleDeviceProxyChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      device: {
        proxy: {
          ...this.state.device.proxy,
          ...{[name]: value}
        }
      }
    });
  };

  render() {
    const {connection, dataIsStored, device, proxy, server} = this.state;

    return (
      <div className={Styles.container}>
        <span className={Styles.title}>Settings</span>

        <form onSubmit={this.handleGenericSubmit}>
          {dataIsStored && (
            <Notification type={NOTIFICATIONS.INFO} floatingCenter>
              Data has been stored
            </Notification>
          )}
          <Tabs>
            <div label='Connection' iconClass='fa-link'>
              <Connection
                connectionData={connection}
                onChange={this.handleConnectionChange}
              />
            </div>
            <div label='Server' iconClass='fa-server'>
              <Server
                serverData={server}
                onChange={this.handleServerChange}
              />
            </div>
            <div label='Server Proxy' iconClass='fa-server'>
              <ServerProxy
                proxyData={proxy}
                onChange={this.handleProxyChange}
              />
            </div>
            <div label='Device Proxy' iconClass='fa-mobile-alt'>
              <DeviceProxy
                proxyData={device.proxy}
                onChange={this.handleDeviceProxyChange}
              />
            </div>
          </Tabs>
          <div className={Styles['button-container']}>
            <Button label="Update"/>
          </div>
        </form>
      </div>
    );
  }
}
