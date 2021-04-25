// @flow
import React, { Component } from 'react';
import Styles from './RadioButton.styles.css';

type Props = {
  currentValue: string,
  disabled?: boolean,
  label: string,
  name: string,
  onChange: () => void,
  value: string
};

export default class RadioButton extends Component<Props> {
  props: Props;

  static defaultProps = {
    disabled: false
  };

  render() {
    const { currentValue, disabled, label, name, onChange, value } = this.props;

    return (
      <div className={Styles['radio-component']}>
        <label className={Styles.label} htmlFor={name}>
          <input
            type="radio"
            onChange={onChange}
            disabled={disabled}
            name={name}
            value={value}
            checked={value === currentValue}
            className={Styles.radio}
          />
          {label}
        </label>
      </div>
    );
  }
}
