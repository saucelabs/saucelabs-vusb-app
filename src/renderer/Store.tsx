import React, { createContext, useEffect, useReducer, useState } from 'react';
import logger from 'use-reducer-logger';
import {
  SystemChecksActionType,
  SystemChecksStateType,
} from 'types/SystemChecksTypes';
import { ServerActionType, ServerStateType } from 'types/ServerTypes';
import { DevicesActionType, DevicesStateType } from 'types/DeviceTypes';
import { TunnelsActionType, TunnelsStateType } from 'types/TunnelTypes';
import {
  initialSystemChecksState,
  systemChecksReducer,
} from './reducer/SystemChecksReducer';
import { getSystemCheckData } from './actions/SystemChecksActions';
import { initialServerState, serverReducer } from './reducer/ServerReducer';
import { devicesReducer, initialDevicesState } from './reducer/DevicesReducer';
import { DispatchType } from '../types/GenericTypes';
import {
  initialProductTourState,
  productTourReducer,
} from './reducer/ProductTourReducer';
import {
  ProductTourActionType,
  ProductTourStateType,
} from '../types/ProductTourTypes';
import { initialTunnelsState, tunnelsReducer } from './reducer/TunnelsReducer';
import {
  AuthenticationActionType,
  AuthenticationStateType,
} from '../types/AuthenticationTypes';
import {
  authenticationReducer,
  initialAuthenticationsState,
} from './reducer/AuthenticationReducer';

interface InitialStoreStateInterface {
  authentication: AuthenticationStateType;
  devices: DevicesStateType;
  productTour: ProductTourStateType;
  server: ServerStateType;
  systemChecks: SystemChecksStateType;
  tunnels: TunnelsStateType;
}

const initialState: InitialStoreStateInterface = {
  authentication: initialAuthenticationsState,
  devices: initialDevicesState,
  productTour: initialProductTourState,
  server: initialServerState,
  systemChecks: initialSystemChecksState,
  tunnels: initialTunnelsState,
};
const StoreContext = createContext<{
  state: InitialStoreStateInterface;
  dispatch: DispatchType;
}>({
  state: initialState,
  dispatch: () => null,
});
const mainReducer = (
  {
    authentication,
    devices,
    productTour,
    server,
    systemChecks,
    tunnels,
  }: InitialStoreStateInterface,
  action:
    | AuthenticationActionType
    | DevicesActionType
    | ProductTourActionType
    | ServerActionType
    | SystemChecksActionType
    | TunnelsActionType
) => ({
  authentication: authenticationReducer(
    authentication,
    action as AuthenticationActionType
  ),
  devices: devicesReducer(devices, action as DevicesActionType),
  productTour: productTourReducer(productTour, action as ProductTourActionType),
  server: serverReducer(server, action as ServerActionType),
  systemChecks: systemChecksReducer(
    systemChecks,
    action as SystemChecksActionType
  ),
  tunnels: tunnelsReducer(tunnels, action as TunnelsActionType),
});
const StoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [state, dispatch] = useReducer(
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
      ? logger(mainReducer)
      : mainReducer,
    initialState
  );

  // Loading initial state
  useEffect(() => {
    dispatch(getSystemCheckData(window.electron.systemChecks.get()));
    setIsLoaded(true);
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {isLoaded ? (
        children
      ) : (
        <div>
          <p>Loading</p>
        </div>
      )}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
