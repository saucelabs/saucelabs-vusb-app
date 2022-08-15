import { trimLogArray } from '../utils/Helpers';
import {
  ServerActionEnum as ACTIONS,
  ServerActionEnum,
  ServerActionType,
  ServerStateType,
} from '../../types/ServerTypes';

const initialServerState: ServerStateType = {
  status: ServerActionEnum.VUSB_IDLE,
  log: [],
  error: false,
};
const serverReducer = (
  state: ServerStateType = initialServerState,
  action: ServerActionType
) => {
  const { log } = state;
  const logLine = 'log' in action ? action.log : '';
  const logLineArray = logLine.includes('\n')
    ? logLine.split('\n').filter((entry: string) => entry)
    : [logLine];

  switch (action.type) {
    case ACTIONS.VUSB_START:
      return {
        ...state,
        status: ServerActionEnum.VUSB_START,
        log: trimLogArray(log.concat(logLineArray)),
        error: false,
      };
    case ACTIONS.VUSB_STARTING:
      return {
        ...state,
        status: ServerActionEnum.VUSB_STARTING,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_RUNNING:
      return {
        ...state,
        status: ServerActionEnum.VUSB_RUNNING,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_ERROR:
      return {
        ...state,
        status: ServerActionEnum.VUSB_ERROR,
        log: trimLogArray(log.concat(logLineArray)),
        error: true,
      };
    case ACTIONS.VUSB_STOP:
      return {
        ...state,
        status: ServerActionEnum.VUSB_STOP,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_STOPPING:
      return {
        ...state,
        status: ServerActionEnum.VUSB_STOPPING,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_STOPPED:
      return {
        ...state,
        status: ServerActionEnum.VUSB_STOPPED,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_IDLE:
      return {
        ...state,
        status: ServerActionEnum.VUSB_IDLE,
        log: trimLogArray(log.concat(logLineArray)),
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
