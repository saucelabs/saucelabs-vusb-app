import React from 'react';
import Styles from './Slide.module.css';

const WelcomeSlide: React.FC<{ isUserDataStored: boolean }> = ({
  isUserDataStored,
}) => {
  const text = !isUserDataStored ? 'help you set up/' : '';

  return (
    <>
      <div className={Styles.slideTop}>
        <span className={Styles.slideTitle}>Welcome!</span>
      </div>
      <div className={Styles.slideBottom}>
        <div className={Styles.textContainer}>
          <span>
            This tour will:
            <ul>
              <li>
                {text}guide you through the
                <br />
                <strong>Sauce Labs Virtual USB GUI</strong>
              </li>
              <li>show new features</li>
            </ul>
            <em>
              You can skip this tour by clicking on the <strong>Skip</strong>
              -button.
            </em>
          </span>
        </div>
      </div>
    </>
  );
};

export default WelcomeSlide;
