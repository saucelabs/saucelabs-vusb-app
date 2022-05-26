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
 * @param {string} cookie_or_key
 *
 * @returns {function(*): Promise<void|*|undefined>}
 */
export function getUserInfo({ cookie_or_key, user=''}) {
  return async (dispatch) => {
    // Get the access_key and username
    dispatch(waiStart());
    try {
      var access_key = "";
      var username = "";
      // Check if token is a GUID, and treat it like an Access Key
      var guid_pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (guid_pattern.test(cookie_or_key)){
        access_key = cookie_or_key;
        username = user; 
      } else {
        const options = {
          url: waiUrl,
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            Accept: '/',
            'Cache-Control': 'no-store',
            Authorization: `Bearer ${cookie_or_key}`
          }
        };
        const response = await axios(options);
        access_key = response.data.access_key;
        username = response.data.username;
        dispatch(waiSuccess({ access_key, username, tokenId: cookie_or_key }));
      }

      const { connection } = getGenericStorage();

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
