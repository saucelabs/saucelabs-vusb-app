import React from 'react';
import Styles from './SettingsTab.module.css';
import { LOCATION } from '../../utils/Constants';
import Input, { InputType } from '../Input';
import RadioButton from '../RadioButton';
import { ConnectionType } from '../../../types/ElectronStoreTypes';

type ConnectionTabType = {
  connectionData: ConnectionType;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
};

const ConnectionTab: React.FC<ConnectionTabType> = ({
  connectionData: { accessKey, username, location },
  onChange,
}) => {
  return (
    <>
      <span className={Styles.contentLabel}>Connection</span>
      <div className={Styles.formGroup}>
        <Input
          label="Sauce Labs Username"
          value={username}
          name="username"
          onChange={onChange}
          type={InputType.TEXT}
        />
        <span className={Styles.explain}>
          This should be equal to your <em>SAUCE LABS USERNAME</em> in
          <pre>
            https://accounts.saucelabs.com &gt; Account &gt; User Settings &gt;
            Username
          </pre>
        </span>
      </div>
      <div className={Styles.formGroup}>
        <Input
          label="Access Key"
          value={accessKey}
          name="accessKey"
          onChange={onChange}
          type={InputType.PASSWORD}
        />
        <span className={Styles.explain}>
          This should be equal to your <em>ACCESS KEY</em> in
          <pre>
            https://accounts.saucelabs.com &gt; Account &gt; User Settings &gt;
            Access Key
          </pre>
        </span>
      </div>
      <div className={Styles.formGroup}>
        <span className={Styles.label}>Data Center</span>
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
        <span className={Styles.explain}>The data center you want to use.</span>
      </div>
    </>
  );
};

export default ConnectionTab;
