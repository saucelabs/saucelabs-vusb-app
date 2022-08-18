/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import Styles from './Input.module.css';

enum InputType {
  NUMBER = 'number',
  PASSWORD = 'password',
  TEXT = 'text',
  SEARCH = 'search',
}
interface InputInterface {
  disabled?: boolean;
  error?: boolean;
  label?: string;
  name: string;
  onBlur?: () => void;
  onChange?: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type: InputType;
  value: string;
}
const Input: React.FC<InputInterface> = ({
  disabled,
  error,
  label,
  name,
  onBlur,
  onChange,
  placeholder,
  type,
  value,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  const iconClass = `fa-eye${showPassword ? '' : '-slash'}`;

  return (
    <>
      <div>
        {label && <span className={Styles.label}>{label}</span>}
        <div className={`${Styles.inputContainer} ${error && Styles.error}`}>
          {type === InputType.SEARCH && (
            <i
              aria-label="Show password"
              className={`fas fa-search ${Styles.searchIcon}`}
              onClick={handleShowPassword}
              onKeyDown={handleShowPassword}
              role="button"
              tabIndex={0}
            />
          )}
          <input
            className={`${Styles.input} ${
              type === InputType.SEARCH ? Styles.searchInput : ''
            }`}
            disabled={disabled}
            id={name}
            name={name}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(onBlur && { onBlur })}
            onChange={onChange}
            placeholder={placeholder}
            type={
              showPassword || type === InputType.SEARCH ? InputType.TEXT : type
            }
            value={value}
          />
          {type === InputType.PASSWORD && (
            <i
              aria-label="Show password"
              className={`fas ${iconClass} ${Styles.showPassword}`}
              onClick={handleShowPassword}
              onKeyDown={handleShowPassword}
              role="button"
              tabIndex={0}
            />
          )}
        </div>
      </div>
    </>
  );
};

export { InputType };
export default Input;
