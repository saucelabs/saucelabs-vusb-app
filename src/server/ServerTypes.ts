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
enum VusbServerStatusEnum {
  ERROR = 'ERROR',
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  STOP = 'STOP',
  STARTING = 'STARTING',
  STARTED = 'STARTED',
  STOPPING = 'STOPPING',
  STOPPED = 'STOPPED',
}

type ServerActionType =
  | { type: ServerActionEnum.VUSB_START; log: ArrayBuffer | string }
  | { type: ServerActionEnum.VUSB_STARTING; log: ArrayBuffer | string }
  | { type: ServerActionEnum.VUSB_RUNNING; log: ArrayBuffer | string }
  | { type: ServerActionEnum.VUSB_ERROR; log: ArrayBuffer | string }
  | { type: ServerActionEnum.VUSB_STOP; log: ArrayBuffer | string }
  | { type: ServerActionEnum.VUSB_STOPPING; log: ArrayBuffer | string }
  | { type: ServerActionEnum.VUSB_STOPPED; log: ArrayBuffer | string }
  | { type: ServerActionEnum.VUSB_IDLE; log: ArrayBuffer | string }
  | { type: ServerActionEnum.VUSB_ADB_LOG; log: ArrayBuffer | string }
  | { type: ServerActionEnum.CLEAR_SERVER_LOGS };

export { ServerActionType, ServerActionEnum, VusbServerStatusEnum };
