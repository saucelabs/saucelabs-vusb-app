import { ServerActionTypes as ACTIONS } from '../store/actions/ServerActions';

type ServerStateType = {
  status: string;
  log: string[];
  error: boolean;
  showMonitor: boolean;
};
type ServerActionType =
  | { type: ACTIONS.VUSB_START; log: string }
  | { type: ACTIONS.VUSB_STARTING; log: string }
  | { type: ACTIONS.VUSB_RUNNING; log: string }
  | { type: ACTIONS.VUSB_ERROR; log: string }
  | { type: ACTIONS.VUSB_STOP; log: string }
  | { type: ACTIONS.VUSB_STOPPING; log: string }
  | { type: ACTIONS.VUSB_STOPPED; log: string }
  | { type: ACTIONS.VUSB_IDLE; log: string }
  | { type: ACTIONS.VUSB_ADB_LOG; log: string }
  | { type: ACTIONS.VUSB_MONITOR_TOGGLE }
  | { type: ACTIONS.CLEAR_SERVER_LOGS };

export { ServerActionType, ServerStateType };
