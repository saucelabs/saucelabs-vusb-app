import { AuthenticationActionEnum } from 'types/AuthenticationTypes';

/**
 * Start the authentication
 */
export function authenticationStart(): { type: string } {
  return {
    type: AuthenticationActionEnum.AUTHENTICATION_LOADING,
  };
}

/**
 * Successful authentication call
 */
export function authenticationSuccess({ tokenId }: { tokenId: string }): {
  tokenId: string;
  type: string;
} {
  return {
    type: AuthenticationActionEnum.AUTHENTICATION_SUCCESS,
    tokenId,
  };
}

/**
 * Store the error
 */
export function authenticationError(error: Error): {
  type: string;
  error: Error;
} {
  return {
    type: AuthenticationActionEnum.AUTHENTICATION_ERROR,
    error,
  };
}
