enum ChannelsEnum {
  ELECTRON_STORE_GET = 'electron-store-get',
  ELECTRON_STORE_SET = 'electron-store-set',
  DEVICE_START = 'device-start',
  DEVICE_STOP = 'device-stop',
  MAIN_THREAD = 'main-thread',
  MANUAL_SESSION_CLOSE = 'manual-session-close',
  SELECT_DIRECTORY = 'select-directory',
  SYSTEM_CHECKS = 'system-checks',
  VUSB_SERVER_START = 'vusb-server-start',
  VUSB_SERVER_STOP = 'vusb-server-stop',
}

type DialogType = {
  cancelled: boolean;
  filePaths: string[];
};

export { ChannelsEnum, DialogType };
