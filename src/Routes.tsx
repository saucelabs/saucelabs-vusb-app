import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './home/Home';
import Settings from './settings/Settings';
import DevicesOverview from './devices/DevicesOverview';
import { ROUTES } from './utils/Constants';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path={ROUTES.SETTINGS} component={Settings} />
      <Route path={ROUTES.DEVICES} component={DevicesOverview} />
      <Route path={ROUTES.HOME} component={Home} />
    </Switch>
  );
};

export default Routes;
