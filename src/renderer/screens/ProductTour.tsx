import React, { useState } from 'react';
import Styles from './ProductTour.module.css';
import WelcomeSlide from '../components/productTour/WelcomeSlide';
import LabelsSlide from '../components/productTour/Labels';
import UsernameSlide from '../components/productTour/UsernameSlide';
import AccessKey from '../components/productTour/AccessKey';
import FeaturesSlide from '../components/productTour/FeaturesSlide';
import FinishedSlide from '../components/productTour/FinishedSlide';
import HowToSlide from '../components/productTour/HowToSlide';
import TunnelsSlide from '../components/productTour/Tunnels';
import OpenManualTest from '../components/productTour/OpenManualTest';
import DataCenterSlide from '../components/productTour/DataCenterSlide';

const ProductTour: React.FC<{
  isUserDataStored: boolean;
  skipProductTour: () => void;
}> = ({ isUserDataStored, skipProductTour }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = [
    <WelcomeSlide isUserDataStored={isUserDataStored} key={0} />,
    ...(isUserDataStored
      ? []
      : [
          <UsernameSlide key={1} />,
          <AccessKey key={2} />,
          <DataCenterSlide key={3} />,
        ]),
    <FeaturesSlide key={4} />,
    <LabelsSlide key={5} />,
    <TunnelsSlide key={6} />,
    <OpenManualTest key={7} />,
    <HowToSlide key={8} />,
    <FinishedSlide isUserDataStored={isUserDataStored} key={9} />,
  ];
  const slidesLength = slides.length;
  const Button: React.FC<{
    disabled?: boolean;
    label: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
  }> = ({ disabled, label, onClick }) => {
    return (
      <button
        disabled={disabled}
        type="button"
        onClick={onClick}
        className={Styles.goToButton}
      >
        {label}
      </button>
    );
  };
  Button.defaultProps = {
    disabled: false,
  };
  const Dot: React.FC<{ index: number; onClick: (index: number) => void }> = ({
    index,
    onClick,
  }) => {
    return (
      // eslint-disable-next-line jsx-a11y/control-has-associated-label
      <button
        type="button"
        key={index}
        onClick={() => onClick(index)}
        className={`${Styles.dot} ${
          index === activeIndex ? Styles.active : ''
        }`}
      />
    );
  };
  const goToSlide = (index: number) => setActiveIndex(index);
  const goToPrevSlide = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    let index = activeIndex;
    if (index < 1) {
      index = slidesLength - 1;
    }
    // eslint-disable-next-line no-plusplus
    setActiveIndex(--index);
  };
  const goToNextSlide = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    let index = activeIndex;
    if (index === slidesLength - 1) {
      index = -1;
    }
    // eslint-disable-next-line no-plusplus
    setActiveIndex(++index);
  };

  return (
    <div className={Styles.background}>
      <div className={Styles.cardContainer}>
        <div className={Styles.slidesContainer}>
          <button
            type="button"
            className={Styles.skipButton}
            onClick={skipProductTour}
          >
            Skip
          </button>
          {slides.map((slide, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={`slide-${index}`}
              className={`${Styles.slide} ${
                activeIndex === index ? Styles.active : ''
              }`}
            >
              {slide}
            </div>
          ))}
        </div>
        <div className={Styles.footer}>
          <Button
            disabled={activeIndex === 0}
            label="Previous"
            onClick={goToPrevSlide}
          />
          <div className={Styles.dotsContainer}>
            {[...Array(slidesLength)].map((_x, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Dot key={`dot-${i}`} index={i} onClick={goToSlide} />
            ))}
          </div>
          <Button
            label={
              // eslint-disable-next-line no-nested-ternary
              activeIndex === 0
                ? 'Get Started'
                : activeIndex === slidesLength - 1
                ? 'Close'
                : 'Next'
            }
            onClick={
              activeIndex === slidesLength - 1 ? skipProductTour : goToNextSlide
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProductTour;
