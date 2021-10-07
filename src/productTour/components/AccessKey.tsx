import React, { useState } from 'react';
import Styles from './Slide.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import safariToolBar from '../../assets/images/safari-toolbar.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import accessKey from '../../assets/images/access-key.gif';
import Input, { InputType } from '../../components/Input';
import {
  getGenericStorage,
  setGenericStorage,
} from '../../settings/SettingsStorage';

const AccessKey: React.FC<{ activeIndex: number; order: number }> = ({
  activeIndex,
  order,
}) => {
  const storageData = getGenericStorage();
  const [value, setValue] = useState('');
  const updateAccessKey = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);
  const storeAccessKey = () => {
    setGenericStorage({
      ...storageData,
      connection: {
        ...storageData.connection,
        accessKey: value,
      },
    });
  };

  return (
    <div
      className={`${Styles.slide} ${
        activeIndex === order ? Styles.active : ''
      }`}
    >
      <div className={Styles.slideTop}>
        <img alt="Copy username" src={safariToolBar} width={500} />
        <img alt="Copy accessKey" src={accessKey} />
      </div>
      <div className={Styles.slideBottom}>
        <div className={Styles.textContainer}>
          <span className={Styles.textContainerTitle}>Access Key</span>
          <div className={Styles.inputContainer}>
            <Input
              value={value}
              name="accessKey"
              onChange={updateAccessKey}
              onBlur={storeAccessKey}
              type={InputType.PASSWORD}
            />
          </div>
          <span>
            This should be equal to your
            <br />
            <em>Sauce Labs Access Key</em>.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccessKey;
