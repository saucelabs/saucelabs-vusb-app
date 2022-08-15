/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useState } from 'react';
import authenticate from '../../api/AuthenticateAPI';
import { StoreContext } from '../../Store';
import Button from '../buttons/Button';
import CloseIconButton from '../buttons/CloseIconButton';
import Input, { InputType } from '../Input';
import Styles from './Login.module.css';
import Notification, { NotificationsEnum } from '../Notification';
import { AuthenticationErrorType } from '../../../types/AuthenticationTypes';

const Login: React.FC<{
  handleClose: () => void;
  handleProceed: () => void;
}> = ({ handleClose, handleProceed }) => {
  const {
    connection: { username: knownUsername },
  } = window.electron.store.get();
  const { dispatch } = useContext(StoreContext);
  const [username, setUsername] = useState(knownUsername);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const verifyError = async (data: string | AuthenticationErrorType) => {
    if (data && typeof data !== 'string' && data?.status !== 200) {
      setIsError(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsError(false);
      }, 3000);

      return true;
    }

    setIsLoading(false);

    return false;
  };
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let result;
    let isSignInError;
    setIsLoading(true);

    try {
      if (password) {
        result = await authenticate({ dispatch, password, username });
        isSignInError = await verifyError(result);
      }
      // Successful sign in
      if (!isSignInError) {
        setIsLoading(false);
        handleProceed();
      }
    } catch (ign) {
      // Ignore
    }
  };

  return (
    <>
      <div className={Styles.closeButton} onClick={handleClose}>
        <CloseIconButton />
      </div>
      {isError && (
        <Notification
          dismissible={false}
          type={NotificationsEnum.ERROR}
          title="Error"
        >
          <span>Username/password combination is invalid.</span>
        </Notification>
      )}
      <form className={Styles.loginForm} onSubmit={handleFormSubmit}>
        <h3 className={Styles.loginTitle}>Sign in</h3>
        <div className={Styles.formGroup}>
          <Input
            value={username}
            placeholder="Username"
            name="username"
            onChange={handleUsernameChange}
            type={InputType.TEXT}
          />
        </div>
        <div className={Styles.formGroup}>
          <Input
            placeholder="Password"
            name="password"
            type={InputType.PASSWORD}
            onChange={handlePasswordChange}
            value={password}
          />
        </div>
        <Button label="Log in" disabled={!username || !password || isLoading} />
        <div className={Styles.loginReset}>
          <span>Fill in your Sauce Labs username and password.</span>
          <br />
          <span>
            Forgot your password?{' '}
            <button
              className={Styles.buttonLink}
              onClick={() =>
                window.open(
                  'https://accounts.saucelabs.com/am/XUI/?#passwordReset/',
                  '_blank'
                )
              }
              type="button"
            >
              Reset here
            </button>
          </span>
        </div>
      </form>
    </>
  );
};

export default Login;
