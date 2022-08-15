import React from 'react';
import Styles from './Slide.module.css';

const FinishedSlide: React.FC<{ isUserDataStored: boolean }> = ({
  isUserDataStored,
}) => {
  const title = isUserDataStored ? 'Awesome!' : "You've done it!";
  const message = isUserDataStored ? (
    <>
      You now know how to use the
      <br />
      <strong>Sauce Labs Virtual USB GUI</strong>.
    </>
  ) : (
    <>
      Congratulations, you&apos;ve now set up the
      <br />
      <strong>Sauce Labs Virtual USB GUI</strong> <br />
      and know how to use it.
    </>
  );
  return (
    <>
      <div className={Styles.slideTop}>
        <span className={Styles.slideTitle}>{title}</span>
      </div>
      <div className={Styles.slideBottom}>
        <div className={Styles.textContainer}>
          <span>
            {message}
            <br />
            <br />
            You can close this tour by clicking on the <strong>
              Skip
            </strong> or <strong>Close</strong>
            -button.
          </span>
        </div>
      </div>
    </>
  );
};

export default FinishedSlide;
