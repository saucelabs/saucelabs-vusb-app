import {
  ServerActionEnum,
  ServerStartCollectionTypes,
} from '../../types/ServerTypes';

/**
 * Trigger the server to start
 */
function vusbServerStartAction(log: string) {
  return {
    log,
    type: ServerActionEnum.VUSB_START,
  };
}

/**
 * The server is starting up
 */
function vusbServerStartingAction(log: string) {
  return {
    log,
    type: ServerActionEnum.VUSB_STARTING,
  };
}

/**
 * The server is running
 */
function vusbServerRunningAction(log: string) {
  return {
    log,
    type: ServerActionEnum.VUSB_RUNNING,
  };
}

/**
 * There was an error with the server
 */
function vusbServerErrorAction(log: string) {
  return {
    log,
    type: ServerActionEnum.VUSB_ERROR,
  };
}

/**
 * The server was asked to stop
 */
function vusbServerStopAction(log: string) {
  return {
    log,
    type: ServerActionEnum.VUSB_STOP,
  };
}

/**
 * The server is stopping
 */
function vusbServerStoppingAction(log: string) {
  return {
    log,
    type: ServerActionEnum.VUSB_STOPPING,
  };
}

/**
 * The server stopped
 */
function vusbServerStoppedAction(log: string) {
  return {
    log,
    type: ServerActionEnum.VUSB_STOPPED,
  };
}

/**
 * The server is back to idle
 */
function vusbServerIdleAction(log: string) {
  return {
    log,
    type: ServerActionEnum.VUSB_IDLE,
  };
}

/**
 * Clear the logs
 */
function vusbServerClearLogsAction() {
  return {
    type: ServerActionEnum.CLEAR_SERVER_LOGS,
  };
}

/**
 * Log data about the ADB commands
 */
function vusbServerLogAdbAction(log: string) {
  return {
    log,
    type: ServerActionEnum.VUSB_ADB_LOG,
  };
}

function vusbServerStartActions({
  dispatch,
  logLine,
  status,
}: ServerStartCollectionTypes) {
  switch (status) {
    case ServerActionEnum.VUSB_ERROR:
      dispatch(vusbServerErrorAction(logLine));
      break;
    case ServerActionEnum.VUSB_IDLE:
      dispatch(vusbServerIdleAction(logLine));
      break;
    case ServerActionEnum.VUSB_RUNNING:
      dispatch(vusbServerRunningAction(logLine));
      break;
    case ServerActionEnum.VUSB_START:
      dispatch(vusbServerStartAction(logLine));
      break;
    case ServerActionEnum.VUSB_STARTING:
      dispatch(vusbServerStartingAction(logLine));
      break;
    case ServerActionEnum.VUSB_STOP:
      dispatch(vusbServerStopAction(logLine));
      break;
    case ServerActionEnum.VUSB_STOPPED:
      dispatch(vusbServerStoppedAction(logLine));
      break;
    case ServerActionEnum.VUSB_STOPPING:
      dispatch(vusbServerStoppingAction(logLine));
      break;
    default:
    // ignore
  }
}

export {
  vusbServerClearLogsAction,
  vusbServerLogAdbAction,
  vusbServerStartActions,
  vusbServerStopAction,
};
