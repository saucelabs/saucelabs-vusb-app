import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from './store/Store';
import Routes from './Routes';
import './App.global.css';
import Header from './components/Header';
import LeftMenu from './components/LeftMenu';

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <div className="left-menu-wrapper">
          <LeftMenu />
        </div>
        <div className="routes-wrapper">
          <Header />
          <div className="routes">
            <Routes />
          </div>
        </div>
      </Router>
    </StoreProvider>
  );
}
