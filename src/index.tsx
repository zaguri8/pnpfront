import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'firebase/firestore'
import App from './App';
import { HashRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/Firebase';
import { LoadingContextProvider } from './context/Loading';


ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <LoadingContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </LoadingContextProvider>
              
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
