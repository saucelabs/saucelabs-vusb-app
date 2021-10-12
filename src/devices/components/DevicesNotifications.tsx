import React, { useEffect, useState } from 'react';
import { shell } from 'electron';
import { isAndroidError, isIOSError } from '../../utils/Checks';
import Notification, { NotificationsType } from '../../components/Notification';
import Styles from './DevicesNotifications.module.css';
import { DeviceStateInterface } from '../DeviceInterfaces';
import { ApiStatusEnum } from '../DeviceApiTypes';
import { APP_VERSION } from '../../utils/Constants';

const DevicesNotifications: React.FC<{
  apiStatus: ApiStatusEnum;
  apiError: Error | null;
  devices: DeviceStateInterface[];
  deviceQuery: string;
  doUpdate: boolean;
  isDeprecated: boolean;
}> = ({
  apiError,
  apiStatus,
  devices,
  deviceQuery,
  doUpdate,
  isDeprecated,
}) => {
  type PossibleNotificationsType = {
    background: boolean;
    check: boolean;
    dismissible: boolean;
    element: JSX.Element;
    name: string;
    type: NotificationsType;
  };
  const platformErrorMessage =
    // eslint-disable-next-line no-nested-ternary
    isAndroidError() && isIOSError()
      ? 'Android and iOS'
      : isAndroidError()
      ? 'Android'
      : 'iOS';
  const [activeNotifications, setActiveNotifications] = useState<
    PossibleNotificationsType[]
  >([]);
  const removeAlert = (notificationName: string) => {
    setActiveNotifications([
      ...activeNotifications.filter(
        (notification) => notification.name !== notificationName
      ),
    ]);
  };

  useEffect(() => {
    const possibleNotifications: PossibleNotificationsType[] = [
      {
        background: true,
        check: isAndroidError() || isIOSError(),
        dismissible: true,
        element: (
          <span>
            Your {platformErrorMessage} environment{' '}
            {isAndroidError() && isIOSError() ? 'have' : 'has'}{' '}
            <strong>NOT</strong> been set up properly, please check the{' '}
            <em>Requirements</em>-modal to see what needs to be fixed.
          </span>
        ),
        name: 'platformError',
        type: NotificationsType.ERROR,
      },
      {
        background: true,
        check: apiStatus === ApiStatusEnum.ERROR,
        dismissible: true,
        element: (
          <div>
            There was an error retrieving the devices, please see below for more
            information.
            <pre className={Styles.pre}>
              {apiError?.message || 'No error could be determined.'}
            </pre>
          </div>
        ),
        name: 'apiError',
        type: NotificationsType.ERROR,
      },
      {
        background: true,
        check:
          apiStatus === ApiStatusEnum.SUCCESS &&
          devices.length === 0 &&
          deviceQuery === '',
        dismissible: false,
        element: (
          <span>
            No devices could be found. Reasons for this could be that you
            don&lsquo;t have private devices, please contact your Customer
            Success Manager at Sauce Labs
          </span>
        ),
        name: 'noDevicesAssigned',
        type: NotificationsType.ERROR,
      },
      {
        background: false,
        check:
          apiStatus === ApiStatusEnum.SUCCESS &&
          devices.filter((device) => device.showDevice).length === 0,
        dismissible: true,
        element: <p>No matching devices found</p>,
        name: 'noFilterDevices',
        type: NotificationsType.WARNING,
      },
      {
        background: true,
        check: doUpdate,
        dismissible: true,
        element: (
          <p>
            A new version is available and can be downloaded{' '}
            <button
              className={Styles.link}
              onClick={() =>
                shell.openExternal(
                  'https://github.com/saucelabs/saucelabs-vusb-app/releases'
                )
              }
              type="button"
            >
              here
            </button>
            .
          </p>
        ),
        name: 'doUpdate',
        type: NotificationsType.INFO,
      },
      {
        background: true,
        check: isDeprecated,
        dismissible: false,
        element: (
          <>
            <p>
              Version <span>{APP_VERSION}</span> has been deprecated!
            </p>
            <p>
              A new version is available and can be downloaded{' '}
              <button
                className={Styles.link}
                onClick={() =>
                  shell.openExternal(
                    'https://github.com/saucelabs/saucelabs-vusb-app/releases'
                  )
                }
                type="button"
              >
                here
              </button>
              .
            </p>
          </>
        ),
        name: 'isDeprecated',
        type: NotificationsType.WARNING,
      },
    ];
    setActiveNotifications([
      ...possibleNotifications.filter((alert) => alert.check),
    ]);
  }, [
    apiError,
    apiStatus,
    devices,
    deviceQuery,
    doUpdate,
    isDeprecated,
    platformErrorMessage,
  ]);

  return (
    <>
      {activeNotifications.length > 0 &&
        activeNotifications.map((notification) => (
          <Notification
            background={notification.background}
            dismissible={notification.dismissible}
            key={notification.name}
            notificationName={notification.name}
            type={notification.type}
            onClick={removeAlert}
          >
            {notification.element}
          </Notification>
        ))}
    </>
  );
};

export default DevicesNotifications;
