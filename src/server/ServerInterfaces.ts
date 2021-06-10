interface ServerStateInterface {
  status: string;
  log: string[];
  error: boolean;
  showMonitor: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export { ServerStateInterface };
