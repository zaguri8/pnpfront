import { useNavigate } from "react-router"
import { useCookies } from "../../context/CookieContext"
import { useUser } from "../../context/Firebase"
import { useGoogleState } from "../../context/GoogleMaps"
import { useBackgroundExtension, useDimExtension, useHeaderBackgroundExtension } from "../../context/HeaderContext"
import { useLanguage } from "../../context/Language"
import { useLoading } from "../../context/Loading"

type NamedHook = 'user' | "language" | "loading" | "nav" | "backgroundExt" | "headerExt" | "cookies" | "dimExt" | "google"
export const CommonHooks = ['user', 'loading', 'nav', 'language','headerExt','backgroundExt'] as NamedHook[]
export const getNamedHookGroup = (group: Array<NamedHook>) => {
    let map = {} as { [id: string]: any }
    group.forEach(hook => map[hook] = getNamedHook(hook))
    return map
}

export const getNamedHook = (name: NamedHook) => {
    switch (name) {
        case 'user':
            return useUser()
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
        const user = useUser()
        const loading = useLoading()
        const language = useLanguage()
        const nav = useNavigate()
        const backgroundExt = useBackgroundExtension()
        const headerExt = useHeaderBackgroundExtension()
        const cookies = useCookies()
        const dimExt = useDimExtension()
        const google = useGoogleState()
        return <Component {...props}  {... { user, loading, language, nav, backgroundExt, headerExt, cookies, dimExt, google }} /> as any
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
        return  <Component {...props} {...hooks} />
    }
}