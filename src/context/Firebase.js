import { createContext, useContext, useState, useEffect } from "react"
import Store from "../store";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { initializeApp } from 'firebase/app'
import firebase from 'firebase/compat/app'
import 'firebase/compat/app'
import { onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from '../settings/config'
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const AuthContext = createContext(null)
export const AuthContextProvider = props => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    }, setError)
    return () => unsubscribe()
  }, [])
  return <AuthContext.Provider value={{ user, error }} {...props} />
}


export const useAuthState = () => {
  const authContext = useContext(AuthContext)
  return {
    ...authContext,
    firebase: Store(auth, getDatabase(app), getFirestore(app)),
    isAuthenticated: authContext.user != null
  }
}