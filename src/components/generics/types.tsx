import { Auth, User } from "firebase/auth"
import { NavigateFunction } from "react-router"
import { ICookieContext } from "../../context/CookieContext"
import { IFirebaseContext } from "../../context/Firebase"
import { IGoogleContext } from "../../context/GoogleMaps"
import { IBackgroundExtension, IDimExtension, IHeaderBackgroundExtension } from "../../context/HeaderContext"
import { ILanguageContext } from "../../context/Language"
import { PNPPage } from "../../cookies/types"
import { Realtime } from "../../store/external"
import { PNPRideConfirmation, PNPUser } from "../../store/external/types"


export type Hook = IFirebaseContext | ILanguageContext | {
    isLoading: boolean | undefined;
    doLoad: () => void;
    doLoadSpecial: (img: any) => void;
    cancelLoad: (keepDim?: boolean | undefined) => void;
    closePopover: () => void;
    showPopover: (content: any, status: "error" | "success" | "normal", EXEC_TIME?: number) => void;
    openDialog: (content: any) => void,
    openUnderConstruction: (lang: string) => void,
    openDialogWithTitle: (title: any) => void,
    openDialogWithBottom: (content: any) => void,
    isDialogOpened: boolean,
    dialogTitle: any,
    dialogBottom: any,
    content: any,
    popoverContent: any,
    closeDialog: () => void;
} | IBackgroundExtension | NavigateFunction | IHeaderBackgroundExtension | IDimExtension | IGoogleContext | ICookieContext
export type Hooks = {
    firebase: { firebase: { realTime: Realtime, auth: Auth, appUser: PNPUser | undefined | null, user: User | undefined | null } },
    loading: {
        isLoading: boolean | undefined;
        doLoad: () => void;
        doLoadSpecial: (img: any) => void;
        cancelLoad: (keepDim?: boolean | undefined) => void;
        closePopover: () => void;
        showPopover: (content: any, status: "error" | "success" | "normal", EXEC_TIME?: number) => void;
        openDialog: (content: any) => void,
        openUnderConstruction: (lang: string) => void,
        openDialogWithTitle: (title: any) => void,
        openDialogWithBottom: (content: any) => void,
        isDialogOpened: boolean,
        dialogTitle: any,
        dialogBottom: any,
        content: any,
        popoverContent: any,
        closeDialog: () => void;
    },
    language: ILanguageContext,
    nav: NavigateFunction,
    backgroundExt: IBackgroundExtension,
    headerExt: IHeaderBackgroundExtension,
    dimExt: IDimExtension,
    google: IGoogleContext
    cookies: ICookieContext & {
        getPageLastTimeCache: (page: PNPPage) => Date | null,
        isCacheValid: (page: PNPPage) => boolean,
        cacheDone: (page: PNPPage) => void,
        saveInvitationConfirmation: (invConfirmation: PNPRideConfirmation) => Promise<boolean>
        getInvitationConfirmation: (eventId: string) => Promise<PNPRideConfirmation | undefined>
    }
}
