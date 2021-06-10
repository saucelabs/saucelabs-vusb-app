interface ConnectionInterface {
  username: string;
  accessKey: string;
  location: string;
}
interface ServerProxyInterface {
  host: string;
  port: number | undefined;
  username: string;
  password: string;
}
interface ServerInterface {
  adbPortMin: number;
  adbPortRange: number;
  autoAdbConnect: boolean;
  host: string;
  logsToFile: boolean;
  logsPath: string;
  port: number;
  verboseLogs: boolean;
}
interface DeviceProxyInterface {
  host: string;
  port: number | undefined;
  username: string;
  password: string;
}
interface StorageInterface {
  connection: ConnectionInterface;
  proxy: ServerProxyInterface;
  server: ServerInterface;
  device: {
    proxy: DeviceProxyInterface;
  };
}

export {
  ConnectionInterface,
  DeviceProxyInterface,
  ServerProxyInterface,
  ServerInterface,
  StorageInterface,
};
