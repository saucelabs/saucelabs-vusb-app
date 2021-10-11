import React from 'react';
import Styles from './Slide.module.css';

const FinishedSlide: React.FC = () => {
  return (
    <>
      <div className={Styles.slideTop}>
        <span className={Styles.slideTitle}>All Done!</span>
      </div>
      <div className={Styles.slideBottom}>
        <div className={Styles.textContainer}>
          <span>
            Congratulations, you&apos;ve now set up the
            <br />
            <strong>Sauce Labs Virtual USB GUI</strong> <br />
            and now how to use it.
            <br />
            <br />
            You can now close this tour by clicking on the <strong>Skip</strong>
            -button.
          </span>
        </div>
      </div>
    </>
  );
};

export default FinishedSlide;
