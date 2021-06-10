import React from 'react';
import ServerButtons from '../components/ServerButtons';
import CloseIcon from '../components/CloseIcon';
import ServerMonitor from './components/ServerMonitor';

interface VusbMonitorInterface {
  clearLogs: () => void;
  logLines: string[];
  serverError: boolean;
  serverStatus: string;
  startVusbServer: () => void;
  stopVusbServer: () => void;
  toggleVusbServerMonitor: () => void;
}

const VusbServerMonitor: React.FC<VusbMonitorInterface> = ({
  clearLogs,
  logLines,
  serverError,
  serverStatus,
  startVusbServer,
  stopVusbServer,
  toggleVusbServerMonitor,
}) => {
  return (
    <ServerMonitor
      clearLogs={clearLogs}
      serverError={serverError}
      logLines={logLines}
      serverStatus={serverStatus}
      headerRightComponent={
        <ServerButtons
          serverError={serverError}
          serverStatus={serverStatus}
          disableShowMonitor
          startVusbServer={startVusbServer}
          stopVusbServer={stopVusbServer}
          toggleVusbServerMonitor={toggleVusbServerMonitor}
          afterComponent={<CloseIcon onClick={toggleVusbServerMonitor} />}
        />
      }
    />
  );
};

export default VusbServerMonitor;
