import { createContext } from "react"
import { useContext } from "react"
import { useState } from "react"
import $ from 'jquery'
const LoadingContext = createContext(null)
export const LoadingContextProvider = props => {
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
        loadingContext.setLoading(true)
    }
    const cancelLoad = () => {
        $('.dim').css('display', 'none')
        loadingContext.setLoading(false)
    }
    const openDialog = (content) => {
        loadingContext.setDialogContent(content)
        loadingContext.setOpenDialog(true)

    }
    const closeDialog = () => {
        loadingContext.setDialogContent(null)
        loadingContext.setOpenDialog(false)
    }
    return {
        isLoading: loadingContext.loading,
        doLoad: doLoad,
        cancelLoad: cancelLoad,
        openDialog: (content) => openDialog(content),
        isDialogOpened: loadingContext.openDialog,
        content:loadingContext.dialogContent,
        closeDialog: closeDialog
    }
}