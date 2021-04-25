// @flow
import React, { Component } from 'react';
import Styles from './Input.styles.css';

type Props = {
  disabled?: boolean,
  label?: string,
  name: string,
  onChange?: () => void,
  password?: boolean,
  placeholder?: string,
  value: string
};

export default class Input extends Component<Props> {
  props: Props;

  static defaultProps = {
    disabled: false,
    label: '',
    onChange: null,
    password: false,
    placeholder: ''
  };

  render() {
    const {
      disabled,
      label,
      name,
      onChange,
      password,
      placeholder,
      value
    } = this.props;

    return (
      <div>
        {label && (
          <label className={Styles.label} htmlFor={name}>
            {label}
          </label>
        )}
        <input
          className={Styles.input}
          defaultValue={value}
          disabled={disabled}
          id={name}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={password ? 'password' : 'text'}
        />
      </div>
    );
  }
}
