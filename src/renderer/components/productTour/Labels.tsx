import React from 'react';
import Styles from './Slide.module.css';

const LabelsSlide: React.FC = () => {
  return (
    <>
      <div className={Styles.slideTop}>
        <span className={Styles.slideTitle}>
          Clearer Device
          <br />
          Status Labels
        </span>
      </div>
      <div className={Styles.slideBottom}>
        <div className={`${Styles.textContainer} ${Styles.widerTextContainer}`}>
          <span className={Styles.centerText}>
            A device can have different state labels which are explained below.
          </span>
          <div className={Styles.tableRow}>
            <div className={Styles.firstColumn}>
              <div className={`${Styles.badge} ${Styles.busy}`}>Busy</div>
            </div>
            <div className={Styles.secondColumn}>
              In a cleaning process (from a manual or automated session on Sauce
              Labs) or used by a colleague
            </div>
          </div>
          <div className={Styles.tableRow}>
            <div className={Styles.firstColumn}>
              <div className={`${Styles.badge} ${Styles.busy}`}>
                Can take
                <br />
                over
              </div>
            </div>
            <div className={Styles.secondColumn}>
              {' '}
              Can connect to an existing live session form the Sauce Labs UI.{' '}
              <br />
              <strong>NOTE:</strong> You could potentially break a session of a
              colleague
            </div>
          </div>
          <div className={Styles.tableRow}>
            <div className={Styles.firstColumn}>
              <div className={`${Styles.badge} ${Styles.busy}`}>Using vUSB</div>
            </div>
            <div className={Styles.secondColumn}>
              Device is being used over vUSB.
            </div>
          </div>
          <div className={Styles.tableRow}>
            <div className={Styles.firstColumn}>
              <div className={`${Styles.badge} ${Styles.busy}`}>
                Cleaning
                <br />
                device
              </div>
            </div>
            <div className={Styles.secondColumn}>
              Device is being cleaned <strong>AFTER</strong> a vUSB session.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LabelsSlide;
