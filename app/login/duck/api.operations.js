import axios from 'axios';
import {
  authenticationError,
  authenticationStart,
  authenticationSuccess,
  waiStart,
  waiSuccess
} from './actions';
import {
  getGenericStorage,
  setGenericStorage
} from '../../settings/duck/settings.storage';

const authenticationUrl =
  'https://accounts.saucelabs.com/am/json/realms/root/realms/authtree/authenticate';
const waiUrl = 'https://api.eu-central-1.saucelabs.com/rest/v1/whoami';

/**
 * Authenticate
 *
 * @param {string} username
 * @param {string} password
 *
 * @returns {function(*): Promise<string|Error>}
 */
export function authenticate({ username, password }) {
  return async (dispatch) => {
    dispatch(authenticationStart());

    try {
      const options = {
        method: 'POST',
        url: authenticationUrl,
        headers: {
          'X-OpenAM-Username': username,
          'X-OpenAM-Password': password,
          'x-requested-with': 'XMLHttpRequest',
          'Cache-Control': 'no-store'
        }
      };
      const response = await axios(options);
      const { tokenId } = response.data;

      dispatch(authenticationSuccess({ tokenId }));

      return tokenId;
    } catch (error) {
      return dispatch(authenticationError(error));
    }
  };
}

/**
 * Get the user info
 *
 * @param {string} cookie
 *
 * @returns {function(*): Promise<void|*|undefined>}
 */
export function getUserInfo({ cookie, user=''}) {
  return async (dispatch) => {
    // Get the access_key and username
    dispatch(waiStart());
    try {
      /*const options = {
        url: waiUrl,
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          Accept: '/',
          'Cache-Control': 'no-store',
          Authorization: `Bearer ${cookie}`
        }
      };
      const response = await axios(options);
      const { access_key, username } = response.data;*/
      const { access_key, username } = { access_key: cookie , username: 'sso-outsystems-carlos.simoes' }; 
      const { connection } = getGenericStorage();

      //dispatch(waiSuccess({ access_key, username, tokenId: cookie }));

      return setGenericStorage({
        connection: {
          ...connection,
          username,
          access_key
        }
      });
    } catch (error) {
      return dispatch(authenticationError(error));
    }
  };
}
