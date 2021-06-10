import { ServerStateInterface } from '../../server/ServerInterfaces';
import { trimLogArray } from '../../utils/Helpers';
import {
  ServerActionType,
  ServerActionEnum as ACTIONS,
  VusbServerStatusEnum,
} from '../../server/ServerTypes';

const initialServerState: ServerStateInterface = {
  status: VusbServerStatusEnum.IDLE,
  log: [],
  error: false,
  showMonitor: false,
};
const serverReducer = (
  state: ServerStateInterface = initialServerState,
  action: ServerActionType
) => {
  const { log, showMonitor } = state;
  const actionLog = 'log' in action ? action.log : '';
  const logLine =
    typeof actionLog === 'string'
      ? actionLog
      : new TextDecoder('utf-8').decode(actionLog);
  const logLineArray =
    logLine.length > 0
      ? logLine.split('\n').filter((entry: string) => entry)
      : [];

  switch (action.type) {
    case ACTIONS.VUSB_START:
      return {
        ...state,
        status: VusbServerStatusEnum.STARTING,
        log: trimLogArray(log.concat(logLineArray)),
        error: false,
      };
    case ACTIONS.VUSB_STARTING:
      return {
        ...state,
        status: VusbServerStatusEnum.STARTED,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_RUNNING:
      return {
        ...state,
        status: VusbServerStatusEnum.RUNNING,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_ERROR:
      return {
        ...state,
        status: VusbServerStatusEnum.ERROR,
        log: trimLogArray(log.concat(logLineArray)),
        error: true,
      };
    case ACTIONS.VUSB_STOP:
      return {
        ...state,
        status: VusbServerStatusEnum.STOP,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_STOPPING:
      return {
        ...state,
        status: VusbServerStatusEnum.STOPPING,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_STOPPED:
      return {
        ...state,
        status: VusbServerStatusEnum.STOPPED,
        log: trimLogArray(log.concat(logLineArray)),
      };
    case ACTIONS.VUSB_IDLE:
      return {
        ...state,
        status: VusbServerStatusEnum.IDLE,
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
