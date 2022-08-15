import React, { useState } from 'react';
import Styles from './Slide.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import accessKeyImage from '../../assets/images/accessKey.gif';
import Input, { InputType } from '../Input';

const AccessKey: React.FC = () => {
  const settingsData = window.electron.store.get();
  const [value, setValue] = useState('');
  const updateAccessKey = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);
  const storeAccessKey = () => {
    window.electron.store.set({
      ...settingsData,
      connection: {
        ...settingsData.connection,
        accessKey: value,
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
            <br />
            <em>Sauce Labs Dashboard &gt; Top Menu &gt; Access Key</em>.
          </span>
          <div className={Styles.inputContainer}>
            <Input
              value={value}
              name="accessKey"
              onChange={updateAccessKey}
              onBlur={storeAccessKey}
              type={InputType.PASSWORD}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessKey;
