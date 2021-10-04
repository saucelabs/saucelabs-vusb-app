import { ApiStatusEnum } from './DeviceApiTypes';

interface DevicesApiInterface {
  abiType: string;
  apiLevel: number;
  cloudType: string;
  compositeId: string;
  connectivity: string[];
  cpuCores: number;
  cpuFrequency: number;
  cpuType: string;
  dataCenterId: string;
  descriptorId: string;
  dpi: number;
  dpiName: string;
  formFactor: string;
  freeOfCharge: false;
  hasOnScreenButtons: true;
  includedInPlan: true;
  internalStorageSize: number;
  manufacturers: string[];
  modelNumber: string;
  name: string;
  os: string;
  osVersion: string;
  phoneNumber: null;
  ramSize: number;
  resolutionHeight: number;
  resolutionWidth: number;
  screenSize: number;
  supportsAppiumWebAppTesting: boolean;
}
interface ExtraDeviceStateInterface {
  adbConnected: boolean;
  error: boolean;
  inUse: boolean;
  isBusy: boolean;
  log: string[];
  manualConnect: boolean;
  port: number;
  sessionID: string;
  showDevice: boolean;
  showLogs: boolean;
  status: string;
}
interface DeviceStateInterface
  extends DevicesApiInterface,
    ExtraDeviceStateInterface {}
interface DevicesStateInterface {
  connectedDevices: string[];
  deviceQuery: string;
  devices: DeviceStateInterface[];
  devicesChecked: boolean;
  error: Error | null;
  status: ApiStatusEnum;
}
interface InUseDevicesInterface {
  deviceDescriptorId: string;
  liveViewUrl: string;
  name: string;
  os: string;
  osVersion: string;
  sessionId: string;
  virtualUsbRouterUrl: string;
}

export {
  DevicesApiInterface,
  DevicesStateInterface,
  DeviceStateInterface,
  ExtraDeviceStateInterface,
  InUseDevicesInterface,
};
