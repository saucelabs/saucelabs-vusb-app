// eslint-disable-next-line global-require
export const APP_VERSION = require('../../package').version;

export const MOBILE_OS = {
  ANDROID: 'ANDROID',
  IOS: 'IOS'
};
export const STORAGE_FILE_NAME = 'saucelabs-up-vusb-config';
export const DEFAULT_SETTINGS = {
  generic: {
    connection: {
      username: '',
      access_key: '',
      location: 'eu'
    },
    proxy: {
      host: '',
      port: '',
      username: '',
      password: ''
    },
    server: {
      adb_port_min: '7000',
      adb_port_range: '100',
      auto_adb_connect: true,
      verbose_logs: false,
      host: 'http://127.0.0.1',
      logs_to_file: false,
      logs_path: '',
      port: '33657'
    },
    device: {
      proxy: {
        host: '',
        port: '',
        username: '',
        password: ''
      }
    }
  }
};
export const SERVER_LOGS = 'server.log';
export const VUSB_SERVER_VERSION = 'virtual-usb-client-2.0.0.jar';
export const LOCATION = {
  EU: {
    label: 'EU',
    value: 'eu',
    endpoint: 'eu-central-1'
  },
  US: {
    label: 'US',
    value: 'us',
    endpoint: 'us-west-1'
  }
};
export const DATA_CENTER_URLS = {
  us: 'us-west-1',
  eu: 'eu-central-1'
};
