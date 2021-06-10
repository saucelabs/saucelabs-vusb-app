import React, { useState } from 'react';
import Styles from './Input.module.css';

enum InputType {
  NUMBER = 'number',
  PASSWORD = 'password',
  TEXT = 'text',
}
interface InputInterface {
  disabled?: boolean;
  label?: string;
  name: string;
  onChange?: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type: InputType;
  value: string;
}
const Input: React.FC<InputInterface> = ({
  disabled,
  label,
  name,
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
        <div className={Styles.inputContainer}>
          <input
            className={Styles.input}
            disabled={disabled}
            id={name}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            type={showPassword ? InputType.TEXT : type}
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
