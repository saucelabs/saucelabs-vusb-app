import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DevicesOverview from './devices/DevicesOverview';
import Settings from './settings/Settings';
import { ROUTES } from './utils/Constants';
import Requirements from './requirements/Requirements';
import VusbServerMonitor from './server/VusbServerMonitor';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path={ROUTES.DEVICES} component={DevicesOverview} />
      <Route path={ROUTES.REQUIREMENTS} component={Requirements} />
      <Route path={ROUTES.SERVER_MONITOR} component={VusbServerMonitor} />
      <Route path={ROUTES.SETTINGS} component={Settings} />
      <Route component={DevicesOverview} />
    </Switch>
  );
};

export default Routes;
