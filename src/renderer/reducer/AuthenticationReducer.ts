import {
  AuthenticationActionEnum as ACTIONS,
  AuthenticationActionType,
  AuthenticationStateType,
} from '../../types/AuthenticationTypes';

const initialAuthenticationsState: AuthenticationStateType = {
  tokenId: '',
  error: null,
};
const authenticationReducer = (
  state: AuthenticationStateType = initialAuthenticationsState,
  action: AuthenticationActionType
) => {
  switch (action.type) {
    case ACTIONS.AUTHENTICATION_LOADING:
      return { ...state, error: null };
    case ACTIONS.AUTHENTICATION_SUCCESS:
      return {
        ...state,
        tokenId: action.tokenId,
      };
    case ACTIONS.AUTHENTICATION_ERROR:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

export { initialAuthenticationsState, authenticationReducer };
