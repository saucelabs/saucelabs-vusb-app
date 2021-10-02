import React from 'react';
import CloseIcon from '../components/CloseIcon';
import ServerMonitor from './components/ServerMonitor';

interface VusbMonitorInterface {
  clearLogs: () => void;
  logLines: string[];
  serverError: boolean;
  serverStatus: string;
  toggleVusbServerMonitor: () => void;
}

const VusbServerMonitor: React.FC<VusbMonitorInterface> = ({
  clearLogs,
  logLines,
  serverError,
  serverStatus,
  toggleVusbServerMonitor,
}) => {
  return (
    <ServerMonitor
      clearLogs={clearLogs}
      serverError={serverError}
      logLines={logLines}
      serverStatus={serverStatus}
      headerRightComponent={<CloseIcon onClick={toggleVusbServerMonitor} />}
    />
  );
};

export default VusbServerMonitor;
