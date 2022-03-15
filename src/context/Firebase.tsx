import { createContext, useContext, useState, useEffect, Context } from "react"
import Store from "../store/external";
import { ErrorFn, getAuth, Unsubscribe } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, get, set, onValue } from "firebase/database";
import { Realtime } from '../store/external/index'
import { initializeApp } from 'firebase/app'
import firebase from 'firebase/compat/app'
import { User } from "firebase/auth";
import React from "react";
import { PNPUser } from "../store/external/types";
import 'firebase/compat/app'
import { getStorage, uploadBytes, getDownloadURL, ref as storageRef } from "firebase/storage";
import { ref, child } from "firebase/database";
import { userFromDict } from "../store/external/converters";
import { firebaseConfig } from '../settings/config'
import { createNewCustomer } from "../store/payments";
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage(app)

export interface IFirebaseContext {
  user: User | null;
  appUser: PNPUser | null;
  error: Error | null;
  setUser: (user: User | null) => void;
  setAppUser: (user: PNPUser | null) => void;
}
const FirebaseContext = React.createContext<IFirebaseContext | null>(null);
export const FirebaseContextProvider = (props: object) => {


  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<PNPUser | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      let unsub: Unsubscribe | null = null
      if (user) {
        unsub = onValue(child(ref(getDatabase(app), 'users'), user.uid), (snap) => {
          const au = userFromDict(snap)
          setAppUser(au)
          setUser(user)
        })
      } else setUser(null)

      return () => { unsub as Unsubscribe && (unsub as Unsubscribe)() }
    }, setError)
    return () => unsubscribe()
  }, [])


  return <FirebaseContext.Provider value={{ user, appUser, error, setAppUser, setUser }} {...props} />
}


export const useFirebase = () => {
  const firebaseContext: IFirebaseContext | null = useContext(FirebaseContext)
  return {
    ...firebaseContext,
    firebase: Store(auth, getDatabase(app), getFirestore(app)),
    signOut: async () => {
      firebaseContext?.setUser(null)
      firebaseContext?.setAppUser(null)
      return await auth.signOut()
    },
    freeDbRef: getDatabase(app),
    isAuthenticated: firebaseContext?.user != null,
    uploadUserImage: async (imageBlob: ArrayBuffer) => { if (firebaseContext?.user?.uid) return await uploadBytes(storageRef(storage, '/UserImages/' + (firebaseContext!.user!.uid ? firebaseContext!.user!.uid : '')), imageBlob) },
    uploadEventImage: async (eventId: string, imageBlob: ArrayBuffer) => await uploadBytes(storageRef(storage, 'EventImages/' + eventId), imageBlob)
  }
}