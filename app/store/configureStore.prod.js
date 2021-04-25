// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../rootReducer';
import type { counterStateType } from '../rootReducer.types';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

function configureStore(initialState?: counterStateType) {
  return createStore<*, counterStateType, *>(
    rootReducer,
    initialState,
    enhancer
  );
}

export default { configureStore, history };
