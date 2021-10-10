import React from 'react';
import Styles from './SubmitButton.module.css';

type SubmitButtonInterface = {
  disabled?: boolean;
  label: string;
  toolTip?: string;
};

const SubmitButton: React.FC<SubmitButtonInterface> = ({
  disabled,
  label,
  toolTip,
}) => {
  return (
    <>
      <button disabled={disabled} className={Styles.button} type="submit">
        {label}
      </button>
      {disabled && <div className={Styles.toolTip}>{toolTip}</div>}
    </>
  );
};

export default SubmitButton;
