import React from 'react';
import Input from '../../components/Input';
import RadioButton from '../../components/RadioButton';
import Styles from './Settings.module.css';
import { LOCATION } from '../../utils/Constants';

type ConnectionType = {
  connectionData: {
    accessKey: string;
    username: string;
    location: string;
  };
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
};

const Connection: React.FC<ConnectionType> = ({
  connectionData: { accessKey, username, location },
  onChange,
}) => {
  return (
    <div>
      <div className={Styles.container}>
        <div className={Styles['data-wrapper']}>
          <div className={Styles['form-group']}>
            <Input
              label="Sauce Labs Username"
              value={username}
              name="username"
              onChange={onChange}
            />
          </div>
          <div className={Styles['form-group']}>
            <Input
              label="Access Key"
              value={accessKey}
              name="accessKey"
              onChange={onChange}
            />
          </div>
          <div className={Styles['form-group']}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className={Styles.label}>Data Center</label>
            <RadioButton
              label={LOCATION.EU.label}
              value={LOCATION.EU.value}
              name="location"
              currentValue={location}
              onChange={onChange}
            />
            <RadioButton
              label={LOCATION.US.label}
              value={LOCATION.US.value}
              name="location"
              currentValue={location}
              onChange={onChange}
            />
          </div>
        </div>
        <div className={Styles['explain-wrapper']}>
          <div className={Styles.explain}>
            <br />
            This should be equal to your <em>SAUCE LABS USERNAME</em> in
            <pre>
              https://saucelabs.com &gt; Account &gt; User Settings &gt;
              Username
            </pre>
            <br />
            <br />
            This should be equal to your <em>ACCESS KEY</em> in
            <pre>
              https://saucelabs.com &gt; Account &gt; User Settings &gt; Access
              Key
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connection;