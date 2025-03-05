import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import App from './App.jsx';
import './index.css';

// Expose store globally for Electron to access (development and production)
window.store = store;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// Development: Simulate saving via fetch (remove in production)
if (process.env.NODE_ENV === 'development') {
  window.saveState = () => {
    const state = store.getState();
    fetch('http://localhost:5173/save-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    }).catch(console.error);
  };
}