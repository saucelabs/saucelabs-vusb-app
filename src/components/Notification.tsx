import React from 'react';
import Styles from './Notification.module.css';

enum NotificationsType {
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

interface NotificationInterface {
  children: JSX.Element;
  type: NotificationsType;
  customClass?: string;
  centerText?: boolean;
  floatingCenter?: boolean;
  floatingTop?: boolean;
}

const Notification: React.FC<NotificationInterface> = ({
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

export default Notification;
export { NotificationsType };
