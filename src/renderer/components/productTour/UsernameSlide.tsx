import React, { useState } from 'react';
import Styles from './Slide.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import usernameImage from '../../assets/images/username.gif';
import Input, { InputType } from '../Input';

const UsernameSlide: React.FC = () => {
  const settingsData = window.electron.store.get();
  const [username, setUsername] = useState('');
  const [isError, setIsError] = useState(false);
  const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(event.target.value);
  const storeUsername = () => {
    if (!username) {
      return setIsError(true);
    }
    setIsError(false);
    return window.electron.store.set({
      ...settingsData,
      connection: {
        ...settingsData.connection,
        username,
      },
    });
  };

  return (
    <>
      <div className={Styles.slideTop}>
        <img alt="Copy username" src={usernameImage} width={600} />
      </div>
      <div className={Styles.slideBottom}>
        <div className={Styles.textContainer}>
          <span className={Styles.textContainerTitle}>Username</span>
          <span>
            Please provide your username. You can easily get this from
            <br />
            <em>Sauce Labs Dashboard &gt; Top Menu &gt; Username</em>.
          </span>
          <div className={Styles.inputContainer}>
            <Input
              value={username}
              name="username"
              onChange={updateUsername}
              onBlur={storeUsername}
              type={InputType.TEXT}
              error={isError}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UsernameSlide;
