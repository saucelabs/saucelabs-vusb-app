import React, { useState } from 'react';
import Styles from './ProductTour.module.css';
import WelcomeSlide from './components/WelcomeSlide';
import UsernameSlide from './components/UsernameSlide';
import AccessKey from './components/AccessKey';
import FinishedSlide from './components/FinishedSlide';

const ProductTour: React.FC<{ skipProductTour: () => void }> = ({
  skipProductTour,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = [
    <WelcomeSlide activeIndex={activeIndex} key={0} order={0} />,
    <UsernameSlide activeIndex={activeIndex} key={1} order={1} />,
    <AccessKey activeIndex={activeIndex} key={2} order={2} />,
    <FinishedSlide activeIndex={activeIndex} key={3} order={3} />,
  ];
  const slidesLength = 4;
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
          {slides.map((slide) => slide)}
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
            disabled={activeIndex === slidesLength - 1}
            label="Next"
            onClick={goToNextSlide}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductTour;
