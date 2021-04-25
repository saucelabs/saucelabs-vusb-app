// @flow
import React, { Component } from 'react';
import { remote, shell } from 'electron';
import Input from '../../components/Input';
import Styles from './Settings.styles.css';
import Switch from '../../components/Switch';
import FolderInput from '../../components/FolderInput';

type Props = {
  serverData: {
    adb_port_min: string,
    adb_port_range: string,
    auto_adb_connect: boolean,
    host: string,
    verbose_logs: boolean,
    logs_path: string,
    logs_to_file: boolean,
    port: string
  },
  onChange: () => void
};
const { dialog } = remote;

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["openChangelog"] }] */
export default class Server extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);

    this.folderInputRef = React.createRef();
    this.getLocalFilePath = this.getLocalFilePath.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
  }

  getLocalFilePath() {
    const { onChange } = this.props;
    const [dir] = dialog.showOpenDialogSync({ properties: ['openDirectory'] });

    if (dir) {
      // Dirty little hack to get the input value update so it is passed properly
      this.folderInputRef.current.value = dir;
      onChange({
        target: {
          name: 'logs_path',
          value: dir
        }
      });
    }
  }

  handleSwitch(event) {
    const { onChange } = this.props;

    onChange({
      target: {
        name: event.target.name,
        value: event.target.checked
      }
    });
  }

  openChangelog() {
    return shell.openExternal(
      'https://wiki.saucelabs.com/display/DOCS/Android+Virtual+USB+Changelog'
    );
  }

  render() {
    const { onChange, serverData } = this.props;
    const {
      auto_adb_connect,
      adb_port_min,
      adb_port_range,
      host,
      logs_to_file,
      logs_path,
      port,
      verbose_logs
    } = serverData;

    return (
      <div>
        <div className={Styles.container}>
          <div className={Styles['data-wrapper']}>
            <div className={Styles['form-group']}>
              <label className={Styles.label}>Verbose server logs</label>
              <Switch
                label={verbose_logs ? 'ON' : 'OFF'}
                onChange={this.handleSwitch}
                checked={verbose_logs}
                name="verbose_logs"
              />
            </div>
            <div className={Styles['form-group']}>
              <label className={Styles.label}>Write logs to file</label>
              <Switch
                label={logs_to_file ? 'ON' : 'OFF'}
                onChange={this.handleSwitch}
                checked={logs_to_file}
                name="logs_to_file"
              />
            </div>
            {logs_to_file && (
              <div className={Styles['form-group']}>
                <FolderInput
                  label="Logs file path"
                  onClick={this.getLocalFilePath}
                  value={logs_path}
                  name="logs_path"
                  reference={this.folderInputRef}
                  onChange={onChange}
                />
              </div>
            )}
            <div className={Styles['form-group']}>
              <Input
                label="vUSB-Server host"
                value={host}
                name="host"
                onChange={onChange}
              />
            </div>
            <div className={Styles['form-group']}>
              <Input
                label="vUSB-Server port"
                value={port}
                name="port"
                onChange={onChange}
              />
            </div>
            <div className={Styles['form-group']}>
              <label className={Styles.label}>Automatically connect ADB</label>
              <Switch
                label={auto_adb_connect ? 'ON' : 'OFF'}
                onChange={this.handleSwitch}
                checked={auto_adb_connect}
                name="auto_adb_connect"
              />
            </div>
            <div className={Styles['form-group']}>
              <Input
                label="vUSB-Server adb port"
                value={adb_port_min}
                name="adb_port_min"
                onChange={onChange}
              />
            </div>
            <div className={Styles['form-group']}>
              <Input
                label="vUSB-Server adb port range"
                value={adb_port_range}
                name="adb_port_range"
                onChange={onChange}
              />
            </div>
          </div>
          <div className={Styles['explain-wrapper']}>
            <div className={Styles.explain}>
              <span className={Styles.bold}>VERBOSE SERVER LOGS</span>
              <br />
              Dis/Enable verbose logging, default is <em>off</em>
            </div>
            <div className={Styles.explain}>
              <span className={Styles.bold}>WRITE LOGS TO FILE</span>
              <br />
              Dis/Enable writing the logs to a file, default <em>off</em>
              <br />
              This will write the server logs to{' '}
              <em>log-file-path/server.log</em> and the device-logs to{' '}
              <em>log-file-path/device-name.log</em>
            </div>
            {logs_to_file && (
              <div className={Styles.explain}>
                <span className={Styles.bold}>LOG-FILE path</span>
                <br />
                The path where the log files are written to.
              </div>
            )}
            <div className={Styles.explain}>
              <span className={Styles.bold}>VUSB-SERVER HOST</span>
              <br />
              The Virtual USB Host, the default is <em>http://127.0.0.1</em>
            </div>
            <div className={Styles.explain}>
              <span className={Styles.bold}>VUSB-SERVER PORT</span>
              <br />
              The Virtual USB Host, the default is <em>33657</em>
            </div>
            <div className={Styles.explain}>
              <span className={Styles.bold}>AUTOMATICALLY CONNECT ADB</span>
              <br />
              To use Android devices you manually need to connect the device to
              ADB. Enabling this option will do that automatically for you. You
              can find if the connection was successful in the device-logs and
              you can see all devices that are connected to ADB in the
              server-logs.
            </div>
            <div className={Styles.explain}>
              <span className={Styles.bold}>VUSB-SERVER ADB PORT</span>
              <br />
              The ADB Port that is given back to connect to the Android device
              in the cloud, the default is <em>7000</em>
            </div>
            <div className={Styles.explain}>
              <span className={Styles.bold}>VUSB-SERVER ADB PORT RANGE</span>
              <br />
              The range that is used together with the ADB Port if multiple
              devices are connected, the default is <em>100</em>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
