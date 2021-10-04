import React from 'react';
import { isAndroidError, isIOSError } from '../../utils/Checks';
import Notification, { NotificationsType } from '../../components/Notification';
import Styles from './DevicesNotifications.module.css';
import { DeviceStateInterface } from '../DeviceInterfaces';
import { ApiStatusEnum } from '../DeviceApiTypes';

const DevicesNotifications: React.FC<{
  apiStatus: ApiStatusEnum;
  apiError: Error | null;
  devices: DeviceStateInterface[];
  deviceQuery: string;
}> = ({ apiError, apiStatus, devices, deviceQuery }) => {
  const platformErrorMessage =
    // eslint-disable-next-line no-nested-ternary
    isAndroidError() && isIOSError()
      ? 'Android and iOS'
      : isAndroidError()
      ? 'Android'
      : 'iOS';
  const hasHave = isAndroidError() && isIOSError() ? 'have' : 'has';

  return (
    <>
      {/* When there are platform errors */}
      {(isAndroidError() || isIOSError()) && (
        <Notification type={NotificationsType.ERROR}>
          <span>
            Your {platformErrorMessage} environment {hasHave}{' '}
            <strong>NOT</strong> been set up properly, please check the{' '}
            <em>Requirements</em>-modal to see what needs to be fixed.
          </span>
        </Notification>
      )}
      {/* When there are API errors */}
      {apiStatus === ApiStatusEnum.ERROR && (
        <Notification type={NotificationsType.ERROR}>
          <div>
            There was an error retrieving the devices, please see below for more
            information.
            <pre className={Styles.pre}>{apiError?.message}</pre>
          </div>
        </Notification>
      )}
      {/* When no devices are assigned */}
      {apiStatus !== ApiStatusEnum.ERROR &&
        devices.length === 0 &&
        deviceQuery === '' && (
          <Notification
            type={NotificationsType.ERROR}
            // This is a blocking error, thus a blocking and no way to dismiss it
            blocking
          >
            <span>
              No devices could be found. Reasons for this could be that you
              don&lsquo;t have private devices, please contact your Customer
              Success Manager at Sauce Labs
            </span>
          </Notification>
        )}
      {/* When filtering results in no devices */}
      {devices.filter((device) => device.showDevice).length === 0 && (
        <Notification type={NotificationsType.WARNING}>
          <p>No matching devices found</p>
        </Notification>
      )}
    </>
  );
};

export default DevicesNotifications;
