import React from 'react';
import { shell } from 'electron';
import Styles from './Requirements.module.css';
import Requirement from './components/Requirement';
import { isSystemOperational, SYSTEM_CHECKS } from '../utils/Checks';
import CloseIconButton from '../components/buttons/CloseIconButton';
import Header from '../components/Header';

const Requirements: React.FC = () => {
  const { XCODE } = SYSTEM_CHECKS;
  const errorMessage = () => (
    <span className={`${Styles.subLabel} ${Styles.danger}`}>
      One or more required dependencies are missing!
      <button
        type="button"
        className={Styles.link}
        onClick={() =>
          shell.openExternal(
            'https://github.com/saucelabs/saucelabs-vusb-app#prerequisites'
          )
        }
      >
        <span className={Styles.bugText}>More information.</span>
      </button>
    </span>
  );
  const successMessage = () => (
    <span className={`${Styles.subLabel} ${Styles.accept}`}>
      All systems are a go!
    </span>
  );
  const warningMessage = () => (
    <span className={`${Styles.subLabel} ${Styles.warning}`}>
      {XCODE.message}
    </span>
  );
  // eslint-disable-next-line no-nested-ternary
  const colorClass = isSystemOperational()
    ? 'accept'
    : !XCODE.isOSX && XCODE.label === 'XCODE'
    ? 'warning'
    : 'danger';

  return (
    <div className={Styles.container}>
      <Header
        title="Requirements"
        headerComponents={[<CloseIconButton key="CloseIconButton" />]}
      />
      <div className={Styles.mainRequirementsContainer}>
        <div className={Styles.requirementsContainer}>
          <i
            className={`fas ${
              isSystemOperational() ? 'fa-check' : 'fa-exclamation-triangle'
            } ${Styles.icon} ${Styles[colorClass]}`}
          />
          <div>
            <div className={Styles.header}>
              <span className={Styles.label}>Requirements checklist</span>
              {/* eslint-disable-next-line no-nested-ternary */}
              {isSystemOperational()
                ? successMessage()
                : !isSystemOperational && XCODE.isOSX && XCODE.label === 'XCODE'
                ? errorMessage()
                : warningMessage()}
            </div>
            {Object.values(SYSTEM_CHECKS).map(
              ({ check, isOSX, label, message, name }) => {
                return (
                  <Requirement
                    check={check}
                    isOSX={isOSX}
                    key={name}
                    label={label}
                    message={message}
                  />
                );
              }
            )}
            <div
              className={`${Styles.bugContainer} ${Styles.requirementContainer}`}
            >
              <button
                type="button"
                className={Styles.link}
                onClick={() =>
                  shell.openExternal(
                    'https://github.com/saucelabs/saucelabs-vusb-app/issues/'
                  )
                }
              >
                <i className="fa fa-bug" />
                <span className={Styles.bugText}>Report an issue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requirements;