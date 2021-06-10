import React from 'react';
import Styles from './Switch.module.css';

interface SwitchInterface {
  checked: boolean;
  disabled?: boolean;
  error?: boolean;
  label: string;
  name?: string;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
}

const Switch: React.FC<SwitchInterface> = ({
  checked,
  disabled,
  error,
  label,
  name,
  onChange,
}) => {
  return (
    <>
      <div>
        <label
          className={`${Styles['switch-container']} ${
            disabled ? Styles.disabled : ''
          } ${checked ? Styles.checked : ''} ${error ? Styles.error : ''}`}
          htmlFor={name}
        >
          <input
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className={Styles['switch-checkbox']}
            type="checkbox"
            {...(name ? { name } : {})}
          />
          <span className={Styles['switch-button']} />
          <span
            className={`${Styles['switch-label']} ${
              disabled ? Styles['switch-label-disabled'] : ''
            }`}
          >
            {label}
          </span>
        </label>
      </div>
    </>
  );
};

export default Switch;
