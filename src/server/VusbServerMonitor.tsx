import React, { useContext } from 'react';
import CloseIconButton from '../components/buttons/CloseIconButton';
import ServerMonitor from './components/ServerMonitor';
import { StoreContext } from '../store/Store';
import { vusbServerClearLogsAction } from '../store/actions/ServerActions';

const VusbServerMonitor: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const {
    server: { error: vusbError, log: vusbLogs, status: vusbStatus },
  } = state;

  return (
    <ServerMonitor
      clearLogs={() => dispatch(vusbServerClearLogsAction())}
      serverError={vusbError}
      logLines={vusbLogs}
      serverStatus={vusbStatus}
      headerRightComponent={<CloseIconButton />}
    />
  );
};

export default VusbServerMonitor;
