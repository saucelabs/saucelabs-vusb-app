// @flow
import React, {Component} from 'react';
import Styles from "./Version.styles.css";
import Vusb from "../assets/images/vusb.png";
import {APP_VERSION} from "../helpers/constants";
import Notification, {NOTIFICATIONS} from "./Notification";
import {shell} from "electron";

export default class VersionContainer extends Component {
  render(){
    return (
      <div>
        <div className={Styles['version-container']}>
          <img
            src={Vusb}
            className={Styles['version-image']}
            alt="Virtual USB"
          />
          <div className={Styles['version-text-container']}>
            <span className={Styles['version-title']}>Virtual USB</span>
            <span className={Styles['version-number']}>
              Version {APP_VERSION}
            </span>
          </div>
        </div>
        <Notification type={NOTIFICATIONS.INFO}>
          Issues can be filed{' '}
          <a
            className={Styles.link}
            onClick={()=> shell.openExternal('https://github.com/saucelabs/saucelabs-vusb-app/issues/')}>
            here
          </a>.
        </Notification>
      </div>
    )
  }
}
