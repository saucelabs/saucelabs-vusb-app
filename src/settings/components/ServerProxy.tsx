import React from 'react';
import Input, { InputType } from '../../components/Input';
import Styles from './Settings.module.css';
import { ServerProxyInterface } from '../../store/StorageInterfaces';

type ServerProxyType = {
  proxyData: ServerProxyInterface;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
};

const ServerProxy: React.FC<ServerProxyType> = ({
  proxyData: { host, password, port, username },
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
          label="Port"
          value={(port as unknown) as string}
          name="port"
          onChange={onChange}
          type={InputType.NUMBER}
        />
        <span className={Styles.explain}>HTTP proxy port</span>
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
