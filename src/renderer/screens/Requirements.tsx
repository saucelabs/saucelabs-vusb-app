import React, { useContext } from 'react';
import { StoreContext } from 'renderer/Store';
import { Link } from 'react-router-dom';
import { ROUTES } from 'renderer/utils/Constants';
import Styles from './Requirements.module.css';
import Requirement from '../components/Requirement';
import CloseIconButton from '../components/buttons/CloseIconButton';
import Header from '../components/Header';

const Requirements: React.FC = () => {
  const {
    state: {
      systemChecks: { isSystemOperational, systemChecks },
    },
  } = useContext(StoreContext);
  const { XCODE } = systemChecks;
  const errorMessage = () => (
    <span className={`${Styles.subLabel} ${Styles.danger}`}>
      One or more required dependencies are missing! More information can be
      found
      <button
        type="button"
        className={Styles.link}
        onClick={() =>
          window.open(
            'https://github.com/saucelabs/saucelabs-vusb-app#prerequisites',
            '_blank'
          )
        }
      >
        <span className={Styles.bugText}>here</span>
      </button>
      .
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
  const colorClass = isSystemOperational
    ? 'accept'
    : !XCODE.isOSX && XCODE.label === 'XCODE'
    ? 'warning'
    : 'danger';

  return (
    <div className={Styles.container}>
      <Header
        title="Requirements"
        headerComponents={[
          <Link to={ROUTES.DEVICES} replace>
            <CloseIconButton key="CloseIconButton" />
          </Link>,
        ]}
      />
      <div className={Styles.mainRequirementsContainer}>
        <div className={Styles.requirementsContainer}>
          <i
            className={`fas ${
              isSystemOperational ? 'fa-check' : 'fa-exclamation-triangle'
            } ${Styles.icon} ${Styles[colorClass]}`}
          />
          <div>
            <div className={Styles.header}>
              <span className={Styles.label}>Requirements checklist</span>
              {/* eslint-disable-next-line no-nested-ternary */}
              {isSystemOperational
                ? successMessage()
                : !isSystemOperational && XCODE.isOSX && XCODE.label === 'XCODE'
                ? errorMessage()
                : warningMessage()}
            </div>
            {Object.values(systemChecks).map(
              ({ check, isOSX, label, message, name }, index) => {
                return (
                  <Requirement
                    check={check}
                    isOSX={isOSX}
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${name}-${index}`}
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
                  window.open(
                    'https://github.com/saucelabs/saucelabs-vusb-app/issues/',
                    '_blank'
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
