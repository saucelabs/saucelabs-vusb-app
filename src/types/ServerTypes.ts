enum ServerActionEnum {
  VUSB_START = 'VUSB_START',
  VUSB_STARTING = 'VUSB_STARTING',
  VUSB_RUNNING = 'VUSB_RUNNING',
  VUSB_ADB_LOG = 'VUSB_ADB_LOG',
  VUSB_ERROR = 'VUSB_ERROR',
  VUSB_STOP = 'VUSB_STOP',
  VUSB_STOPPING = 'VUSB_STOPPING',
  VUSB_STOPPED = 'VUSB_STOPPED',
  VUSB_IDLE = 'VUSB_IDLE',
  CLEAR_SERVER_LOGS = 'CLEAR_SERVER_LOGS',
}

type ServerStateType = {
  status: ServerActionEnum;
  log: string[];
  error: boolean;
};

type ServerActionType =
  | { type: ServerActionEnum.VUSB_START; log: string }
  | { type: ServerActionEnum.VUSB_STARTING; log: string }
  | { type: ServerActionEnum.VUSB_RUNNING; log: string }
  | { type: ServerActionEnum.VUSB_ERROR; log: string }
  | { type: ServerActionEnum.VUSB_STOP; log: string }
  | { type: ServerActionEnum.VUSB_STOPPING; log: string }
  | { type: ServerActionEnum.VUSB_STOPPED; log: string }
  | { type: ServerActionEnum.VUSB_IDLE; log: string }
  | { type: ServerActionEnum.VUSB_ADB_LOG; log: string }
  | { type: ServerActionEnum.CLEAR_SERVER_LOGS };

export { ServerActionType, ServerActionEnum, ServerStateType };
