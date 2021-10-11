import React, { useState } from 'react';
import Styles from './Slide.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import safariToolBar from '../../assets/images/safari-toolbar.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import username from '../../assets/images/username.gif';
import Input, { InputType } from '../../components/Input';
import {
  getGenericStorage,
  setGenericStorage,
} from '../../settings/SettingsStorage';

const UsernameSlide: React.FC = () => {
  const storageData = getGenericStorage();
  const [value, setValue] = useState('');
  const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);
  const storeUsername = () => {
    setGenericStorage({
      ...storageData,
      connection: {
        ...storageData.connection,
        username: value,
      },
    });
  };

  return (
    <>
      <div className={Styles.slideTop}>
        <img alt="Copy username" src={safariToolBar} width={500} />
        <img alt="Copy username" src={username} />
      </div>
      <div className={Styles.slideBottom}>
        <div className={Styles.textContainer}>
          <span className={Styles.textContainerTitle}>Username</span>
          <div className={Styles.inputContainer}>
            <Input
              value={value}
              name="username"
              onChange={updateUsername}
              onBlur={storeUsername}
              type={InputType.TEXT}
            />
          </div>
          <span>
            This should be equal to your
            <br />
            <em>Sauce Labs Username</em>.
          </span>
        </div>
      </div>
    </>
  );
};

export default UsernameSlide;
