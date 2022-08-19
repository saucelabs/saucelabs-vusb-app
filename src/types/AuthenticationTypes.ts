import { AxiosError } from 'axios';
import { DispatchType } from './GenericTypes';

enum AuthenticationActionEnum {
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHENTICATION_LOADING = 'AUTHENTICATION_LOADING',
  AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS',
}

type AuthenticationStateType = {
  tokenId: string;
  error: null | AxiosError;
};

type AuthenticationActionType =
  | {
      type: AuthenticationActionEnum.AUTHENTICATION_LOADING;
    }
  | {
      type: AuthenticationActionEnum.AUTHENTICATION_SUCCESS;
      tokenId: string;
    }
  | {
      type: AuthenticationActionEnum.AUTHENTICATION_ERROR;
      error: AxiosError;
    };
type AuthenticationType = {
  dispatch: DispatchType;
  password: string;
  username: string;
};

export {
  AuthenticationActionEnum,
  AuthenticationActionType,
  AuthenticationStateType,
  AuthenticationType,
};
