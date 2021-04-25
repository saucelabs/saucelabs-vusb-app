// @flow
import React, { Component } from 'react';
import Input from '../../components/Input';
import RadioButton from '../../components/RadioButton';
import Styles from './Settings.styles.css';
import { LOCATION } from '../../helpers/constants';

type Props = {
  connectionData: {
    access_key: string,
    username: string,
    location: string
  },
  onChange: () => void
};

export default class Connection extends Component<Props> {
  props: Props;

  render() {
    const { connectionData, onChange } = this.props;
    const { access_key, location, username } = connectionData;

    return (
      <div>
        <div className={Styles.container}>
          <div className={Styles['data-wrapper']}>
            <div className={Styles['form-group']}>
              <Input
                label="Sauce Labs Username"
                value={username}
                name="username"
                disabled
              />
            </div>
            <div className={Styles['form-group']}>
              <Input
                label="Access Key"
                value={access_key}
                name="access_key"
                disabled
              />
            </div>
            <div className={Styles['form-group']}>
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
                https://saucelabs.com &gt; Account &gt; User Settings &gt;
                Access Key
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
