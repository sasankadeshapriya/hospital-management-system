import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from './context/ToastContext';  // Import ToastProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>  {/* Wrap App in ToastProvider */}
      <App />
    </ToastProvider>
  </StrictMode>
);
