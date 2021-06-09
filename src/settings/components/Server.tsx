import React from 'react';
import Input from '../../components/Input';
import Styles from './Settings.module.css';
import Switch from '../../components/Switch';
import FolderInput from '../../components/FolderInput';

type ServerType = {
  serverData: {
    adbPortMin: string;
    adbPortRange: string;
    autoAdbConnect: boolean;
    host: string;
    logsPath: string;
    logsToFile: boolean;
    port: string;
    verboseLogs: boolean;
  };
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
};

const Server: React.FC<ServerType> = ({ serverData, onChange }) => {
  const {
    adbPortMin,
    adbPortRange,
    autoAdbConnect,
    host,
    logsToFile,
    logsPath,
    port,
    verboseLogs,
  } = serverData;
  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...event,
      target: {
        ...event.target,
        checked: event.target.checked,
        name: event.target.name,
      },
    });
  };

  return (
    <div>
      <div className={Styles.container}>
        <div className={Styles['data-wrapper']}>
          <div className={Styles['form-group']}>
            <span className={Styles.label}>Verbose server logs</span>
            <Switch
              label={verboseLogs ? 'ON' : 'OFF'}
              onChange={handleSwitch}
              checked={verboseLogs}
              name="verboseLogs"
            />
          </div>
          <div className={Styles['form-group']}>
            <span className={Styles.label}>Write logs to file</span>
            <Switch
              label={logsToFile ? 'ON' : 'OFF'}
              onChange={handleSwitch}
              checked={logsToFile}
              name="logsToFile"
            />
          </div>
          {logsToFile && (
            <div className={Styles['form-group']}>
              <FolderInput
                label="Logs file path"
                onChange={onChange}
                value={logsPath}
                name="logsPath"
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
            <span className={Styles.label}>Automatically connect ADB</span>
            <Switch
              label={autoAdbConnect ? 'ON' : 'OFF'}
              onChange={handleSwitch}
              checked={autoAdbConnect}
              name="autoAdbConnect"
            />
          </div>
          <div className={Styles['form-group']}>
            <Input
              label="vUSB-Server adb port"
              value={adbPortMin}
              name="adbPortMin"
              onChange={onChange}
            />
          </div>
          <div className={Styles['form-group']}>
            <Input
              label="vUSB-Server adb port range"
              value={adbPortRange}
              name="adbPortRange"
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
            This will write the server logs to <em>
              log-file-path/server.log
            </em>{' '}
            and the device-logs to <em>log-file-path/device-name.log</em>
          </div>
          {logsToFile && (
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
            can find if the connection was successful in the device-logs and you
            can see all devices that are connected to ADB in the server-logs.
          </div>
          <div className={Styles.explain}>
            <span className={Styles.bold}>VUSB-SERVER ADB PORT</span>
            <br />
            The ADB Port that is given back to connect to the Android device in
            the cloud, the default is <em>7000</em>
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
};

export default Server;
