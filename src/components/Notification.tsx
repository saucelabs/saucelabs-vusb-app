import React from 'react';
import Styles from './Notification.module.css';

const NOTIFICATIONS = {
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

type NotificationType = {
  children: JSX.Element;
  type: string;
  customClass?: string;
  centerText?: boolean;
  floatingCenter?: boolean;
  floatingTop?: boolean;
};

const Notification: React.FC<NotificationType> = ({
  children,
  centerText,
  customClass,
  floatingCenter,
  floatingTop,
  type,
}) => {
  return (
    <div
      className={`${Styles.notification} ${customClass} ${Styles[type]} ${
        // eslint-disable-next-line no-nested-ternary
        floatingCenter
          ? Styles.floatingCenter
          : floatingTop
          ? Styles.floatingTop
          : ''
      } ${centerText ? Styles.centerText : ''}`}
    >
      {children}
    </div>
  );
};

export { Notification, NOTIFICATIONS };
