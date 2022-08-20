import { useNavigate } from "react-router"
import { useCookies } from "../../context/CookieContext"
import { useFirebase } from "../../context/Firebase"
import { useGoogleState } from "../../context/GoogleMaps"
import { useBackgroundExtension, useDimExtension, useHeaderBackgroundExtension } from "../../context/HeaderContext"
import { useLanguage } from "../../context/Language"
import { useLoading } from "../../context/Loading"

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