import { createContext } from "react"
import { useContext } from "react"
import { useState } from "react"
import $ from 'jquery'
import { PNPTransactionConfirmationExtended } from "../store/external/types"
const ScannerContext = createContext<IScanningContext | null>(null)

export type IScanningContext = {
    openScanner: boolean;
    faceMode: 'environment' | 'user';
    scannerLanguage: string,
    barCodes: PNPTransactionConfirmationExtended[] | undefined
    setBarcodes: (a: PNPTransactionConfirmationExtended[]) => void
    setScannerLanguage: (lang: string) => void,
    setFaceMode: (faceMode: 'environment' | 'user') => void;
    setOpenScanner: (open: boolean) => void;
}
export const ScanningContextProvider = (props: object) => {
    const [openScanner, setOpenScanner] = useState(false)
    const [barCodes, setBarcodes] = useState<PNPTransactionConfirmationExtended[] | undefined>()
    const [scannerLanguage, setScannerLanguage] = useState('עברית')
    const [faceMode, setFaceMode] = useState<'environment' | 'user'>('environment')
    return <ScannerContext.Provider value={{
        setOpenScanner,
        setFaceMode,
        barCodes,
        setBarcodes,
        setScannerLanguage,
        scannerLanguage,
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
    const openScanner = (language: string) => {
        $('.dim').css('display', 'inherit')
        scanningContext!.setOpenScanner(true)
        scanningContext!.setScannerLanguage(language)
        
    }
    const setScannerLanguage = (lang: string) => {
        scanningContext!.setScannerLanguage(lang)
    }
    const setBarcodes = (a:PNPTransactionConfirmationExtended[]) => {
        scanningContext!.setBarcodes(a)
    }
    return {
        isScanning: scanningContext?.openScanner,
        setFaceMode: (mode: 'environment' | 'user') => scanningContext?.setFaceMode(mode),
        faceMode: scanningContext?.faceMode,
        openScanner: openScanner,
        setBarcodes:setBarcodes,
        barCodes :scanningContext?.barCodes ,
        setScannerLanguage: (lang: string) => setScannerLanguage(lang),
        scannerLanguage: scanningContext?.scannerLanguage,
        closeScanner: closeScanner
    }
}