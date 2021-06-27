import React from 'react';
import { shell } from 'electron';
import Styles from './Requirements.module.css';
import { isMac, SYSTEM_CHECKS } from '../utils/Checks';
import Requirement from './components/Requirement';

const { ADB, ANDROID_HOME, JAVA_HOME, XCODE } = SYSTEM_CHECKS;
const androidCheck = ADB.check && ANDROID_HOME.check && JAVA_HOME.check;
const SYSTEM_CHECK = isMac() ? androidCheck && XCODE.check : androidCheck;

const Requirements: React.FC = () => {
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
  const colorClass = SYSTEM_CHECK
    ? 'accept'
    : !XCODE.isOSX && XCODE.label === 'XCODE'
    ? 'warning'
    : 'danger';

  return (
    <div className={Styles.container}>
      <div className={Styles.requirementsContainer}>
        <i
          className={`fas ${
            SYSTEM_CHECK ? 'fa-check' : 'fa-exclamation-triangle'
          } ${Styles.icon} ${Styles[colorClass]}`}
        />
        <div>
          <div className={Styles.header}>
            <span className={Styles.label}>Requirements checklist</span>
            {/* eslint-disable-next-line no-nested-ternary */}
            {SYSTEM_CHECK
              ? successMessage()
              : !SYSTEM_CHECK && XCODE.isOSX && XCODE.label === 'XCODE'
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
        </div>
      </div>
      <div className={Styles.bugContainer}>
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
  );
};

export default Requirements;
export { SYSTEM_CHECK };
