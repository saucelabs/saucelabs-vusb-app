import React from 'react';
import Styles from './SubmitButton.module.css';

type SubmitButtonInterface = {
  label: string;
  disabled?: boolean;
};

const SubmitButton: React.FC<SubmitButtonInterface> = ({ label, disabled }) => {
  return (
    <button disabled={disabled} className={Styles.button} type="submit">
      {label}
    </button>
  );
};

export default SubmitButton;
