import { MenuItem, Select, Stack } from "@mui/material"
import { useState } from "react"
import { QrReader } from "react-qr-reader"
import { useNavigate } from "react-router"
import { useFirebase } from "../../context/Firebase"
import { useScanner } from "../../context/ScannerContext"
import { useLoading } from '../../context/Loading'
import { SECONDARY_WHITE } from "../../settings/colors"
import { BARCODE_MESSAGE, CLOSE_SCANNER } from "../../settings/strings"

export default function Scanner() {
    const { appUser } = useFirebase()
    const nav = useNavigate()
    const { isScanning, closeScanner, faceMode, scannerLanguage, setScannerLanguage } = useScanner()

    const { openDialog } = useLoading()
    const updateScanResult = (res) => {
        if (res) {
            try {
                const n = Number(res.text)
                nav({ pathname: '/scanResult', search: '?confirmationVoucher=' + res.text })
            } catch (e) {
                nav({ pathname: '/scanResult', search: '?confirmationVoucher=' + res.text })
            }
        }
    }
    const fullscreen = {
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        zIndex: '9999',
        maxHeight: '100%',
        margin: '0px',
        top: '0px',
        background: 'black',
        display: 'flex',
        flexDirection: 'column'
    }
    return isScanning && appUser && appUser.producer ? <div style={fullscreen} >

        <QrReader
            videoStyle={{
                margin: '0px',
                padding: '0px',
                width: '100%',
                top: '0px',
                maxHeight: '100%',
                matchMedia: false,
                borderRadius: '8px'
            }}
            containerStyle={{ margin: '16px', maxHeight: '100%', border: '1px solid white', borderRadius: '8px' }}

            videoContainerStyle={{ maxHeight: '100%' }}
            constraints={{
                audio: false,
                facingMode: { exact: 'user' },
                aspectRatio: 1,
                frameRate:60
            }}
            onResult={(result, error) => {
                if (!!result) {
                    updateScanResult(result)
                    closeScanner()
                } else if (error) {
                    if (error.name === 'OverconstrainedError' || error.name === 'NotFoundError') {
                        openDialog({ content: <span style={{ padding: '12px', color: SECONDARY_WHITE }}>{scannerLanguage === 'עברית' ? 'מכשירך אינו תומך בסורק זה' : 'جهازك لا يدعم هذا الماسح'}</span> })
                        closeScanner()
                    }
                }
            }} />

        <Stack >
            <p
                dir={'rtl'}

                style={{ fontSize: '14px', fontWeight: '600', color: SECONDARY_WHITE, textAlign: 'center', marginLeft: '64px', marginRight: '64px' }}
            >{BARCODE_MESSAGE(scannerLanguage)}</p>
            <select
                value={scannerLanguage}
                onChange={(val) => {
                    setScannerLanguage(val.target.value)
                }}
                style={{
                    background: SECONDARY_WHITE,
                    width: '25%',
                    padding: '8px',
                    textAlign: 'center',
                    alignSelf: 'center',
                    margin: '16px'
                }}>
                <option style={{ color: 'black' }} value={'بالعربية'} >{'بالعربية'}</option>
                <option value={'עברית'} >{'עברית'}</option>
            </select>
        </Stack>

        <button
            style={{ marginLeft: '32px', marginRight: '32px' }}
            onClick={() => {
                closeScanner()
            }}
        >{CLOSE_SCANNER(scannerLanguage)}</button></div> : null
}