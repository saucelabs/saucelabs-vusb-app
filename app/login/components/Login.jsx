// @flow
import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {shell} from "electron";
import Input from "../../components/Input";
import Button from "../../components/Button";
import LogoSL from "../../assets/images/sauce-white-logo-small-color.png";
import VersionContainer from '../../components/Version'
import ChecksContainer from "../../components/Checks";
import {ROUTES} from "../../Routes";
import Styles from './Login.styles.css';
import Notification, {NOTIFICATIONS} from "../../components/Notification";
import {API_STATUS} from "../../devices/duck/actions";
import Tabs from "../../components/Tabs";
import {getGuiVersions} from "../../helpers/utils";
import {APP_VERSION} from "../../helpers/constants";

type Props = {
  authenticate: () => void,
  getUserInfo: () => void,
  username: string,
};

export default class Login extends Component<Props> {
  props: Props;

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      username: props.username || '',
      password: '',
      cookie: '',
      isLoading: false,
      isLoggedIn: false,
      isError: false,
      // For the updates
      versionUpdate: false,
      versionDeprecated: false,
    }
    this.closeNotification = null;
    this.handleCookieChange = this.handleCookieChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.verifyError = this.verifyError.bind(this);
  }

  async componentDidMount() {
    try {
      const {update, deprecated} = await getGuiVersions();
      this.setState({
        versionUpdate: update,
        versionDeprecated: deprecated,
      });
    } catch (ign) {
      // Do nothing, this is not blocking
    }
  }

  async handleFormSubmit() {
    event.preventDefault();
    const {authenticate, getUserInfo} = this.props;
    const {cookie, username, password} = this.state;

    this.setState({isLoading: true});
    let result;
    let isSignInError;

    try {
      // If signed in with a password
      if (password) {
        result = await authenticate({username, password});
        isSignInError = await this.verifyError(result);
      }

      // If signed in with password or SSO Cookie
      if (!isSignInError) {
        result = await getUserInfo({cookie_or_key: cookie, user: username});
        isSignInError = await this.verifyError(result);
      }

      // Successful sign in
      if (!isSignInError) {
        this.setState({
          isLoading: false,
          isLoggedIn: true,
        });
      }
    } catch (e) {
      //
    }
  }

  async verifyError(data) {
    if (data && data.status === API_STATUS.ERROR) {
      this.setState({
        isError: true
      });
      this.closeNotification = setTimeout(() => {
        this.setState({
          isError: false,
          isLoading: false,
        });
      }, 3000);

      return true;
    }

    this.setState({
      isLoading: false,
    })

    return false
  }

  componentWillUnmount() {
    clearTimeout(this.closeNotification);
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
    // Clear cookie so it will not interfere with normal login
    this.setState({cookie: ''});
  }

  handleCookieChange(event) {
    this.setState({cookie: event.target.value});
    // Clear password so it will not interfere with SSO
    this.setState({password: ''});
  }

  render() {
    const {cookie, username, password, isError, isLoading, isLoggedIn, versionDeprecated, versionUpdate} = this.state;

    return (
      isLoggedIn ? (
        <Redirect to={ROUTES.HOME}/>
      ) : (
        <div className={Styles.wrapper}>
          <div className={Styles['logo_container']}>
            <img src={LogoSL} alt="Sauce Labs Logo"/>
          </div>
          {isError && (
            <Notification type={NOTIFICATIONS.ERROR} floatingTop centerText>
              Username/{password ? 'password' : 'cookie'} combination is invalid.
            </Notification>
          )}
          {versionDeprecated && (
            <div className={Styles.overlay}>
              <Notification type={NOTIFICATIONS.WARNING} floatingCenter centerText
                            customClass={Styles['deprecated_text']}>
                Version <span>{APP_VERSION}</span> has been deprecated!<br/>
                A new version can be downloaded <a
                className={Styles.link}
                onClick={() => shell.openExternal('https://github.com/saucelabs/saucelabs-vusb-app/releases')}
              >
                here
              </a>.
              </Notification>
            </div>
          )}
          {versionUpdate && !versionDeprecated && (
            <Notification type={NOTIFICATIONS.INFO} floatingTop centerText customClass={Styles['deprecated_text']}>
              A new version is available and can be downloaded <a
              className={Styles.link}
              onClick={() => shell.openExternal('https://github.com/saucelabs/saucelabs-vusb-app/releases')}
            >
              here
            </a>.
            </Notification>
          )}
          <div className={Styles.container}>
            <div className={Styles['login_container']}>
              <Tabs>
                <div label='Default' iconClass='fa-sign-in-alt'>
                  <form className={Styles['login_form']} onSubmit={this.handleFormSubmit}>
                    <h3 className={Styles['login-title']}>Sign in (username/password)</h3>
                    <div className={Styles['form-group']}>
                      <Input
                        value={username}
                        placeholder='Username'
                        name="username"
                        onChange={this.handleUsernameChange}
                      />
                    </div>
                    <div className={Styles['form-group']}>
                      <Input
                        placeholder='Password'
                        name="password"
                        password
                        onChange={this.handlePasswordChange}
                        value={password}
                      />
                    </div>
                    <Button label="Log in" disabled={!username || !password || isLoading}/>
                    <div className={Styles['login_reset']}>
                      <span>Fill in your Sauce Labs username and password.</span><br/>
                      <span>Forgot your password? {' '}
                        <a
                          className={Styles.link}
                          onClick={() => shell.openExternal('https://accounts.saucelabs.com/am/XUI/?#passwordReset/')}
                        >
                    Reset here
                  </a>
                  </span>
                    </div>
                  </form>
                </div>
                <div label='SSO' iconClass='fa-key'>
                  <form className={Styles['login_form']} onSubmit={this.handleFormSubmit}>
                    <h3 className={Styles['login-title']}>Sign in (SSO)</h3>
                    <div className={Styles['form-group']}>
                      <Input
                        value={username}
                        placeholder='Username'
                        name="username"
                        onChange={this.handleUsernameChange}
                      />
                    </div>
                    <div className={Styles['form-group']}>
                      <Input
                        placeholder='Access Key/Cookie'
                        name="cookie"
                        onChange={this.handleCookieChange}
                        value={cookie}
                      />
                    </div>
                    <Button
                      label="Log in"
                      disabled={!username || !cookie || isLoading}
                    />
                    <div className={Styles['login_reset']}>
                      <span>This app can't use SSO, but a workaround is to get an Access Key or a Cookie.</span>{' '}
                      <span>Check the following {' '}
                        <a
                          className={Styles.link}
                          onClick={() =>
                            shell.openExternal(
                              'https://github.com/saucelabs/saucelabs-vusb-app/blob/main/docs/SSO.md'
                            )
                          }>
                    link
                  </a>
                        {' '} for more information on both.
                  </span>
                    </div>
                  </form>
                </div>
              </Tabs>
            </div>
            <div className={Styles['right_container']}>
              <VersionContainer/>
            </div>
          </div>
          <div className={Styles['checks-container']}>
            <ChecksContainer/>
          </div>
        </div>
      )
    );
  }
}
