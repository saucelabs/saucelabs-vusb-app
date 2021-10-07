import React from 'react';
import Styles from './Slide.module.css';

const WelcomeSlide: React.FC<{ activeIndex: number; order: number }> = ({
  activeIndex,
  order,
}) => {
  return (
    <div
      className={`${Styles.slide} ${
        activeIndex === order ? Styles.active : ''
      }`}
    >
      <div className={Styles.slideTop}>
        <span className={Styles.slideTitle}>Welcome!</span>
      </div>
      <div className={Styles.slideBottom}>
        <div className={Styles.textContainer}>
          <span>
            This product tour will help you set up the
            <br />
            <strong>Sauce Labs Virtual USB GUI</strong> <br />
            and show new features.
            <br />
            <br />
            If you want you can skip this tour by clicking on the{' '}
            <strong>Skip</strong>-button. You can go to the next or previous
            slide by using the <strong>NEXT</strong>/<strong>PREVIOUS</strong>{' '}
            buttons.
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSlide;
