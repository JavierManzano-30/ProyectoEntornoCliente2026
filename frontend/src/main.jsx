import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Alinea el tema antes del render para que los loaders iniciales respeten la preferencia
const storedDarkMode = (() => {
  try {
    return localStorage.getItem('darkMode') === 'true';
  } catch {
    return false;
  }
})();

if (storedDarkMode) {
  document.body.classList.add('dark-mode');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
