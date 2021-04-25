// @flow
import React, { Component } from 'react';
import Styles from './Header.styles.css';
import SauceLogo from '../../assets/images/sauce-white-logo-small.png';
import { DEVICE_SESSION_STATUS } from '../../devices/duck/actions';
import { VUSB_SERVER_STATUS } from '../duck/actions';

type Props = {
  centerComponent?: {},
  serverError: boolean,
  serverStatus: string,
  rightComponent?: {}
};
export default class Header extends Component<Props> {
  props: Props;

  static defaultProps = {
    centerComponent: null,
    rightComponent: null
  };

  render() {
    const {
      centerComponent,
      serverError,
      serverStatus,
      rightComponent
    } = this.props;
    const status =
      // eslint-disable-next-line no-nested-ternary
      serverStatus === VUSB_SERVER_STATUS.RUNNING ||
      serverStatus === DEVICE_SESSION_STATUS.CONNECTED
        ? 'running'
        : serverError
        ? 'error'
        : '';

    return (
      <div className={`${Styles.container} ${Styles[status]}`}>
        <img src={SauceLogo} />
        <div className={Styles.center}>{centerComponent}</div>
        <div className={Styles.right}>{rightComponent}</div>
      </div>
    );
  }
}
