import { ChannelsEnum } from './ChannelTypes';

type ElectronStoreGetType = ChannelsEnum.ELECTRON_STORE_GET;
type ElectronStoreSetType = ChannelsEnum.ELECTRON_STORE_SET;

type ConnectionType = {
  username: string;
  accessKey: string;
  location: string;
};
type ServerProxyType = {
  host: string;
  port: number | undefined;
  username: string;
  password: string;
};
type ServerType = {
  adbPortMin: number;
  adbPortRange: number;
  autoAdbConnect: boolean;
  host: string;
  logsToFile: boolean;
  logsPath: string;
  port: number;
  verboseLogs: boolean;
};
type DeviceProxyType = {
  host: string;
  port: number | undefined;
  username: string;
  password: string;
};
type ProductTour = {
  appVersion: string;
};

type ElectronStorageType = {
  connection: ConnectionType;
  device: {
    proxy: DeviceProxyType;
  };
  productTour?: ProductTour;
  proxy: ServerProxyType;
  server: ServerType;
};

export {
  ConnectionType,
  DeviceProxyType,
  ElectronStoreGetType,
  ElectronStoreSetType,
  ElectronStorageType,
  ServerType,
  ServerProxyType,
};
