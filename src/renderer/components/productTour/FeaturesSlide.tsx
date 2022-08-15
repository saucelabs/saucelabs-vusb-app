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
            <li>
              This nice Product Tour which you can always open by clicking on
              the{' '}
              <i
                className={`${Styles.icon} ${Styles.hover} fas fa-info-circle`}
              />
              -icon in the bottom menu
            </li>
            <li>A cleaner new UI</li>
            <li>Easier Settings</li>
            <li>Removed the login-screen</li>
            <li>And many more, so quickly hit NEXT</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default FeaturesSlide;
