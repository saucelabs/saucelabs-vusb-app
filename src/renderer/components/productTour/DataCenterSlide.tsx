import React, { useState } from 'react';
import { LOCATION } from 'renderer/utils/Constants';
import dataCenterUrl from '../../assets/images/data-center.gif';
import RadioButton from '../RadioButton';
import Styles from './Slide.module.css';

const DataCenterSlide: React.FC = () => {
  const settingsData = window.electron.store.get();
  const {
    connection: { location },
  } = settingsData;
  const [dc, setDc] = useState(location);
  const updateDc = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDc(event.target.value);
  const storeDc = () => {
    window.electron.store.set({
      ...settingsData,
      connection: {
        ...settingsData.connection,
        location: dc,
      },
    });
  };
  return (
    <>
      <div className={Styles.slideTop}>
        <img alt="Copy accessKey" src={dataCenterUrl} />
      </div>
      <div className={Styles.slideBottom}>
        <div className={Styles.textContainer}>
          <span className={Styles.textContainerTitle}>Data Center</span>
          <span className={Styles.text}>
            Select the data center you want to use / where your private devices
            are hosted.
          </span>
          <RadioButton
            label={LOCATION.EU.label}
            value={LOCATION.EU.value}
            name="location"
            currentValue={dc}
            onBlur={storeDc}
            onChange={updateDc}
          />
          <RadioButton
            label={LOCATION.US.label}
            value={LOCATION.US.value}
            name="location"
            currentValue={dc}
            onBlur={storeDc}
            onChange={updateDc}
          />
        </div>
      </div>
    </>
  );
};

export default DataCenterSlide;
