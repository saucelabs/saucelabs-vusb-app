import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DevicesOverview from './devices/DevicesOverview';
import Requirements from './requirements/Requirements';
import Settings from './settings/Settings';
import { ROUTES } from './utils/Constants';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path={ROUTES.SETTINGS} component={Settings} />
      <Route path={ROUTES.DEVICES} component={DevicesOverview} />
      <Route path={ROUTES.REQUIREMENTS} component={Requirements} />
    </Switch>
  );
};

export default Routes;
