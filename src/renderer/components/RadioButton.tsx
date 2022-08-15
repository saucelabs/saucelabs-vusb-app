/* eslint-disable react/require-default-props */
import React from 'react';
import Styles from './RadioButton.module.css';

interface RadioButtonInterface {
  currentValue: string;
  disabled?: boolean;
  label: string;
  name: string;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const RadioButton: React.FC<RadioButtonInterface> = ({
  currentValue,
  disabled = false,
  label,
  name,
  onChange,
  value,
}) => {
  return (
    <div className={Styles['radio-component']}>
      <span className={Styles.label}>
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
      </span>
    </div>
  );
};

export default RadioButton;
