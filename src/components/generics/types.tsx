import { NavigateFunction } from "react-router"
import { ICookieContext } from "../../context/CookieContext"
import { IFirebaseContext } from "../../context/Firebase"
import { IGoogleContext } from "../../context/GoogleMaps"
import { IBackgroundExtension, IDimExtension, IHeaderBackgroundExtension } from "../../context/HeaderContext"
import { ILanguageContext } from "../../context/Language"
import { ILoadingContext } from "../../context/Loading"

export type Hooks = {
    firebase: IFirebaseContext,
    loading: ILoadingContext,
    language: ILanguageContext,
    nav: NavigateFunction,
    backgroundExt: IBackgroundExtension,
    headerExt: IHeaderBackgroundExtension,
    dimExt: IDimExtension,
    google: IGoogleContext
    cookies: ICookieContext
}