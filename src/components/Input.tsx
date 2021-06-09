import React from 'react';
import Styles from './Input.module.css';

type InputType = {
  disabled?: boolean;
  label?: string;
  name: string;
  onChange?: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  password?: boolean;
  placeholder?: string;
  value: string;
};
const Input: React.FC<InputType> = ({
  disabled,
  label,
  name,
  onChange,
  password,
  placeholder,
  value,
}) => {
  return (
    <>
      <div>
        {label && (
          <label className={Styles.label} htmlFor={name}>
            {label}
          </label>
        )}
        <input
          className={Styles.input}
          disabled={disabled}
          id={name}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={password ? 'password' : 'text'}
          value={value}
        />
      </div>
    </>
  );
};

export default Input;
