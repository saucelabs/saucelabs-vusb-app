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
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        className={`${Styles.switchContainer} ${
          disabled ? Styles.disabled : ''
        } ${checked ? Styles.checked : ''} ${error ? Styles.error : ''}`}
      >
        <input
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          className={Styles.switchCheckbox}
          type="checkbox"
          {...(name ? { name } : {})}
        />
        <span className={Styles.switchButton} />
        <span
          className={`${Styles.switchLabel} ${
            disabled ? Styles.switchLabelDisabled : ''
          }`}
        >
          {label}
        </span>
      </label>
    </>
  );
};

export default Switch;
