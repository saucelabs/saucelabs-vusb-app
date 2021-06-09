import ElectronStore from 'electron-store';
import { DEFAULT_SETTINGS, STORAGE_FILE_NAME } from '../utils/Constants';
import StorageTypes from '../types/StorageTypes';

const store = new ElectronStore({
  name: STORAGE_FILE_NAME,
  defaults: { ...DEFAULT_SETTINGS },
});

/**
 * Get the generic data
 */
export function getGenericStorage() {
  return {
    ...DEFAULT_SETTINGS.generic,
    ...store.get('generic'),
  };
}

/**
 * Set the generic storage data
 */
export function setGenericStorage(value: StorageTypes) {
  store.set('generic', { ...getGenericStorage(), ...value });
}
