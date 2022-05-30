import { createContext } from "react"
import { useContext } from "react"
import { useState } from "react"
import $ from 'jquery'
import { SECONDARY_WHITE } from "../settings/colors"
const LoadingContext = createContext<ILoadingContext | null>(null)

export type ILoadingContext = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    setDialogTitle: (title: any) => void;
    setDialogBottom: (data: any) => void;
    dialogtitle: any;
    dialogbottom: any;
    dialogContent: any;
    setDialogContent: (content: any) => void
}
export const LoadingContextProvider = (props: object) => {
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogContent, setDialogContent] = useState(false)
    const [dialogtitle, setDialogTitle] = useState(null)
    const [dialogbottom, setDialogBottom] = useState(null)
    return <LoadingContext.Provider value={{
        loading,
        setLoading,
        openDialog,
        dialogtitle,
        dialogbottom,
        setDialogBottom,
        setDialogTitle,
        setOpenDialog,
        dialogContent,
        setDialogContent
    }} {...props} />
}
export const useLoading = () => {
    const loadingContext = useContext(LoadingContext)

    const doLoad = () => {
        $('.dim').css('display', 'block')
        loadingContext!.setLoading(true)
    }
    const cancelLoad = (keepDim?: boolean) => {
        if (!keepDim) {
            $('.dim').css('display', 'none')
        } else {
            $('.dim').css('display', 'block')
        }
        loadingContext!.setLoading(false)
    }
    const openDialog = (content: any) => {
        loadingContext!.setDialogContent(content)
        loadingContext!.setOpenDialog(true)
    }
    const setDialogTitle = (content: any) => {
        loadingContext!.setDialogTitle(content)
    }

    const setDialogBottom = (content: any) => {
        loadingContext!.setDialogBottom(content)
    }

    const openUnderConstruction = (lang: string) => {
        alert(lang === 'heb' ? 'תחום זה בבנייה , ויחזור לזמינות בקרוב' : 'This area is under construction and will be available shortly')
    }
    const closeDialog = () => {
        loadingContext!.setDialogContent(null)
        loadingContext!.setOpenDialog(false)
        loadingContext!.setDialogTitle(null)
        loadingContext!.setDialogBottom(null)
    }
    return {
        isLoading: loadingContext?.loading,
        doLoad: doLoad,
        cancelLoad: cancelLoad,
        openDialog: (content: any) => openDialog(content),
        openUnderConstruction: (lang: string) => openUnderConstruction(lang),
        openDialogWithTitle: (title: any) => setDialogTitle(title),
        openDialogWithBottom: (content: any) => setDialogBottom(content),
        isDialogOpened: loadingContext!.openDialog,
        dialogTitle: loadingContext!.dialogtitle,
        dialogBottom: loadingContext!.dialogbottom,
        content: loadingContext!.dialogContent,
        closeDialog: closeDialog
    }
}