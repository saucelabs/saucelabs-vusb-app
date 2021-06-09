import React from 'react';
import { DevicesStateType } from './DeviceTypes';
import { ServerStateType } from './ServerTypes';

type InitialStoreState = {
  devices: DevicesStateType;
  server: ServerStateType;
};
/* eslint-disable  @typescript-eslint/no-explicit-any */
type DispatchType = React.Dispatch<any>;

export { DispatchType, InitialStoreState };
