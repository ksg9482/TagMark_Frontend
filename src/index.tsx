import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import store from "./store";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //<React.StrictMode>
  <Provider store={store}>
    <HelmetProvider>
      <Helmet>TagMark</Helmet>
      <App />
    </HelmetProvider>
  </Provider>
  //</React.StrictMode>
);

reportWebVitals();
