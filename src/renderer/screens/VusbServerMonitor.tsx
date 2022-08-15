import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { vusbServerClearLogsAction } from 'renderer/actions/ServerActions';
import ServerMonitor from 'renderer/components/server/ServerMonitor';
import { StoreContext } from 'renderer/Store';
import { ROUTES } from 'renderer/utils/Constants';
import CloseIconButton from '../components/buttons/CloseIconButton';

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
      headerRightComponent={
        <Link to={ROUTES.DEVICES} replace>
          <CloseIconButton />
        </Link>
      }
    />
  );
};

export default VusbServerMonitor;
