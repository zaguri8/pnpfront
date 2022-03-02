import { createContext } from "react"
import { useContext } from "react"
import { useState } from "react"
import $ from 'jquery'
const LoadingContext = createContext<ILoadingContext | null>(null)

export type ILoadingContext = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    dialogContent: any;
    setDialogContent: (content: any) => void
}
export const LoadingContextProvider = (props: object) => {
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogContent, setDialogContent] = useState(false)
    return <LoadingContext.Provider value={{
        loading,
        setLoading,
        openDialog,
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
    const cancelLoad = () => {
        $('.dim').css('display', 'none')
        loadingContext!.setLoading(false)
    }
    const openDialog = (content: any) => {
        loadingContext!.setDialogContent(content)
        loadingContext!.setOpenDialog(true)
    }
    const closeDialog = () => {
        loadingContext!.setDialogContent(null)
        loadingContext!.setOpenDialog(false)
    }
    return {
        isLoading: loadingContext!.loading,
        doLoad: doLoad,
        cancelLoad: cancelLoad,
        openDialog: (content:any) => openDialog(content),
        isDialogOpened: loadingContext!.openDialog,
        content: loadingContext!.dialogContent,
        closeDialog: closeDialog
    }
}