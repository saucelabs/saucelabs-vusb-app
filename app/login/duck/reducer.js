import {
  AUTHENTICATION_ERROR,
  AUTHENTICATION_LOADING,
  AUTHENTICATION_SUCCESS,
  WHO_AM_I_ERROR,
  WHO_AM_I_LOADING,
  WHO_AM_I_SUCCESS
} from './actions';

const initialState = {
  access_key: '',
  username: '',
  tokenId: '',
  error: ''
};

export function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATION_ERROR:
      return {
        ...state,
        error: action.error
      };
    case AUTHENTICATION_LOADING:
      return {
        ...state
      };
    case AUTHENTICATION_SUCCESS:
      return {
        ...state,
        tokenId: action.tokenId
      };
    case WHO_AM_I_ERROR:
      return {
        ...state,
        error: action.error
      };
    case WHO_AM_I_LOADING:
      return {
        ...state
      };
    case WHO_AM_I_SUCCESS:
      return {
        ...state,
        access_key: action.access_key,
        username: action.username,
        tokenId: action.tokenId
      };
    default:
      return state;
  }
}
