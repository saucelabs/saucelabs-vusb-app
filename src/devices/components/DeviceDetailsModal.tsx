import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Styles from './DeviceDetailsModal.module.css';
import { DeviceStateType } from '../../types/DeviceTypes';

type DeviceDetailsModalType = {
  deviceDetails: DeviceStateType;
  handleClose: () => void;
  open: boolean;
};

const DeviceDetailsModal: React.FC<DeviceDetailsModalType> = ({
  deviceDetails,
  handleClose,
  open,
}) => {
  const {
    abiType,
    apiLevel,
    cpuFrequency,
    cpuType,
    dataCenterId,
    dpiName,
    descriptorId,
    internalStorageSize,
    modelNumber,
    name,
    os,
    osVersion,
    ramSize,
    resolutionHeight,
    resolutionWidth,
    screenSize,
  } = deviceDetails;
  const imgUrl = `https://d3ty40hendov17.cloudfront.net/device-pictures/${descriptorId}_optimised.png`;
  const platform = os.toLowerCase() === 'android' ? 'Android' : 'iOS';

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <div className={Styles.wrapper}>
        <div className={Styles['title-container']}>
          <span className={Styles.title}>{name}</span>
        </div>
        <div className={Styles.content}>
          <div className={Styles['image-wrapper']}>
            <div>
              <img alt={name} src={imgUrl} />
            </div>
          </div>
          <div className={Styles['device-data-wrapper']}>
            <table>
              <tbody>
                <tr>
                  <th>OS:</th>
                  <td>
                    {platform} {osVersion}
                  </td>
                </tr>
                <tr>
                  <th>API Level:</th>
                  <td>{apiLevel || '-'}</td>
                </tr>
                <tr>
                  <th>Screen:</th>
                  <td>
                    {screenSize}&ldquo; | ({resolutionWidth} x{' '}
                    {resolutionHeight}) | {dpiName || '-'}
                  </td>
                </tr>
                <tr>
                  <th>CPU:</th>
                  <td>
                    {cpuType || '-'} | {abiType || ''} | {cpuFrequency || '-'}{' '}
                    MHz
                  </td>
                </tr>
                <tr>
                  <th>RAM:</th>
                  <td>{ramSize / 1024 || '-'} GB</td>
                </tr>
                <tr>
                  <th>Internal Storage:</th>
                  <td>{internalStorageSize / 1024 || '-'} GB</td>
                </tr>
                <tr>
                  <th>Model Number:</th>
                  <td>{modelNumber || '-'}</td>
                </tr>
                <tr>
                  <th>ID:</th>
                  <td>{descriptorId}</td>
                </tr>
                <tr>
                  <th>Location:</th>
                  <td>{dataCenterId.toUpperCase()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DeviceDetailsModal;
