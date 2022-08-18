import { DialogType } from 'types/ChannelTypes';
import {
  CreateDeviceConnectionType,
  DeviceSessionStatusEnum,
  StartDeviceType,
  StopDeviceType,
} from 'types/DeviceTypes';
import { ElectronStorageType } from 'types/ElectronStoreTypes';
import { ServerActionEnum } from 'types/ServerTypes';
import { SystemChecksStateType } from 'types/SystemChecksTypes';

declare global {
  interface Window {
    electron: {
      reload(): void;
      selectDirectory: {
        openDialog(): void;
        retrieveFolderPath(): string;
      };
      showDialog(): Promise<DialogType>;
      store: {
        get: () => ElectronStorageType;
        set: (val: ElectronStorageType) => void;
      };
      systemChecks: {
        once(channel: string, func: (...args: unknown[]) => void): void;
        get: () => SystemChecksStateType;
      };
      vusb: {
        start(status: ServerActionEnum): void;
        onRunning(
          func: ({
            logLine,
            status,
          }: {
            logLine: string;
            status: ServerActionEnum;
          }) => void
        ): void;
        removeAllListeners(): void;
        stop(): void;
        onStopping(
          func: ({
            logLine,
            status,
          }: {
            logLine: string;
            status: ServerActionEnum;
          }) => void
        ): void;
      };
      device: {
        start({
          descriptorId,
          sessionId,
          storageData,
          tunnelIdentifier,
        }: StartDeviceType): Promise<CreateDeviceConnectionType>;
        stop({
          descriptorId,
          manualConnect,
          portNumber,
          sessionId,
          status,
          storageData,
        }: StopDeviceType): Promise<{
          adbConnected: boolean;
          connectionError: boolean;
          connectionUrl: string;
          logLines: string;
          portNumber: number;
        }>;
        onManualSessionClose(
          func: ({
            descriptorId,
            manualConnect,
            portNumber,
            sessionId,
            status,
          }: {
            descriptorId: string;
            manualConnect: boolean;
            portNumber: number;
            sessionId: string;
            status: DeviceSessionStatusEnum;
          }) => void
        ): void;
      };
    };
  }
}

export {};
