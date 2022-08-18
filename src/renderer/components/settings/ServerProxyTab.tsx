import React from 'react';
import { ServerProxyType } from 'types/ElectronStoreTypes';
import Input, { InputType } from '../Input';
import Styles from './SettingsTab.module.css';

type ServerProxyTabType = {
  proxyData: ServerProxyType;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
};

const ServerProxy: React.FC<ServerProxyTabType> = ({
  proxyData: { host, password, portNumber, username },
  onChange,
}) => {
  return (
    <>
      <span className={Styles.contentLabel}>Server Proxy</span>
      <div className={Styles.formGroup}>
        <Input
          label="Host"
          value={host}
          name="host"
          onChange={onChange}
          type={InputType.TEXT}
        />
        <span className={Styles.explain}>HTTP proxy host</span>
      </div>
      <div className={Styles.formGroup}>
        <Input
          label="Port Number"
          value={portNumber as unknown as string}
          name="portNumber"
          onChange={onChange}
          type={InputType.NUMBER}
        />
        <span className={Styles.explain}>HTTP proxy port number</span>
      </div>
      <div className={Styles.formGroup}>
        <Input
          label="Authorization Username"
          value={username}
          name="username"
          onChange={onChange}
          type={InputType.TEXT}
        />
        <span className={Styles.explain}>HTTP proxy user</span>
      </div>
      <div className={Styles.formGroup}>
        <Input
          label="Authorization Password"
          value={password}
          name="password"
          onChange={onChange}
          type={InputType.PASSWORD}
        />
        <span className={Styles.explain}>HTTP proxy password</span>
      </div>
    </>
  );
};

export default ServerProxy;
