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
    <div>
      <div className={Styles.container}>
        <div className={Styles['data-wrapper']}>
          <div className={Styles['form-group']}>
            <Input
              label="Host"
              value={host}
              name="host"
              onChange={onChange}
              type={InputType.TEXT}
            />
          </div>
          <div className={Styles['form-group']}>
            <Input
              label="Port"
              value={(port as unknown) as string}
              name="port"
              onChange={onChange}
              type={InputType.NUMBER}
            />
          </div>
          <div className={Styles['form-group']}>
            <Input
              label="Authorization Username"
              value={username}
              name="username"
              onChange={onChange}
              type={InputType.TEXT}
            />
          </div>
          <div className={Styles['form-group']}>
            <Input
              label="Authorization Password"
              value={password}
              name="password"
              onChange={onChange}
              type={InputType.PASSWORD}
            />
          </div>
        </div>
        <div className={Styles['explain-wrapper']}>
          <div className={Styles.explain}>
            <span className={Styles.bold}>HOST</span>
            <br />
            HTTP proxy host
          </div>
          <div className={Styles.explain}>
            <span className={Styles.bold}>PORT</span>
            <br />
            HTTP proxy port
          </div>
          <div className={Styles.explain}>
            <span className={Styles.bold}>AUTHORIZATION USERNAME</span>
            <br />
            HTTP proxy user
          </div>
          <div className={Styles.explain}>
            <span className={Styles.bold}>AUTHORIZATION PASSWORD</span>
            <br />
            HTTP proxy password
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerProxy;
