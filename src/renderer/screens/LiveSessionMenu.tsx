/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { LOCATION } from 'renderer/utils/Constants';
import Styles from './LiveSessionMenu.module.css';

const LiveSessionMenu: React.FC = () => {
  const wss = useRef<WebSocket>();
  const [orientation, setOrientation] = React.useState('PORTRAIT');
  const parseArgs = (args: string[], arg: string) => {
    const result = args.find((argument) => argument.includes(arg));
    return result && result.split(arg).length > 0 ? result.split(arg)[1] : '';
  };
  const sessionId = parseArgs(process.argv, '--sessionId=');
  const platform = parseArgs(process.argv, '--platform=');
  const dc = parseArgs(process.argv, '--dc=');
  // @ts-ignore
  const dcUrl = LOCATION[dc.toUpperCase()].endpoint;
  const apiUrl = `https://api.${dcUrl}.saucelabs.com/v1/rdc/manual/sessions`;
  const wssUrl = `wss://api.${dcUrl}.saucelabs.com/v1/rdc/socket/alternativeIo`;
  const rotateDevice = async () => {
    const newOrientation =
      orientation === 'LANDSCAPE' ? 'PORTRAIT' : 'LANDSCAPE';
    try {
      await axios.post(`${apiUrl}/${sessionId}/orientation`, newOrientation);
      // Update the state
      setOrientation(newOrientation);
    } catch (ign) {
      // ignore
    }
  };
  useEffect(() => {
    wss.current = new WebSocket(`${wssUrl}/${sessionId}`);
    return () => wss.current?.close();
  }, [sessionId, wss, wssUrl]);

  const pressHome = () => wss.current?.send('tt/Sauce_Home_Key');
  const androidOpenMenu = () => wss.current?.send('tt/Sauce_Menu_Key');
  const androidGoBack = () => wss.current?.send('tt/Sauce_Back_Key');

  return (
    <div className={Styles.container}>
      <div className={Styles.buttonContainer}>
        <button
          className={Styles.button}
          onClick={() => rotateDevice()}
          type="button"
        >
          <svg
            className={Styles.svg}
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g clipPath="url(#screen_rotation_clip0)">
              <path d="M14.056 2.206a.156.156 0 000 .239l2.61 2.167c.116.097.288-.012.25-.159l-.33-1.27a5.463 5.463 0 014.27 4.744l-1.325-.336c-.146-.038-.255.134-.158.25l2.176 2.603a.156.156 0 00.24 0l2.174-2.6c.097-.117-.012-.289-.16-.25l-1.375.354c-.257-3.228-2.708-5.84-5.866-6.355l.357-1.398c.037-.146-.135-.255-.251-.158l-2.612 2.169zM3 5a2 2 0 012-2h7a2 2 0 012 2v4h-1.5V6h-8v3H3V5zM3 22a2 2 0 002 2h7a2 2 0 002-2H3z" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 10a2 2 0 012 2v7a2 2 0 01-2 2H2a2 2 0 01-2-2v-7a2 2 0 012-2h17zm-1 9.5v-8H3v8h15z"
              />
            </g>
            <defs>
              <clipPath id="screen_rotation_clip0">
                <path d="M0 0h24v24H0z" />
              </clipPath>
            </defs>
          </svg>
        </button>
        {platform.toLowerCase() === 'android' ? (
          <div>
            <button
              className={Styles.button}
              onClick={() => androidGoBack()}
              type="button"
            >
              <svg
                className={Styles.svg}
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.436 18.364A1 1 0 008.85 16.95L4.9 13h11.6a3 3 0 013 3v.5a1 1 0 102 0V16a5 5 0 00-5-5H4.9l3.95-3.95a1 1 0 00-1.414-1.414l-5.657 5.657a1 1 0 000 1.414l5.657 5.657z"
                />
              </svg>
            </button>
            <button
              className={Styles.button}
              onClick={() => pressHome()}
              type="button"
            >
              <svg
                className={Styles.svg}
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.843 13.5H4V21a1 1 0 001 1h14a1 1 0 001-1v-7.5h1.157c.88 0 1.331-1.056.722-1.692l-9.157-9.555a1 1 0 00-1.444 0l-9.157 9.555c-.609.636-.158 1.692.722 1.692zM11 16a1 1 0 00-1 1v5h4v-5a1 1 0 00-1-1h-2z"
                />
              </svg>
            </button>
            <button
              className={Styles.button}
              onClick={() => androidOpenMenu()}
              type="button"
            >
              <svg
                className={Styles.svg}
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path d="M2 6.5a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1zM2 12.063a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1zM3 16.625a1 1 0 100 2h18a1 1 0 100-2H3z" />
              </svg>
            </button>
          </div>
        ) : (
          <div className={Styles['device-specific-buttons']}>
            <button
              className={Styles.button}
              onClick={() => pressHome()}
              type="button"
            >
              <svg
                className={Styles.svg}
                version="1.1"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.843 13.5H4V21a1 1 0 001 1h14a1 1 0 001-1v-7.5h1.157c.88 0 1.331-1.056.722-1.692l-9.157-9.555a1 1 0 00-1.444 0l-9.157 9.555c-.609.636-.158 1.692.722 1.692zM11 16a1 1 0 00-1 1v5h4v-5a1 1 0 00-1-1h-2z"
                />
              </svg>
            </button>
          </div>
        )}
        <button
          type="button"
          className={Styles.endSession}
          onClick={() => window.close()}
        >
          <span>End</span>
        </button>
      </div>
    </div>
  );
};

export default LiveSessionMenu;
