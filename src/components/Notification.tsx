import React from 'react';
import Styles from './Notification.module.css';

enum NotificationsType {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

enum NotificationsIconType {
  error = 'fa-times-circle',
  info = 'fa-info-circle',
  success = 'fa-check-circle',
  warning = 'fa-exclamation-triangle',
}

interface NotificationInterface {
  background?: boolean;
  children: JSX.Element;
  centerText?: boolean;
  customClass?: string;
  dismissible?: boolean;
  floatingTop?: boolean;
  notificationName: string;
  onClick: (notificationNme: string) => void;
  title?: string;
  type: NotificationsType;
}

const Notification: React.FC<NotificationInterface> = ({
  background,
  children,
  centerText,
  customClass,
  dismissible,
  floatingTop,
  notificationName,
  onClick,
  title,
  type,
}) => {
  return (
    <div className={background ? Styles.background : ''}>
      <div
        className={`${Styles.notification} ${customClass} ${
          floatingTop ? Styles.floatingTop : Styles.floatingCenter
        } ${centerText ? Styles.centerText : ''}`}
      >
        {dismissible && (
          <button
            type="button"
            className={Styles.close}
            onClick={() => onClick(notificationName)}
          >
            <i className={`${Styles.icon} ${Styles.hover} fas fa-times`} />
          </button>
        )}
        <div className={`${Styles.iconContainer} ${Styles[type]}`}>
          <i
            className={`fas ${NotificationsIconType[type]} ${Styles[type]} `}
          />
        </div>
        <div className={Styles.contentContainer}>
          {title && <span className={Styles.title}>{title}</span>}
          <div className={Styles.childrenContainer}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
export { NotificationsType };
