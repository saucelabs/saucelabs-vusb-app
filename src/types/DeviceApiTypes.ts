import { DevicesActionType } from './DeviceTypes';
import { ElectronStorageType } from './ElectronStoreTypes';
import { DispatchType } from './GenericTypes';

enum ApiStatusEnum {
  IDLE = 'IDLE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
}

type GetDevicesType = {
  dispatch: DispatchType;
  isLinux: boolean;
  isMac: boolean;
  isWindows: boolean;
  storageData: ElectronStorageType;
};
type GetInUseDevicesType = {
  dispatch: DispatchType;
  storageData: ElectronStorageType;
  vusbStatus: string;
};
type GetAvailableDevicesType = {
  dispatch: (object: DevicesActionType) => void;
  storageData: ElectronStorageType;
};
export {
  ApiStatusEnum,
  GetDevicesType,
  GetAvailableDevicesType,
  GetInUseDevicesType,
};
