import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from './store/Store';
import Routes from './Routes';
import './App.global.css';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <div className="mainContainer">
          <Header />
          <main>
            <Routes />
          </main>
          <Footer />
        </div>
      </Router>
    </StoreProvider>
  );
};

export default App;
