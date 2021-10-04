import React from 'react';
import Input, { InputType } from '../../components/Input';
import Styles from './Settings.module.css';
import Switch from '../../components/Switch';
import FolderInput from '../../components/FolderInput';
import { ServerInterface } from '../../store/StorageInterfaces';

type ServerType = {
  serverData: ServerInterface;
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
    <>
      <span className={Styles.contentLabel}>Server</span>
      <div className={Styles.formGroup}>
        <span className={Styles.label}>Verbose server logs</span>
        <Switch
          label={verboseLogs ? 'ON' : 'OFF'}
          onChange={handleSwitch}
          checked={verboseLogs}
          name="verboseLogs"
        />
        <span className={Styles.explain}>
          Dis/Enable verbose logging, default is <em>off</em>
        </span>
      </div>
      <div className={Styles.formGroup}>
        <span className={Styles.label}>Write logs to file</span>
        <Switch
          label={logsToFile ? 'ON' : 'OFF'}
          onChange={handleSwitch}
          checked={logsToFile}
          name="logsToFile"
        />
        <span className={Styles.explain}>
          Dis/Enable writing the logs to a file, default <em>off</em>
        </span>
        <span className={Styles.explain}>
          This will write the server logs to <em> log-file-path/server.log </em>{' '}
          and the device-logs to <em>log-file-path/device-name.log</em>
        </span>
      </div>
      {logsToFile && (
        <div className={Styles.formGroup}>
          <FolderInput
            label="Logs file path"
            onChange={onChange}
            value={logsPath}
            name="logsPath"
          />
          <span className={Styles.explain}>
            The path where the log files are written to.
          </span>
        </div>
      )}
      <div className={Styles.formGroup}>
        <Input
          label="vUSB-Server host"
          value={host}
          name="host"
          onChange={onChange}
          type={InputType.TEXT}
        />
        <span className={Styles.explain}>
          The Virtual USB Host, the default is <em>http://127.0.0.1</em>
        </span>
      </div>
      <div className={Styles.formGroup}>
        <Input
          label="vUSB-Server port"
          value={(port as unknown) as string}
          name="port"
          onChange={onChange}
          type={InputType.NUMBER}
        />
        <span className={Styles.explain}>
          The Virtual USB Host, the default is <em>33657</em>
        </span>
      </div>
      <div className={Styles.formGroup}>
        <span className={Styles.label}>Automatically connect ADB</span>
        <Switch
          label={autoAdbConnect ? 'ON' : 'OFF'}
          onChange={handleSwitch}
          checked={autoAdbConnect}
          name="autoAdbConnect"
        />
        <span className={Styles.explain}>
          To use Android devices you manually need to connect the device to ADB.
          Enabling this option will do that automatically for you. You can find
          if the connection was successful in the device-logs and you can see
          all devices that are connected to ADB in the server-logs, the default
          is <em>ON</em>
        </span>
      </div>
      <div className={Styles.formGroup}>
        <Input
          label="vUSB-Server adb port"
          value={(adbPortMin as unknown) as string}
          name="adbPortMin"
          onChange={onChange}
          type={InputType.NUMBER}
        />
        <span className={Styles.explain}>
          The ADB Port that is given back to connect to the Android device in
          the cloud, the default is <em>7000</em>
        </span>
      </div>
      <div className={Styles.formGroup}>
        <Input
          label="vUSB-Server adb port range"
          value={(adbPortRange as unknown) as string}
          name="adbPortRange"
          onChange={onChange}
          type={InputType.NUMBER}
        />
        <span className={Styles.explain}>
          The range that is used together with the ADB Port if multiple devices
          are connected, the default is <em>100</em>
        </span>
      </div>
    </>
  );
};

export default Server;
