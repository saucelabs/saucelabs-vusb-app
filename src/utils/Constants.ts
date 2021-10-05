import { version as APP_VERSION } from '../../package.json';
import { StorageInterface } from '../store/StorageInterfaces';

interface DefaultSettingsInterface {
  [key: string]: StorageInterface;
}
interface LocationInterface {
  [key: string]: {
    label: string;
    value: string;
    endpoint: string;
  };
}

// Maximum amount of logs to keep in memory
const MAX_LOG_LINES = 10000;
const MOBILE_OS = {
  ANDROID: 'ANDROID',
  IOS: 'IOS',
};
const STORAGE_FILE_NAME = 'saucelabs-up-vusb-config-v2';
const DEFAULT_SETTINGS: DefaultSettingsInterface = {
  generic: {
    connection: {
      username: '',
      accessKey: '',
      location: 'eu',
    },
    proxy: {
      host: '',
      port: undefined,
      username: '',
      password: '',
    },
    server: {
      adbPortMin: 7000,
      adbPortRange: 100,
      autoAdbConnect: true,
      host: 'http://127.0.0.1',
      logsToFile: false,
      logsPath: '',
      port: 33657,
      verboseLogs: false,
    },
    device: {
      proxy: {
        host: '',
        port: undefined,
        username: '',
        password: '',
      },
    },
  },
};
const SERVER_LOGS = 'server.log';
const VUSB_SERVER_NAME = 'virtual-usb-client.jar';
const LOCATION: LocationInterface = {
  EU: {
    label: 'EU',
    value: 'eu',
    endpoint: 'eu-central-1',
  },
  US: {
    label: 'US',
    value: 'us',
    endpoint: 'us-west-1',
  },
} as const;

export {
  APP_VERSION,
  DEFAULT_SETTINGS,
  LOCATION,
  MAX_LOG_LINES,
  MOBILE_OS,
  SERVER_LOGS,
  STORAGE_FILE_NAME,
  VUSB_SERVER_NAME,
};
