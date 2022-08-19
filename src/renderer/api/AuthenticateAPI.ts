import axios, { AxiosError } from 'axios';
import { AuthenticationType } from '../../types/AuthenticationTypes';
import {
  authenticationError,
  authenticationStart,
  authenticationSuccess,
} from '../actions/AuthenticationActions';

const authenticationUrl =
  'https://accounts.saucelabs.com/am/json/realms/root/realms/authtree/authenticate';

/**
 * Authenticate
 */
async function authenticate({
  dispatch,
  password,
  username,
}: AuthenticationType): Promise<string | AxiosError> {
  dispatch(authenticationStart());

  try {
    const options = {
      method: 'POST',
      url: authenticationUrl,
      headers: {
        'X-OpenAM-Username': username,
        'X-OpenAM-Password': password,
        'x-requested-with': 'XMLHttpRequest',
        'Cache-Control': 'no-store',
      },
    };
    const response = await axios(options);
    const { tokenId } = response.data;

    dispatch(authenticationSuccess({ tokenId }));

    return tokenId;
  } catch (error) {
    dispatch(authenticationError(error as AxiosError));

    return error as AxiosError;
  }
}

export default authenticate;
