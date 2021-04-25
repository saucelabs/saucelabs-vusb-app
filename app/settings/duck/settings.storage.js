import Storage from 'electron-store';
import { DEFAULT_SETTINGS, STORAGE_FILE_NAME } from '../../helpers/constants';

const store = new Storage({
  name: STORAGE_FILE_NAME,
  defaults: { ...DEFAULT_SETTINGS }
});

/**
 * Get the generic data
 *
 * @returns {{*}}
 */
export function getGenericStorage() {
  return {
    ...DEFAULT_SETTINGS.generic,
    ...store.get('generic')
  };
}

/**
 * Set the generic storage data
 *
 * @param {object} value
 */
export function setGenericStorage(value) {
  store.set('generic', { ...getGenericStorage(), ...value });
}
