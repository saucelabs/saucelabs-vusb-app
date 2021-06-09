import React from 'react';
import Styles from './Switch.module.css';

type SwitchType = {
  checked: boolean;
  disabled?: boolean;
  error?: boolean;
  label: string;
  name?: string;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
};
const Switch: React.FC<SwitchType> = ({
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
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
            /* eslint-disable-next-line react/jsx-props-no-spreading */
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
