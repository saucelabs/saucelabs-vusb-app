import { ElectronStorageType } from 'types/ElectronStoreTypes';

interface DefaultSettingsInterface {
  [key: string]: ElectronStorageType;
}
// During development we can find the file in /Users/wimselles/Library/Application Support/Electron
// After the build we can find it in /Users/wimselles/Library/Application Support/Sauce Labs vUSB GUI
const STORAGE_FILE_NAME = 'saucelabs-up-vusb-config-v2.0.0';
const DEFAULT_SETTINGS: DefaultSettingsInterface = {
  generic: {
    connection: {
      username: '',
      accessKey: '',
      location: 'eu',
    },
    proxy: {
      host: '',
      portNumber: undefined,
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
      portNumber: 33657,
      verboseLogs: false,
    },
    device: {
      proxy: {
        host: '',
        portNumber: undefined,
        username: '',
        password: '',
      },
    },
    productTour: {
      appVersion: '1.0.1',
    },
  },
};

export { DEFAULT_SETTINGS, STORAGE_FILE_NAME };
