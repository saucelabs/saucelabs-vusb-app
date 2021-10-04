import React, { createContext, useReducer } from 'react';
import logger from 'use-reducer-logger';
import { initialServerState, serverReducer } from './reducers/ServerReducer';
import { devicesReducer, initialDevicesState } from './reducers/DevicesReducer';
import { DevicesStateInterface } from '../devices/DeviceInterfaces';
import { ServerActionType } from '../server/ServerTypes';
import { ServerStateInterface } from '../server/ServerInterfaces';
import { DevicesActionType } from '../devices/DeviceTypes';
import { RequirementStateInterface } from '../requirements/RequirementInterfaces';
import {
  initialRequirementsState,
  requirementsReducer,
} from './reducers/RequirementsReducer';
import { RequirementsActionType } from '../requirements/RequirementsTypes';
import {
  initialSettingsState,
  settingsReducer,
} from './reducers/SettingsReducer';
import { SettingsActionType } from '../settings/SettingsTypes';
import { SettingsStateInterface } from '../settings/SettingsInterfaces';

interface InitialStoreStateInterface {
  devices: DevicesStateInterface;
  requirements: RequirementStateInterface;
  server: ServerStateInterface;
  settings: SettingsStateInterface;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
type DispatchType = React.Dispatch<any>;

const initialState: InitialStoreStateInterface = {
  devices: initialDevicesState,
  requirements: initialRequirementsState,
  server: initialServerState,
  settings: initialSettingsState,
};
const StoreContext = createContext<{
  state: InitialStoreStateInterface;
  dispatch: DispatchType;
}>({
  state: initialState,
  dispatch: () => null,
});
const mainReducer = (
  { devices, requirements, server, settings }: InitialStoreStateInterface,
  action:
    | DevicesActionType
    | RequirementsActionType
    | ServerActionType
    | SettingsActionType
) => ({
  devices: devicesReducer(devices, action as DevicesActionType),
  requirements: requirementsReducer(
    requirements,
    action as RequirementsActionType
  ),
  server: serverReducer(server, action as ServerActionType),
  settings: settingsReducer(settings, action as SettingsActionType),
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
