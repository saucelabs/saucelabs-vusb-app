import {
  CLEAR_SERVER_LOGS,
  VUSB_ERROR,
  VUSB_MONITOR_TOGGLE,
  VUSB_RUNNING,
  VUSB_SERVER_STATUS,
  VUSB_START,
  VUSB_STOPPING,
  VUSB_STOP,
  VUSB_STOPPED,
  VUSB_STARTING,
  VUSB_ADB_LOG
} from './actions';

// Maximum amount of logs to keep in memory
const MAX_LOG_LINES = 10000;

const initialState = {
  status: VUSB_SERVER_STATUS.IDLE,
  log: [],
  error: false,
  showMonitor: false
};

export default function vusbServerReducer(state = initialState, action) {
  let logLines;
  const logLineArray = action.log ? action.log.split('\n') : [];

  switch (action.type) {
    case VUSB_START:
      return {
        ...state,
        status: VUSB_SERVER_STATUS.STARTING,
        error: false
      };

    case VUSB_STARTING:
      logLines = state.log.concat(logLineArray);

      // Don't log more than MAX_LOG_LINES
      if (logLines.length > MAX_LOG_LINES) {
        logLines = logLines.slice(logLines.length - MAX_LOG_LINES);
      }

      return {
        ...state,
        status: VUSB_SERVER_STATUS.STARTING,
        log: logLines
      };

    case VUSB_MONITOR_TOGGLE:
      return {
        ...state,
        showMonitor: !state.showMonitor
      };

    case VUSB_RUNNING:
      logLines = state.log.concat(logLineArray);

      // Don't log more than MAX_LOG_LINES
      if (logLines.length > MAX_LOG_LINES) {
        logLines = logLines.slice(logLines.length - MAX_LOG_LINES);
      }

      return {
        ...state,
        status: VUSB_SERVER_STATUS.RUNNING,
        log: logLines
      };

    // @TODO: remove duplications?
    case VUSB_ADB_LOG:
      logLines = state.log.concat(logLineArray);

      // Don't log more than MAX_LOG_LINES
      if (logLines.length > MAX_LOG_LINES) {
        logLines = logLines.slice(logLines.length - MAX_LOG_LINES);
      }

      return {
        ...state,
        status: VUSB_SERVER_STATUS.RUNNING,
        log: logLines
      };

    case CLEAR_SERVER_LOGS:
      return {
        ...state,
        log: []
      };

    case VUSB_ERROR:
      logLines = state.log.concat(logLineArray);

      // Don't log more than MAX_LOG_LINES
      if (logLines.length > MAX_LOG_LINES) {
        logLines = logLines.slice(logLines.length - MAX_LOG_LINES);
      }

      return {
        ...state,
        status: VUSB_SERVER_STATUS.ERROR,
        log: logLines,
        error: true
      };

    case VUSB_STOP:
      logLines = state.log.concat(logLineArray);

      // Don't log more than MAX_LOG_LINES
      if (logLines.length > MAX_LOG_LINES) {
        logLines = logLines.slice(logLines.length - MAX_LOG_LINES);
      }
      return {
        ...state,
        status: VUSB_SERVER_STATUS.STOP,
        log: logLines
      };

    case VUSB_STOPPING:
      logLines = state.log.concat(logLineArray);

      // Don't log more than MAX_LOG_LINES
      if (logLines.length > MAX_LOG_LINES) {
        logLines = logLines.slice(logLines.length - MAX_LOG_LINES);
      }
      return {
        ...state,
        status: VUSB_SERVER_STATUS.STOPPING,
        log: logLines
      };

    case VUSB_STOPPED:
      logLines = state.log.concat(logLineArray);

      // Don't log more than MAX_LOG_LINES
      if (logLines.length > MAX_LOG_LINES) {
        logLines = logLines.slice(logLines.length - MAX_LOG_LINES);
      }
      return {
        ...state,
        status: VUSB_SERVER_STATUS.STOPPED,
        log: logLines
      };

    default:
      return state;
  }
}
