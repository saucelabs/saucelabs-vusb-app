import React from 'react';
import { DeviceProxyType } from 'types/ElectronStoreTypes';
import Input, { InputType } from '../Input';
import Styles from './SettingsTab.module.css';

type DeviceProxyTabType = {
  proxyData: DeviceProxyType;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
};

const DeviceProxy: React.FC<DeviceProxyTabType> = ({
  proxyData: { host, password, port, username },
  onChange,
}) => {
  return (
    <>
      <span className={Styles.contentLabel}>Device Proxy</span>
      <div className={Styles.formGroup}>
        <Input
          label="Host"
          value={host}
          name="host"
          onChange={onChange}
          type={InputType.TEXT}
        />
        <span className={Styles.explain}>
          HTTP proxy host to be set on the device
        </span>
      </div>
      <div className={Styles.formGroup}>
        <Input
          label="Port"
          value={port as unknown as string}
          name="port"
          onChange={onChange}
          type={InputType.NUMBER}
        />
        <span className={Styles.explain}>
          HTTP proxy port to be set on the device
        </span>
      </div>
      <div className={Styles.formGroup}>
        <Input
          label="Authorization Username"
          value={username}
          name="username"
          onChange={onChange}
          type={InputType.TEXT}
        />
        <span className={Styles.explain}>
          HTTP proxy user to be set on the device
        </span>
      </div>
      <div className={Styles.formGroup}>
        <Input
          label="Authorization Password"
          value={password}
          name="password"
          onChange={onChange}
          type={InputType.PASSWORD}
        />
        <span className={Styles.explain}>
          HTTP proxy password to be set on the device
        </span>
      </div>
    </>
  );
};

export default DeviceProxy;
