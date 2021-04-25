// @flow
import React, { Component } from 'react';
import Styles from './Switch.styles.css';

type Props = {
  checked: boolean,
  disabled?: boolean,
  error?: boolean,
  label: string,
  name?: string,
  onChange: () => void
};

export default class Switch extends Component<Props> {
  props: Props;

  static defaultProps = {
    disabled: false,
    error: false,
    name: null
  };

  render() {
    const { checked, disabled, error, label, name, onChange } = this.props;
    return (
      <div>
        <label
          className={`${Styles['switch-container']} ${
            disabled ? Styles.disabled : ''
          } ${checked ? Styles.checked : ''} ${error ? Styles.error : ''}`}
        >
          <input
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className={Styles['switch-checkbox']}
            type="checkbox"
            {...(name ? { name: name } : {})}
          />
          <span className={Styles['switch-button']} />
          <span className={Styles['switch-label']}>{label}</span>
        </label>
      </div>
    );
  }
}
