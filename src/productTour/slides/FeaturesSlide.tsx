import React from 'react';
import Styles from './Slide.module.css';

const FeaturesSlide: React.FC = () => {
  return (
    <>
      <div className={Styles.slideTop}>
        <span className={Styles.slideTitle}>What&apos;s new?</span>
      </div>
      <div className={Styles.slideBottom}>
        <div className={Styles.textContainer}>
          <ul>
            <li>A cleaner new UI</li>
            <li>Removed the login-screen, for impact see next slide</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default FeaturesSlide;
