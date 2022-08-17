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
        <div className={Styles.textContainer}>
          <span>
            We tried to make it as easy as possible for you an have three
            options for you to get familiar with the GUI:
            <ul>
              <li>
                Check out a video{' '}
                <button
                  type="button"
                  className={Styles.buttonLink}
                  onClick={() =>
                    window.open(
                      'https://github.com/saucelabs/saucelabs-vusb-app/#virtual-usb-gui'
                    )
                  }
                >
                  here
                </button>
              </li>
              <li>
                Check out a <em>How To Use</em>{' '}
                <button
                  type="button"
                  className={Styles.buttonLink}
                  onClick={() =>
                    window.open(
                      'https://github.com/saucelabs/saucelabs-vusb-app/blob/main/docs/HOW_TO_USE.md'
                    )
                  }
                >
                  here
                </button>
              </li>
              <li>
                Check out each screen{' '}
                <button
                  type="button"
                  className={Styles.buttonLink}
                  onClick={() =>
                    window.open(
                      'https://github.com/saucelabs/saucelabs-vusb-app/blob/main/docs/SCREENS.md'
                    )
                  }
                >
                  here
                </button>
              </li>
            </ul>
          </span>
        </div>
      </div>
    </>
  );
};

export default HowToSlide;
