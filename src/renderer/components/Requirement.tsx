/* eslint-disable react/require-default-props */
import React from 'react';
import Styles from './Requirement.module.css';

const Requirement: React.FC<{
  check: boolean;
  isOSX?: boolean;
  label: string;
  message: string;
}> = ({ check, isOSX = false, label, message }) => {
  const checkIcon = check ? 'fa-check' : 'fa-exclamation-triangle';
  // eslint-disable-next-line no-nested-ternary
  const colorClass = check
    ? 'accept'
    : !isOSX && label === 'XCODE'
    ? 'warning'
    : 'danger';

  return (
    <div className={Styles.requirementContainer}>
      <i className={`fas ${checkIcon} ${Styles.icon} ${Styles[colorClass]}`} />
      <div>
        <div className={Styles.requirementLabelStatusContainer}>
          <span className={Styles.requirementLabel}>{label}</span>
          <span className={Styles.dots} />
          <span className={`${Styles.requirementStatus} ${Styles[colorClass]}`}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {check
              ? 'Complete'
              : !isOSX && label === 'XCODE'
              ? 'Warning'
              : 'Error'}
          </span>
        </div>
        <div
          className={`${Styles.technicalDetails} ${
            !check ? Styles[colorClass] : ''
          }`}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default Requirement;
