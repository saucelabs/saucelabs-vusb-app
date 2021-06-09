import React, { createContext, useReducer } from 'react';
import logger from 'use-reducer-logger';
import { initialServerState, serverReducer } from './reducers/ServerReducer';
import { devicesReducer, initialDevicesState } from './reducers/DevicesReducer';
import { InitialStoreState } from '../types/StoreTypes';
import { DevicesActionType } from '../types/DeviceTypes';
import { ServerActionType } from '../types/ServerTypes';

const initialState: InitialStoreState = {
  devices: initialDevicesState,
  server: initialServerState,
};
const StoreContext = createContext<{
  state: InitialStoreState;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null,
});
const mainReducer = (
  { devices, server }: InitialStoreState,
  action: DevicesActionType | ServerActionType
) => ({
  devices: devicesReducer(devices, action as DevicesActionType),
  server: serverReducer(server, action as ServerActionType),
});
const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    process.env.NODE_ENV === 'development' ? logger(mainReducer) : mainReducer,
    initialState
  );

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
