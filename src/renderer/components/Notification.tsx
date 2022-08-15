/* eslint-disable react/require-default-props */
import React from 'react';
import Styles from './Notification.module.css';

enum NotificationsEnum {
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

type NotificationType = {
  background?: boolean;
  children: JSX.Element;
  centerText?: boolean;
  customClass?: string;
  dismissible?: boolean;
  floatingTop?: boolean;
  onClick?: () => void;
  title?: string;
  type: NotificationsEnum;
};

const Notification: React.FC<NotificationType> = ({
  background,
  children,
  centerText,
  customClass,
  dismissible,
  floatingTop,
  onClick,
  title,
  type,
}) => {
  return (
    <div className={background ? Styles.background : ''}>
      <div
        className={`${Styles.notification} ${customClass} ${
          floatingTop ? Styles.floatingTop : Styles.floatingCenter
        } ${centerText ? Styles.centerText : ''} ${Styles[type]}`}
      >
        {dismissible && onClick && (
          <button type="button" className={Styles.close} onClick={onClick}>
            <i className={`${Styles.icon} ${Styles.hover} fas fa-times`} />
          </button>
        )}
        <div className={Styles.leftLine} />
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
export { NotificationsEnum };
