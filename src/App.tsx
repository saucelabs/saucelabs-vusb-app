import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from './store/Store';
import './App.global.css';
import Footer from './components/Footer';
import Routes from './Routes';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <div className="mainContainer">
          <Routes />
          <Footer />
        </div>
      </Router>
    </StoreProvider>
  );
};

export default App;
