import { SettingsAction } from '../../settings/SettingsTypes';

/**
 * Open the Settings container
 */
function openSettingsContainer() {
  return {
    type: SettingsAction.SETTINGS_OPEN,
  };
}

// eslint-disable-next-line import/prefer-default-export
export { openSettingsContainer };
