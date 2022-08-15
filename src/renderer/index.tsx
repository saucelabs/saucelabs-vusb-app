import { createRoot } from 'react-dom/client';
import App from './App';
import LiveSessionMenu from './screens/LiveSessionMenu';

// For the main window
const container = document.getElementById('root')!;
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

// For the manual session menu window
const sessionMenu = document.getElementById('sessionMenu')!;
if (sessionMenu) {
  const sessionMenuRoot = createRoot(sessionMenu);
  sessionMenuRoot.render(<LiveSessionMenu />);
}
