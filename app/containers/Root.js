// @flow
import React from 'react';
import { argv } from 'yargs';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import type { Store } from '../rootReducer.types';
import Routes from '../Routes';
import LeftMenu from '../components/LeftMenu';
import Header from '../components/Header';
import ManualScreen from '../manual';

type Props = {
  store: Store,
  history: {}
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    {argv.openDevice ? (
      <ManualScreen />
    ) : (
      <ConnectedRouter history={history}>
        <div className="left-menu-wrapper">
          <LeftMenu />
        </div>
        <div className="routes-wrapper">
          <Header history={history} />
          <Routes />
        </div>
      </ConnectedRouter>
    )}
  </Provider>
);

export default hot(Root);
