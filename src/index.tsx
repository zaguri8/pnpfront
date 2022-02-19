import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'firebase/firestore'
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app'
import App from './App';
import Wedding from './components/invitation/InvitationPage';
import { init } from '@emailjs/browser';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { Routes } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { Route } from 'react-router';
import { CreateAuthService, CreateRealTimeDatabase } from './store';


// Configure Firebase.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL:process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId
};

init("user_rkYwcdx6gekrQy2guNPYc");

// Configure FirebaseUI.
export const uiConfig = (path: string) => ({
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',

  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: path,
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
});

firebase.initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const realTimeFunctions = CreateRealTimeDatabase(auth, getDatabase(app))
export const authFunctions = CreateAuthService(auth)
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/hodash' element={<Wedding eventName='החתונה של הגר וגבריאל' eventTime='18:00 בערב' startPoint='דרך רמתיים, הוד השרון' />} />
        <Route path='/tlv' element={<Wedding eventName='החתונה של הגר וגבריאל' eventTime='18:00 בערב' startPoint='כיכר רבין,תל אביב' />} />
        <Route path='/' element={<App />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
