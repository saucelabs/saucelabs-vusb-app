import axios from 'axios';
import { AuthenticationErrorType } from 'types/AuthenticationTypes';
import { DispatchType } from '../../types/GenericTypes';
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
}: {
  dispatch: DispatchType;
  password: string;
  username: string;
}): Promise<string | AuthenticationErrorType> {
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
    dispatch(authenticationError(error as AuthenticationErrorType));

    return error as AuthenticationErrorType;
  }
}

export default authenticate;
