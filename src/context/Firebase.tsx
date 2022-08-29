import { useContext, useState, useEffect } from "react"
import { StoreSingleton } from "../store/external";
import { Unsubscribe } from "firebase/auth";
import { onValue } from "firebase/database";

import { User } from "firebase/auth";
import React from "react";
import { PNPUser } from "../store/external/types";
import 'firebase/compat/app'
import { uploadBytes, ref as storageRef, getDownloadURL } from "firebase/storage";
import { ref, child } from "firebase/database";
import { userFromDict } from "../store/external/converters";

import { useLoading } from "./Loading";

export interface IUserContext {
  user: User | undefined | null;
  appUser: PNPUser | null | undefined;
  error: Error | null;
  setUser: (user: User | null | undefined) => void;
  setAppUser: (user: PNPUser | null) => void;
}
const UserContext = React.createContext<IUserContext | null>(null);
export const UserContextProvider = (props: object) => {
  const [user, setUser] = useState<User | null | undefined>()
  const [appUser, setAppUser] = useState<PNPUser | null | undefined>(undefined)
  const [error, setError] = useState<Error | null>(null)
  const { cancelLoad, doLoad } = useLoading()
  useEffect(() => {
    doLoad()
    let tools = StoreSingleton.getTools()
    const unsubscribe = tools.auth.onAuthStateChanged((user) => {
      let unsub: Unsubscribe | null = null
      if (user) {
        unsub = onValue(child(ref(tools.db, 'users'), user.uid), (snap) => {
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


  return <UserContext.Provider value={{ user, appUser, error, setAppUser, setUser }} {...props} />
}


export const useUser = () => {
  const firebaseContext: IUserContext | null = useContext(UserContext)
  let tools = StoreSingleton.getTools()
  return {
    ...firebaseContext,
    signOut: async () => {
      firebaseContext?.setUser(null)
      firebaseContext?.setAppUser(null)
      return await tools.auth.signOut()
    },
    isLoadingAuth: firebaseContext?.user === undefined,
    isAuthenticated: firebaseContext?.user != null,
    uploadUserImage: async (imageBlob: ArrayBuffer) => {
      if (firebaseContext?.user?.uid) {
        const ref = storageRef(tools.realTime.storage, '/UserImages/' + (firebaseContext!.user!.uid ? firebaseContext!.user!.uid : ''))
        return await uploadBytes(ref, imageBlob)
          .then(async () => {
            return await getDownloadURL(ref)
              .then(url => tools.realTime.updateCurrentUser({ ...firebaseContext.appUser, ...{ image: url } }))
          })
      }
    },
    uploadEventImage: async (eventId: string, imageBlob: ArrayBuffer) => await uploadBytes(storageRef(tools.realTime.storage, 'EventImages/' + eventId), imageBlob)
  }
}