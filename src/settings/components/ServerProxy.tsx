import React from 'react';
import Input from '../../components/Input';
import Styles from './Settings.module.css';

type ServerProxyType = {
  proxyData: {
    host: string;
    password: string;
    port: string;
    username: string;
  };
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
            <Input label="Host" value={host} name="host" onChange={onChange} />
          </div>
          <div className={Styles['form-group']}>
            <Input label="Port" value={port} name="port" onChange={onChange} />
          </div>
          <div className={Styles['form-group']}>
            <Input
              label="Authorization Username"
              value={username}
              name="username"
              onChange={onChange}
            />
          </div>
          <div className={Styles['form-group']}>
            <Input
              label="Authorization Password"
              value={password}
              name="password"
              password
              onChange={onChange}
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
