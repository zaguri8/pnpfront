import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'firebase/firestore'
import App from './App';
import { HashRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/Firebase';
import { LoadingContextProvider } from './context/Loading';
import { GoogleMapsContextProvider } from './context/GoogleMaps';


ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <GoogleMapsContextProvider>
        <LoadingContextProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </LoadingContextProvider>
      </GoogleMapsContextProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
