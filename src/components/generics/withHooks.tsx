import React, { useEffect } from "react"
import { useNavigate } from "react-router"
import { useCookies } from "../../context/CookieContext"
import { useFirebase } from "../../context/Firebase"
import { useGoogleState } from "../../context/GoogleMaps"
import { useBackgroundExtension, useDimExtension, useHeaderBackgroundExtension } from "../../context/HeaderContext"
import { useLanguage } from "../../context/Language"
import { useLoading } from "../../context/Loading"
import { Hook, Hooks } from "./types"

type NamedHook = "firebase" | "language" | "loading" | "nav" | "backgroundExt" | "headerExt" | "cookies" | "dimExt" | "google"
export const CommonHooks = ['firebase', 'loading', 'nav', 'language','headerExt','backgroundExt'] as NamedHook[]
export const getNamedHookGroup = (group: Array<NamedHook>) => {
    let map = {} as { [id: string]: any }
    group.forEach(hook => map[hook] = getNamedHook(hook))
    return map
}

export const getNamedHook = (name: NamedHook) => {
    switch (name) {
        case "firebase":
            return useFirebase()
        case "language":
            return useLanguage()
        case "loading":
            return useLoading()
        case "nav":
            return useNavigate()
        case "backgroundExt":
            return useBackgroundExtension()
        case "headerExt":
            return useHeaderBackgroundExtension()
        case "cookies":
            return useCookies()
        case "dimExt":
            return useDimExtension()
        case "google":
            return useGoogleState()
    }
}

export function withHooks<T>(Component: any) {
    return (props: T) => {
        const firebase = useFirebase()
        const loading = useLoading()
        const language = useLanguage()
        const nav = useNavigate()
        const backgroundExt = useBackgroundExtension()
        const headerExt = useHeaderBackgroundExtension()
        const cookies = useCookies()
        const dimExt = useDimExtension()
        const google = useGoogleState()
        return <Component {...props}  {... { firebase, loading, language, nav, backgroundExt, headerExt, cookies, dimExt, google }} /> as any
    }
}

export function withHook<P>(Component: any, namedHook: NamedHook) {
    return (props: P) => {
        const mapping = {} as any
        mapping[namedHook] = getNamedHook(namedHook)
        return <Component {...props} {...mapping} />
    }
}

export function withHookGroup<P>(Component: any, namedHook: Array<NamedHook>) {
    return (props: P) => {
        const hooks = getNamedHookGroup(namedHook)
        return <Component {...props} {...hooks} />
    }
}