/**
 * @TODO:
 * Do I want to add the following options for manual testing, if so this is the needed data
 *
 * Coordinates (will be harder because I can't interact with the webpage, so I need to have a modal, but that one can't
 * be used because the bar is very small):
 *  - endpoint: https://eu1-manual.app.testobject.com/api/rest/manual/sessions/3225db2a-3453-4589-bb12-670ed1b6bb01/gps/coordinate
 *  - payload: {latitude: 37.3894698, longitude: -121.9643038}
 *
 *  Disable Wifi (Android, default enabled):
 *    - endpoint: https://eu1-manual.app.testobject.com/api/rest/manual/sessions/3225db2a-3453-4589-bb12-670ed1b6bb01/wifi/disable
 *    - endpoint: https://eu1-manual.app.testobject.com/api/rest/manual/sessions/3225db2a-3453-4589-bb12-670ed1b6bb01/wifi/enable
 *
 *  Animations (Android, default disabled):
 *    - endpoint: https://eu1-manual.app.testobject.com/api/rest/manual/sessions/3225db2a-3453-4589-bb12-670ed1b6bb01/wifi/enable
 *    - endpoint: https://eu1-manual.app.testobject.com/api/rest/manual/sessions/3225db2a-3453-4589-bb12-670ed1b6bb01/wifi/disable
 *
 *  Language (not really working)
 *    - endpoint: https://eu1-manual.app.testobject.com/api/rest/manual/sessions/3225db2a-3453-4589-bb12-670ed1b6bb01/locales
 *    - https://eu1-manual.app.testobject.com/api/rest/manual/sessions/3225db2a-3453-4589-bb12-670ed1b6bb01/locales/en_GB/set
 */
// @flow
import React, {Component} from 'react';
import {argv} from "yargs";
import axios from 'axios';
import Styles from "../components/ManualScreen.styles.css";
import {DATA_CENTER_URLS} from "../../helpers/constants";

type Props = {
  dataCenter: string,
};
let ws = null;

export default class ManualScreen extends Component<Props> {
  props: Props;

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      sessionID: argv.sessionID,
      error: ''
    };

    const {dataCenter} = props;
    const dcUrl = DATA_CENTER_URLS[dataCenter];
    this.url = `https://api.${dcUrl}.saucelabs.com/v1/rdc/manual/sessions`;
    this.wss = `wss://api.${dcUrl}.saucelabs.com/v1/rdc/socket/alternativeIo`;
    this.rotateDevice = this.rotateDevice.bind(this);
  }

  componentDidMount() {
    ws = new WebSocket(`${this.wss}/${this.state.sessionID}`)
  }

  componentWillUnmount() {
    ws.close();
  }

  /**
   * Rotate the device
   *
   * @return {Promise<void>}
   */
  async rotateDevice() {
    const orientation = this.state.orientation === 'LANDSCAPE' ? 'PORTRAIT' : 'LANDSCAPE';

    try {
      await axios.post(`${this.url}/${this.state.sessionID}/orientation`, orientation);
      // Update the state
      this.setState({orientation});
    } catch (error) {
      this.setState({error: JSON.stringify(error)});
    }
  }

  pressHome() {
    ws.send('tt/Sauce_Home_Key')
  }

  androidOpenMenu() {
    ws.send('tt/Sauce_Menu_Key')
  }

  androidGoBack() {
    ws.send('tt/Sauce_Back_Key')
  }

  render() {
    return (
      <div className={Styles.container}>
        <div className={Styles['button-container']}>
          <button
            className={Styles.button}
            onClick={() => this.rotateDevice()}
          >
            <svg className={Styles.svg} width="32" height="32" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M8.164 3.136l-.134.134a1.52 1.52 0 00-.09.084l-4.592 4.59c-.03.03-.057.06-.084.092l-.05.05a2 2 0 000 2.828l9.9 9.9a2 2 0 002.828 0l4.95-4.95a2 2 0 000-2.828l-9.9-9.9a2 2 0 00-2.828 0zM18.51 13.483l-4.95 4.95-8.228-8.23 4.95-4.95 8.228 8.23z"></path>
              <path
                d="M11.57 2.198l-.052.015a.15.15 0 00-.046.264l3.18 2.346a.15.15 0 00.237-.094l.195-1.103a8.96 8.96 0 013.65 2.296 8.967 8.967 0 012.526 6.122.5.5 0 001-.014 9.967 9.967 0 00-2.806-6.802 9.956 9.956 0 00-4.195-2.596 10.044 10.044 0 00-3.69-.434zM5.74 19.632a10.099 10.099 0 01-2-2.175 9.97 9.97 0 01-1.717-5.473.5.5 0 011-.005 8.967 8.967 0 002.525 6.122 8.959 8.959 0 003.651 2.296l.195-1.102a.15.15 0 01.236-.095l3.181 2.346a.15.15 0 01-.047.265l-.05.015a10.045 10.045 0 01-3.69-.435 9.936 9.936 0 01-3.283-1.76z"></path>
            </svg>
            <span className={Styles.label}>Rotate</span>
          </button>
          {argv.platform.toLowerCase() === 'android' ? (
            <div>
              <button
                className={Styles.button}
                onClick={() => this.androidGoBack()}
              >
                <svg className={Styles.svg}  width="32" height="32" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M7.436 18.364A1 1 0 008.85 16.95L4.9 13h11.6a3 3 0 013 3v.5a1 1 0 102 0V16a5 5 0 00-5-5H4.9l3.95-3.95a1 1 0 00-1.414-1.414l-5.657 5.657a1 1 0 000 1.414l5.657 5.657z"></path>
                </svg>
                <span className={Styles.label}>Back</span>
              </button>
              <button
                className={Styles.button}
                onClick={() => this.pressHome()}
              >
                <svg className={Styles.svg}  width="32" height="32" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.843 13.5H4V21a1 1 0 001 1h14a1 1 0 001-1v-7.5h1.157c.88 0 1.331-1.056.722-1.692l-9.157-9.555a1 1 0 00-1.444 0l-9.157 9.555c-.609.636-.158 1.692.722 1.692zM11 16a1 1 0 00-1 1v5h4v-5a1 1 0 00-1-1h-2z"></path>
                </svg>
                <span className={Styles.label}>Home</span>
              </button>
              <button
                className={Styles.button}
                onClick={() => this.androidOpenMenu()}
              >
                <svg className={Styles.svg}  width="32" height="32" viewBox="0 0 24 24">
                  <path
                    d="M2 6.5a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1zM2 12.063a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1zM3 16.625a1 1 0 100 2h18a1 1 0 100-2H3z"></path>
                </svg>
                <span className={Styles.label}>Menu</span>
              </button>
            </div>
          ) : (
            <div className={Styles['device-specific-buttons']}>
              <button
                className={Styles.button}
                onClick={() => this.pressHome()}
              >
                <svg className={Styles.svg} version="1.1" width="32" height="32" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.843 13.5H4V21a1 1 0 001 1h14a1 1 0 001-1v-7.5h1.157c.88 0 1.331-1.056.722-1.692l-9.157-9.555a1 1 0 00-1.444 0l-9.157 9.555c-.609.636-.158 1.692.722 1.692zM11 16a1 1 0 00-1 1v5h4v-5a1 1 0 00-1-1h-2z"></path>
                </svg>
                <span className={Styles.label}>Home</span>
              </button>
            </div>)}
        </div>
      </div>
    );
  }
}
