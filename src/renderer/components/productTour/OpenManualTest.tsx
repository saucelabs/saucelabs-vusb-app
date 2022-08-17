import React from 'react';
import manualTestImage from '../../assets/images/openManualTest.gif';
import Styles from './Slide.module.css';

const OpenManualTest: React.FC = () => {
  return (
    <>
      <div className={Styles.slideTop}>
        <img alt="Tunnels" src={manualTestImage} width={550} />
      </div>
      <div className={Styles.slideBottom}>
        <div className={`${Styles.textContainer} ${Styles.widerTextContainer}`}>
          <span className={Styles.textContainerTitle}>
            Three options to open a manual test
          </span>
          <span>
            When you started a new session you can open a manual test in two to
            three ways. You can:
            <ul>
              <li>Directly open a session in Sauce Labs.</li>
              <li>
                When you are an SSO user, copy the link and follow some steps.
              </li>
              <li>Open the manual session in a new virtual USB Window.</li>
            </ul>
          </span>
        </div>
      </div>
    </>
  );
};

export default OpenManualTest;
