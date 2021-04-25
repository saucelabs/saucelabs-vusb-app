// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { HashHistory } from 'history';
import deviceReducer from './devices/duck/reducer';
import vusbServerReducer from './monitor/duck/reducer';
import { authenticationReducer } from './login/duck/reducer';

export default function createRootReducer(history: HashHistory) {
  return combineReducers<{}, *>({
    authentication: authenticationReducer,
    router: connectRouter(history),
    deviceApi: deviceReducer,
    server: vusbServerReducer
  });
}
