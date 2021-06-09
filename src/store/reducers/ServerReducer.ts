import {
  ServerActionTypes as ACTIONS,
  VUSB_SERVER_STATUS,
} from '../actions/ServerActions';
import { ServerActionType, ServerStateType } from '../../types/ServerTypes';
import { trimLogArray } from '../../utils/Helpers';

const initialServerState: ServerStateType = {
  status: VUSB_SERVER_STATUS.IDLE,
  log: [],
  error: false,
  showMonitor: false,
};
const serverReducer = (
  state: ServerStateType = initialServerState,
  action: ServerActionType
) => {
  const { log, showMonitor } = state;
  const logLineArray =
    'log' in action
      ? action.log.split('\n').filter((entry: string) => entry)
      : [];

  switch (action.type) {
    case ACTIONS.VUSB_START:
      return {
        ...state,
        status: VUSB_SERVER_STATUS.STARTING,
        log: trimLogArray(log.concat(logLineArray)),
        error: false,
      };
    case ACTIONS.VUSB_STARTING:
      return {
        ...state,
        status: VUSB_SERVER_STATUS.STARTED,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_RUNNING:
      return {
        ...state,
        status: VUSB_SERVER_STATUS.RUNNING,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_ERROR:
      return {
        ...state,
        status: VUSB_SERVER_STATUS.ERROR,
        log: trimLogArray(log.concat(logLineArray)),
        error: true,
      };
    case ACTIONS.VUSB_STOP:
      return {
        ...state,
        status: VUSB_SERVER_STATUS.STOP,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_STOPPING:
      return {
        ...state,
        status: VUSB_SERVER_STATUS.STOPPING,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_STOPPED:
      return {
        ...state,
        status: VUSB_SERVER_STATUS.STOPPED,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_IDLE:
      return {
        ...state,
        status: VUSB_SERVER_STATUS.IDLE,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_MONITOR_TOGGLE:
      return {
        ...state,
        showMonitor: !showMonitor,
      };
    case ACTIONS.VUSB_ADB_LOG:
      return {
        ...state,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.CLEAR_SERVER_LOGS:
      return {
        ...state,
        log: [],
      };
    default:
      return state;
  }
};

export { initialServerState, serverReducer };
