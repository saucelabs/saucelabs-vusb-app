import { MemoryRouter as Router } from 'react-router-dom';
import { StoreProvider } from './Store';
import AppRouter from './AppRouter';
import Footer from './components/Footer';
import './App.global.css';

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <div className="mainContainer">
          <AppRouter />
          <Footer />
        </div>
      </Router>
    </StoreProvider>
  );
}
