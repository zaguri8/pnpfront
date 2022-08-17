import { createContext } from "react"
import { useContext } from "react"
import { useState } from "react"
import $ from 'jquery'
import { SECONDARY_WHITE } from "../settings/colors"
import { AnimatePresence } from "framer-motion"
import { motion } from 'framer-motion'
import { PageHolder } from "../components/utilities/Holders"
const LoadingContext = createContext<ILoadingContext | null>(null)

export type ILoadingContext = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    openDialog: boolean;
    openPopover: boolean;
    setDialogContent: (content: any) => void
    setOpenDialog: (open: boolean) => void;
    setDialogTitle: (title: any) => void;
    setDialogBottom: (data: any) => void;
    setPopoverContent: (content: any) => void;
    setOpenPopover: (open: boolean) => void;
    popOverContent: any;
    dialogtitle: any;
    dialogbottom: any;
    dialogContent: any;
}

export const LoadingContextProvider = (props: object) => {
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogContent, setDialogContent] = useState(false)
    const [dialogtitle, setDialogTitle] = useState(null)
    const [dialogbottom, setDialogBottom] = useState(null)

    const [popOverContent, setPopoverContent] = useState(null)
    const [openPopover, setOpenPopover] = useState(false)


    return <LoadingContext.Provider value={{
        loading,
        setLoading,
        openDialog,
        setPopoverContent,
        setOpenPopover,
        openPopover,
        popOverContent,
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

    const openPopover = (content: any) => {
        loadingContext!.setPopoverContent(content)
        loadingContext!.setOpenPopover(true)
    }

    const showPopover = (content: any, status: 'success' | 'normal' | 'error') => {

        openPopover(<PageHolder className={`pop_over ${status}`}>
            {content}
        </PageHolder>);

        const EXEC_TIME = 3000;
        setTimeout(closePopover, EXEC_TIME);
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

    const closePopover = () => {
        loadingContext!.setPopoverContent(null)
        loadingContext!.setOpenPopover(false)
    }
    return {
        isLoading: loadingContext?.loading,
        doLoad: doLoad,
        cancelLoad: cancelLoad,
        closePopover: closePopover,
        showPopover: showPopover,
        openDialog: (content: any) => openDialog(content),
        openUnderConstruction: (lang: string) => openUnderConstruction(lang),
        openDialogWithTitle: (title: any) => setDialogTitle(title),
        openDialogWithBottom: (content: any) => setDialogBottom(content),
        isDialogOpened: loadingContext!.openDialog,
        dialogTitle: loadingContext!.dialogtitle,
        dialogBottom: loadingContext!.dialogbottom,
        content: loadingContext!.dialogContent,
        popoverContent: loadingContext!.popOverContent,
        closeDialog: closeDialog
    }
}