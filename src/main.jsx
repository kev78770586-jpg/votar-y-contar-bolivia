import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ElectoralProvider } from './context/ElectoralContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ElectoralProvider>
      <App />
    </ElectoralProvider>
  </React.StrictMode>
);
