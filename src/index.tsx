import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'firebase/firestore'
import App from './App';
import { HashRouter } from 'react-router-dom';
import { FirebaseContextProvider } from './context/Firebase';
import { LoadingContextProvider } from './context/Loading';
import { GoogleMapsContextProvider } from './context/GoogleMaps';
import { LanguageContextProvider } from './context/Language';
import { ScanningContextProvider } from './context/ScannerContext';
import { CookieContextProvider } from './context/CookieContext';


ReactDOM.render(
  <HashRouter>
    <LanguageContextProvider>
      <GoogleMapsContextProvider>
        <LoadingContextProvider>
          <FirebaseContextProvider>
            <ScanningContextProvider>
              <CookieContextProvider>
                <App />
              </CookieContextProvider>
            </ScanningContextProvider>
          </FirebaseContextProvider>
        </LoadingContextProvider>
      </GoogleMapsContextProvider>
    </LanguageContextProvider>
  </HashRouter>,
  document.getElementById('root')
);
