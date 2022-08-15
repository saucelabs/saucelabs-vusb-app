import React from 'react';
import { ServerActionEnum } from '../../../types/ServerTypes';
import Styles from './StartStopServerButton.module.css';

interface StartStopServerButtonInterface {
  serverStatus: string;
  startVusbServer: () => void;
  stopVusbServer: () => void;
}

const StartStopServerButton: React.FC<StartStopServerButtonInterface> = ({
  serverStatus,
  startVusbServer,
  stopVusbServer,
}) => {
  const isServerRunning = serverStatus === ServerActionEnum.VUSB_RUNNING;

  return (
    <>
      <i
        role="button"
        tabIndex={0}
        aria-label={`${isServerRunning ? 'Stop' : 'Start'} server`}
        className={`${Styles.icon} ${Styles.hover} fas fa-${
          isServerRunning ? 'stop' : 'play'
        }-circle`}
        onClick={isServerRunning ? stopVusbServer : startVusbServer}
        onKeyDown={isServerRunning ? stopVusbServer : startVusbServer}
      />
    </>
  );
};

export default StartStopServerButton;
