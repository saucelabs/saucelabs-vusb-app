import React, { createContext, useReducer } from 'react';
import logger from 'use-reducer-logger';
import { initialServerState, serverReducer } from './reducers/ServerReducer';
import { devicesReducer, initialDevicesState } from './reducers/DevicesReducer';
import { DevicesStateInterface } from '../devices/DeviceInterfaces';
import { ServerActionType } from '../server/ServerTypes';
import { ServerStateInterface } from '../server/ServerInterfaces';
import { DevicesActionType } from '../devices/DeviceTypes';
import { ProductTourStateInterface } from '../productTour/ProductTourInterfaces';
import {
  initialProductTourState,
  productTourReducer,
} from './reducers/ProductTourReducer';
import { ProductTourActionType } from '../productTour/ProductTourTypes';

interface InitialStoreStateInterface {
  devices: DevicesStateInterface;
  productTour: ProductTourStateInterface;
  server: ServerStateInterface;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
type DispatchType = React.Dispatch<any>;

const initialState: InitialStoreStateInterface = {
  devices: initialDevicesState,
  productTour: initialProductTourState,
  server: initialServerState,
};
const StoreContext = createContext<{
  state: InitialStoreStateInterface;
  dispatch: DispatchType;
}>({
  state: initialState,
  dispatch: () => null,
});
const mainReducer = (
  { devices, productTour, server }: InitialStoreStateInterface,
  action: DevicesActionType | ProductTourActionType | ServerActionType
) => ({
  devices: devicesReducer(devices, action as DevicesActionType),
  productTour: productTourReducer(productTour, action as ProductTourActionType),
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

export { DispatchType, StoreContext, StoreProvider };
