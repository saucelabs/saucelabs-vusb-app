import React from 'react';
import Styles from './DeviceDetails.module.css';

const DeviceDetailsEmptyCard: React.FC = () => {
  return (
    <div className={Styles.container}>
      <div className={Styles.deviceTile}>
        <div className={Styles.animatedBackground}>
          <div className={`${Styles.gradientMask} ${Styles.headerRight}`} />
          <div className={`${Styles.gradientMask} ${Styles.headerBottom}`} />
          <div className={`${Styles.gradientMask} ${Styles.imageRight}`} />
          <div className={`${Styles.gradientMask} ${Styles.deviceDataTop}`} />
          <div className={`${Styles.gradientMask} ${Styles.deviceDataRight}`} />
          <div
            className={`${Styles.gradientMask} ${Styles.deviceDataBottom}`}
          />
          <div
            className={`${Styles.gradientMask} ${Styles.deviceActionWrapperTop}`}
          />
          <div
            className={`${Styles.gradientMask} ${Styles.deviceActionWrapperCenter}`}
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsEmptyCard;
