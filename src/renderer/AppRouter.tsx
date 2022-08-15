import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DevicesOverview from './screens/DevicesOverview';
import { ROUTES } from './utils/Constants';
import Requirements from './screens/Requirements';
import Settings from './screens/Settings';
import VusbServerMonitor from './screens/VusbServerMonitor';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.DEVICES} element={<DevicesOverview />} />
      <Route path={ROUTES.REQUIREMENTS} element={<Requirements />} />
      <Route path={ROUTES.SERVER_MONITOR} element={<VusbServerMonitor />} />
      <Route path={ROUTES.SETTINGS} element={<Settings />} />
    </Routes>
  );
};

export default AppRouter;
