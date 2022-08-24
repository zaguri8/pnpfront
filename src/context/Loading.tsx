import { createContext } from "react"
import { useContext } from "react"
import { useState } from "react"
import $ from 'jquery'
import { SECONDARY_WHITE } from "../settings/colors"
import { AnimatePresence } from "framer-motion"
import { motion } from 'framer-motion'
import { PageHolder } from "../components/utilityComponents/Holders"
const LoadingContext = createContext<ILoadingContext | null>(null)
const queue: any[] = []
let isShowingPopover = false
export type ILoadingContext = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    openDialog: boolean;
    setLoadingContent: (content: any) => void;
    loadingContent: any;
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
    const [loadingContent, setLoadingContent] = useState(null)
    const [popOverContent, setPopoverContent] = useState(null)
    const [openPopover, setOpenPopover] = useState(false)


    return <LoadingContext.Provider value={{
        loading,
        setLoading,
        openDialog,
        setPopoverContent,
        setOpenPopover,
        setLoadingContent,
        loadingContent,
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
        loadingContext!.setLoadingContent(null)
    }
    const openDialog = (content: any) => {
        loadingContext!.setDialogContent(content)
        loadingContext!.setOpenDialog(true)
    }

    const openPopover = (content: any) => {
        loadingContext!.setPopoverContent(content)
        loadingContext!.setOpenPopover(true)
        isShowingPopover = true;
    }


    const showPopover = (content: any, status: 'success' | 'normal' | 'error', EXEC_TIME: number = 3000) => {
        if (!isShowingPopover) {
            const pop = queue.pop()
            if (pop) {
                openPopover(<PageHolder className={`pop_over ${pop.status}`}>
                    {pop.content}
                </PageHolder>)
                queue.push({ content, status, EXEC_TIME })
            } else {
                openPopover(<PageHolder className={`pop_over ${status}`}>
                    {content}
                </PageHolder>)
            }
            if (EXEC_TIME > 0)
                setTimeout(closePopover, EXEC_TIME)
        } else {
            if (queue[queue.length - 1] !== { content, status, EXEC_TIME })
                queue.push({ content, status, EXEC_TIME })
            if (EXEC_TIME > 0)
                setTimeout(() => {
                    showPopover(content, status, EXEC_TIME)
                }, 200)
        }

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
        isShowingPopover = false
    }
    const doSpecialLoad = (content: any) => {
        loadingContext!.setLoadingContent(content)
        doLoad()
    }
    return {
        isLoading: loadingContext?.loading,
        doLoad: doLoad,
        cancelLoad: cancelLoad,
        doLoadSpecial: doSpecialLoad,
        loadingContent: loadingContext!.loadingContent,
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