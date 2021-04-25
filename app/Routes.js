import React from 'react';
import { Route, Switch } from 'react-router';
import App from './containers/App';
import Settings from './settings';
import Devices from './devices';
import Home from './home/Home';
import Login from './login';

export const ROUTES = {
  HOME: '/home',
  SETTINGS: '/settings',
  TEMP: '/temp',
  DEVICES: '/devices',
  LOGIN: '/'
};

export default () => (
  <App>
    <div className="routes">
      <Switch>
        <Route exact path={ROUTES.LOGIN} component={Login} />
        <Route path={ROUTES.HOME} component={Home} />
        <Route path={ROUTES.SETTINGS} component={Settings} />
        <Route path={ROUTES.DEVICES} component={Devices} />
      </Switch>
    </div>
  </App>
);
