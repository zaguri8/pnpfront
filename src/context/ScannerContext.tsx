import { createContext } from "react"
import { useContext } from "react"
import { useState } from "react"
import $ from 'jquery'
const ScannerContext = createContext<IScanningContext | null>(null)

export type IScanningContext = {
    openScanner: boolean;
    faceMode: 'environment' | 'user';
    setFaceMode: (faceMode: 'environment' | 'user') => void;
    setOpenScanner: (open: boolean) => void;
}
export const ScanningContextProvider = (props: object) => {
    const [openScanner, setOpenScanner] = useState(false)
    const [scanContent, setScanContent] = useState(false)
    const [faceMode, setFaceMode] = useState<'environment' | 'user'>('environment')
    return <ScannerContext.Provider value={{
        setOpenScanner,
        setFaceMode,
        faceMode,
        openScanner
    }} {...props} />
}
export const useScanner = () => {
    const scanningContext = useContext(ScannerContext)

    const closeScanner = () => {
        $('.dim').css('display', 'none')
        scanningContext!.setOpenScanner(false)
    }
    const openScanner = () => {
        $('.dim').css('display', 'inherit')
        scanningContext!.setOpenScanner(true)
    }

    return {
        isScanning: scanningContext?.openScanner,
        setFaceMode: (mode: 'environment' | 'user') => scanningContext?.setFaceMode(mode),
        faceMode: scanningContext?.faceMode,
        openScanner: openScanner,
        closeScanner: closeScanner
    }
}