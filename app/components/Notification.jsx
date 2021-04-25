// @flow
import React, { Component } from 'react';
import Styles from './Notification.styles.css';

export const NOTIFICATIONS = {
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

type Props = {
  children: React.Node,
  type: string,
  customClass?:string,
  centerText?: boolean,
  floatingCenter?: boolean,
  floatingTop?: boolean,
};

export default class Notification extends Component<Props> {
  props: Props;

  static defaultProps = {
    customClass:'',
    centerText: false,
    floatingCenter: false,
    floatingTop: false
  };

  render() {
    const { children, centerText, customClass, floatingCenter, floatingTop, type } = this.props;

    return (
      <div
        className={`${Styles.notification} ${customClass} ${Styles[type]} ${
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
  }
}
