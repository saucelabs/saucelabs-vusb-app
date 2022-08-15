import React from 'react';
import Styles from './Button.module.css';

type ButtonType = {
  disabled?: boolean;
  label: string;
  onClick?: () => void;
  toolTip?: string;
};

const Button: React.FC<ButtonType> = ({
  disabled,
  label,
  onClick,
  toolTip,
}) => {
  return (
    <>
      <button
        className={Styles.button}
        disabled={disabled}
        onClick={onClick}
        type="submit"
      >
        {label}
      </button>
      {disabled && toolTip && <div className={Styles.toolTip}>{toolTip}</div>}
    </>
  );
};

Button.defaultProps = {
  disabled: false,
  onClick: () => {},
  toolTip: '',
};

export default Button;
