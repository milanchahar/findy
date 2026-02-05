import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#000',
            color: '#fff',
            borderRadius: 0,
            border: '1px solid rgba(255,255,255,0.16)',
          },
        }}
      />
    </>
  </StrictMode>,
);
