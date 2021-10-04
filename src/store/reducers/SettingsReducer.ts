import { SettingsStateInterface } from '../../settings/SettingsInterfaces';
import {
  SettingsAction as ACTIONS,
  SettingsActionType,
} from '../../settings/SettingsTypes';

const initialSettingsState: SettingsStateInterface = {
  isOpen: false,
};
const settingsReducer = (
  state: SettingsStateInterface = initialSettingsState,
  action: SettingsActionType
) => {
  switch (action.type) {
    case ACTIONS.SETTINGS_OPEN:
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    default:
      return state;
  }
};

export { initialSettingsState, settingsReducer };
