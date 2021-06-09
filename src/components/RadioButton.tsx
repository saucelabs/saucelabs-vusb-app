import React from 'react';
import Styles from './RadioButton.module.css';

type RadioButtonType = {
  currentValue: string;
  disabled?: boolean;
  label: string;
  name: string;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const RadioButton: React.FC<RadioButtonType> = ({
  currentValue,
  disabled,
  label,
  name,
  onChange,
  value,
}) => {
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
};

export default RadioButton;
