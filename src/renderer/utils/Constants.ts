import { version as APP_VERSION } from '../../../release/app/package.json';

const ROUTES = {
  DEVICES: '/',
  REQUIREMENTS: '/requirements',
  SERVER_MONITOR: '/server_monitor',
  SETTINGS: '/settings',
};
const LOCATION = {
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
// Maximum amount of logs to keep in memory
const MAX_LOG_LINES = 10000;
const SERVER_LOGS = 'server.log';
const VUSB_SERVER_NAME = 'virtual-usb-client.jar';
const MOBILE_OS = {
  ANDROID: 'ANDROID',
  IOS: 'IOS',
};

export enum ApiStatusEnum {
  ERROR = 'ERROR',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
}

export {
  APP_VERSION,
  LOCATION,
  MAX_LOG_LINES,
  MOBILE_OS,
  ROUTES,
  SERVER_LOGS,
  VUSB_SERVER_NAME,
};
