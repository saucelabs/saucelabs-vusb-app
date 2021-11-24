import React from 'react';
import Styles from './Slide.module.css';

const HowToSlide: React.FC = () => {
  return (
    <>
      <div className={Styles.slideTop}>
        <span className={Styles.slideTitle}>
          How to use the
          <br />
          vUSB GUI!
        </span>
      </div>
      <div className={Styles.slideBottom}>
        <div className={Styles.textContainer} />
      </div>
    </>
  );
};

export default HowToSlide;
