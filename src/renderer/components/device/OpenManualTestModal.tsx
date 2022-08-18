/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import { DeviceSessionStatusEnum } from 'types/DeviceTypes';
import { LOCATION } from '../../utils/Constants';
import SubmitButton from '../buttons/Button';
import CloseIconButton from '../buttons/CloseIconButton';
import Login from './Login';
import Styles from './OpenManualTestModal.module.css';

const OpenManualTestModal: React.FC<{
  dc: string;
  descriptorId: string;
  handleClose: () => void;
  platform: string;
  portNumber: number;
  sessionID: string;
  status: DeviceSessionStatusEnum;
  tokenId: string;
}> = ({
  dc,
  descriptorId,
  handleClose,
  platform,
  portNumber,
  sessionID,
  status,
  tokenId,
}) => {
  const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);
  const [openVusbGui, setOpenVusbGui] = useState(false);
  // @ts-ignore
  const dcEndpoint = LOCATION[dc.toUpperCase()].endpoint;
  const credentialsUrl = `https://accounts.saucelabs.com/am/XUI/?region=${dcEndpoint}&next=/live/mobile/dataCenters/${dc.toUpperCase()}/devices/${descriptorId}/shared/${sessionID}`;
  // The shared link is created below, there is a diff for EU and US
  // EU: https://app.eu-central-1.saucelabs.com/live/mobile/dataCenters/US/devices/{deviceID}/shared/{sessionId}
  // US: https://app.saucelabs.com/live/mobile/dataCenters/US/devices/{deviceID}/shared/{sessionId}
  // So we need to have a different shared link for EU and US
  const sharedLinkEndpoint = dc.toUpperCase() === 'EU' ? `${dcEndpoint}.` : '';
  const sharedLink = `https://app.${sharedLinkEndpoint}saucelabs.com/live/mobile/dataCenters/${dc.toUpperCase()}/devices/${descriptorId}/shared`;
  const ssoUrl = `${sharedLink}/${sessionID}`;
  const guiUrl = `${sharedLink}/?sessionId=${sessionID}&platform=${platform}&dc=${dc}&portNumber=${portNumber}&status=${status}`;
  const handleCopy = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsCopiedToClipboard(true);
    navigator.clipboard.writeText(
      e.currentTarget.getAttribute('data-url') as string
    );
    setTimeout(() => {
      setIsCopiedToClipboard(false);
    }, 2000);
  };
  const closeVusbGuiModal = () => setOpenVusbGui(false);
  const openManualSessionWindow = () => {
    closeVusbGuiModal();
    window.open(guiUrl);
    handleClose();
  };
  const openVusbGuiModal = () => {
    setOpenVusbGui(true);
    if (tokenId) {
      openManualSessionWindow();
    }
  };

  return (
    <div className={Styles.background}>
      <div className={Styles.cardContainer}>
        {openVusbGui && !tokenId ? (
          <Login
            handleClose={closeVusbGuiModal}
            handleProceed={openManualSessionWindow}
          />
        ) : (
          <>
            <div className={Styles.closeButton} onClick={handleClose}>
              <CloseIconButton />
            </div>
            <div className={Styles.column}>
              <span className={Styles.title}>Open in Sauce Labs</span>
              <span className={Styles.text}>
                The manual session will be opened in your default browser. If
                you haven&#39;t signed in yet it will redirect you to sign in.
              </span>
              <span className={`${Styles.text} ${Styles.note}`}>
                <strong>NOTE:</strong>
                <br /> You can only use this option if you normally sign in with
                your credentials.
                <br />
                SSO users need to select the <em>OPEN WITH SSO</em> option.
              </span>
              <div className={Styles.alignBottom}>
                <SubmitButton
                  label="Open in Sauce Labs"
                  onClick={() => {
                    window.open(credentialsUrl, '_blank');
                    handleClose();
                  }}
                />
              </div>
            </div>
            <div className={Styles.column}>
              <span className={Styles.title}>Open with SSO</span>
              <span className={Styles.text}>
                This option is for <strong>SSO users only</strong>.
              </span>
              <span className={`${Styles.text} ${Styles.note}`}>
                <strong>NOTE:</strong>
                <br /> An easy option is not available yet. You now need to:
                <ul>
                  <li>copy the url</li>
                  <li>sign in to Sauce Labs with your SSO provider</li>
                  <li>paste the url into the browser</li>
                </ul>
              </span>
              <div
                className={Styles.alignBottom}
                data-url={ssoUrl}
                onClick={handleCopy}
              >
                <div className={Styles.copyToClipboardContainer}>
                  {!isCopiedToClipboard && (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      className={Styles.copyToClipboardIcon}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.5 0C15.3284 0 16 0.671573 16 1.5V4H22C23.1046 4 24 4.89543 24 6V22C24 23.1046 23.1046 24 22 24H10C8.89543 24 8 23.1046 8 22V20H1.5C0.671572 20 0 19.3284 0 18.5V5.34711C0 4.93755 0.167468 4.5458 0.463528 4.2628L4.4882 0.415691C4.76731 0.148892 5.13856 0 5.52467 0H14.5ZM22 6V22H10V11.2H14.9999C15.2652 11.2 15.5195 11.0946 15.707 10.9071C15.8946 10.7195 15.9999 10.4652 15.9999 10.2V6H22ZM13.9999 6H13.7252L10.3775 9.19997H13.9999V6Z"
                      />
                    </svg>
                  )}
                  <div className={Styles.copyToClipboardText}>
                    {isCopiedToClipboard
                      ? 'Copied to the clipboard!'
                      : 'Copy url'}
                  </div>
                </div>
              </div>
            </div>
            <div className={Styles.column}>
              <span className={Styles.title}>Open in this Gui</span>
              <span className={Styles.text}>
                The manual session will be opened in a new Virtual USB window.
                You might be asked to login with your credentials to be able to
                interact with the device.
              </span>
              <span className={`${Styles.text} ${Styles.note}`}>
                <strong>NOTE:</strong>
                <br /> You can only use this option if you normally sign in with
                your credentials.
                <br />
                SSO users need to select the <em>OPEN WITH SSO</em> option.
              </span>
              <div className={Styles.alignBottom}>
                <SubmitButton
                  label="Open in this GUI"
                  onClick={openVusbGuiModal}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OpenManualTestModal;
