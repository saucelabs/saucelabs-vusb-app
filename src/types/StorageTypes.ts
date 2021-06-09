type StorageTypes = {
  connection: {
    username: string;
    accessKey: string;
    location: string;
  };
  proxy: {
    host: string;
    port: string;
    username: string;
    password: string;
  };
  server: {
    adbPortMin: string;
    adbPortRange: string;
    autoAdbConnect: boolean;
    host: string;
    logsToFile: boolean;
    logsPath: string;
    port: string;
    verboseLogs: boolean;
  };
  device: {
    proxy: {
      host: string;
      port: string;
      username: string;
      password: string;
    };
  };
};

export default StorageTypes;
