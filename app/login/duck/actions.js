import { API_STATUS } from '../../devices/duck/actions';

export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';
export const AUTHENTICATION_LOADING = 'AUTHENTICATION_LOADING';
export const AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
export const WHO_AM_I_ERROR = 'WHO_AM_I_ERROR';
export const WHO_AM_I_LOADING = 'WHO_AM_I_LOADING';
export const WHO_AM_I_SUCCESS = 'WHO_AM_I_SUCCESS';

/**
 * Start the authentication
 *
 * @returns {{type: string, status: string}}
 */
export function authenticationStart() {
  return {
    type: AUTHENTICATION_LOADING,
    status: API_STATUS.LOADING
  };
}

/**
 * Successful authentication call
 *
 * @param {string} tokenId
 *
 * @returns {{tokenId: string, type: string, status: string}}
 */
export function authenticationSuccess({ tokenId }) {
  return {
    type: AUTHENTICATION_SUCCESS,
    status: API_STATUS.SUCCESS,
    tokenId
  };
}

/**
 * Store the error
 *
 * @param {object} error
 *
 * @returns {{type: string, error: *, status: string}}
 */
export function authenticationError(error) {
  return {
    type: AUTHENTICATION_ERROR,
    status: API_STATUS.ERROR,
    error
  };
}

/**
 * Start the who am I call
 *
 * @returns {{type: string, status: string}}
 */
export function waiStart() {
  return {
    type: WHO_AM_I_LOADING,
    status: API_STATUS.LOADING
  };
}

/**
 * Successful who am I call
 *
 * @param {string} access_key
 * @param {string} username
 * @param {string} tokenId
 *
 * @returns {{accessKey: string, type: string, status: string}}
 */
export function waiSuccess({ access_key, username, tokenId }) {
  return {
    type: WHO_AM_I_SUCCESS,
    status: API_STATUS.SUCCESS,
    access_key,
    username,
    tokenId
  };
}

/**
 * Store the who am I error
 *
 * @param {object} error
 *
 * @returns {{type: string, error: *, status: string}}
 */
export function waiError(error) {
  return {
    type: WHO_AM_I_ERROR,
    status: API_STATUS.ERROR,
    error
  };
}
