import { useContext, useState, useEffect } from "react"
import Store, { Realtime } from "../store/external";
import { getAuth, Unsubscribe } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, onValue } from "firebase/database";
import { initializeApp } from 'firebase/app'
import firebase from 'firebase/compat/app'
import { User } from "firebase/auth";
import React from "react";
import { PNPPage, PNPPageStats } from "../cookies/types";
import { PNPUser } from "../store/external/types";
import 'firebase/compat/app'
import { getStorage, uploadBytes, ref as storageRef, getDownloadURL } from "firebase/storage";
import { ref, child } from "firebase/database";
import { userFromDict } from "../store/external/converters";
import { firebaseConfig } from '../settings/config'
import { useLoading } from "./Loading";
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage(app)

export interface IFirebaseContext {
  user: User | undefined | null;
  appUser: PNPUser | null;
  error: Error | null;
  
  setUser: (user: User | null | undefined) => void;
  setAppUser: (user: PNPUser | null) => void;
}
const FirebaseContext = React.createContext<IFirebaseContext | null>(null);
export const FirebaseContextProvider = (props: object) => {


  const [user, setUser] = useState<User | null | undefined>()
  const [appUser, setAppUser] = useState<PNPUser | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const { cancelLoad, doLoad } = useLoading()
  useEffect(() => {
    doLoad()
    const unsubscribe = auth.onAuthStateChanged((user) => {
      let unsub: Unsubscribe | null = null
      if (user) {
        unsub = onValue(child(ref(getDatabase(app), 'users'), user.uid), (snap) => {
          const au = userFromDict(snap)
          setAppUser(au)
          setUser(user)
          cancelLoad()
        }, () => { cancelLoad() })
      } else {
        setUser(null)
        cancelLoad()
      }

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
    isLoadingAuth: firebaseContext?.user === undefined,
    isAuthenticated: firebaseContext?.user != null,
    uploadUserImage: async (imageBlob: ArrayBuffer) => {
      if (firebaseContext?.user?.uid) {
        const ref = storageRef(storage, '/UserImages/' + (firebaseContext!.user!.uid ? firebaseContext!.user!.uid : ''))
        return await uploadBytes(ref, imageBlob)
          .then(async () => {
            return await getDownloadURL(ref)
              .then(url => Realtime.updateCurrentUser({ ...firebaseContext.appUser, ...{ image: url } }, auth, getDatabase(app)))
          })
      }
    },
    uploadEventImage: async (eventId: string, imageBlob: ArrayBuffer) => await uploadBytes(storageRef(storage, 'EventImages/' + eventId), imageBlob)
  }
}