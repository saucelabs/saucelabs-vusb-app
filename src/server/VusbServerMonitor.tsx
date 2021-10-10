import React from 'react';
import CloseIconButton from '../components/buttons/CloseIconButton';
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
      headerRightComponent={
        <CloseIconButton onClick={toggleVusbServerMonitor} />
      }
    />
  );
};

export default VusbServerMonitor;
