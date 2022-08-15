enum AuthenticationActionEnum {
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHENTICATION_LOADING = 'AUTHENTICATION_LOADING',
  AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS',
}

type AuthenticationErrorType = {
  message: string;
  name: string;
  config: {
    transitional: {
      silentJSONParsing: boolean;
      forcedJSONParsing: boolean;
      clarifyTimeoutError: boolean;
    };
    transformRequest: [null];
    transformResponse: [null];
    timeout: 0;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    maxContentLength: number;
    maxBodyLength: number;
    env: {
      FormData: null;
    };
    headers: {
      Accept: string;
      'X-OpenAM-Username': string;
      'X-OpenAM-Password': string;
      'x-requested-with': string;
      'Cache-Control': string;
    };
    method: string;
    url: string;
  };
  code: string;
  status: number;
};

type AuthenticationStateType = {
  tokenId: string;
  error: null | Error;
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
      error: Error;
    };

export {
  AuthenticationActionEnum,
  AuthenticationErrorType,
  AuthenticationStateType,
  AuthenticationActionType,
};
