import React from 'react';
import { StoreProvider } from './store/Store';
import './App.global.css';
import Header from './components/Header';
import Footer from './components/Footer';
import DevicesOverview from './devices/DevicesOverview';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <div className="mainContainer">
        <Header />
        <DevicesOverview />
        <Footer />
      </div>
    </StoreProvider>
  );
};

export default App;
