import React, { useState } from 'react';
import Styles from './Slide.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import accessKeyImage from '../../assets/images/accessKey.gif';
import Input, { InputType } from '../Input';

const AccessKey: React.FC = () => {
  const settingsData = window.electron.store.get();
  const [accessKey, setAccessKey] = useState('');
  const [isError, setIsError] = useState(false);
  const updateAccessKey = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAccessKey(event.target.value);
  const storeAccessKey = () => {
    if (!accessKey) {
      return setIsError(true);
    }

    setIsError(false);
    return window.electron.store.set({
      ...settingsData,
      connection: {
        ...settingsData.connection,
        accessKey,
      },
    });
  };

  return (
    <>
      <div className={Styles.slideTop}>
        <img alt="Copy accessKey" src={accessKeyImage} />
      </div>
      <div className={Styles.slideBottom}>
        <div className={Styles.textContainer}>
          <span className={Styles.textContainerTitle}>Access Key</span>
          <span>
            Please provide your access key. You can easily get this from
            <em>Sauce Labs Dashboard &gt; Top Menu &gt; Access Key</em>.
          </span>
          <div className={Styles.inputContainer}>
            <Input
              value={accessKey}
              name="accessKey"
              onChange={updateAccessKey}
              onBlur={storeAccessKey}
              type={InputType.PASSWORD}
              error={isError}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessKey;
