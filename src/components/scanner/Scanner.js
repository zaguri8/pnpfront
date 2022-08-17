import { MenuItem, Select, Stack } from "@mui/material"
import { useState } from "react"
import { QrReader } from "react-qr-reader"
import { useNavigate } from "react-router"
import { useFirebase } from "../../context/Firebase"
import { useScanner } from "../../context/ScannerContext"
import { useLoading } from '../../context/Loading'
import { SECONDARY_WHITE } from "../../settings/colors"
import { BARCODE_MESSAGE, CLOSE_SCANNER } from "../../settings/strings"

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
export default function Scanner() {
    const { appUser } = useFirebase()
    const nav = useNavigate()
    const { isScanning, closeScanner, faceMode, scannerLanguage, setScannerLanguage, barCodes, setBarcodes } = useScanner()
    const { openDialog, doLoad, cancelLoad, showPopover } = useLoading()

    const approve = (confirmation) => {
        const valid = () => {
            if (scannerLanguage === 'עברית') {
                return 'מספר נוסעים: '
            } else {
                return "عدد الركاب: "
            }
        }

        cancelLoad()
        showPopover(<Stack style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Stack direction={'row'} style={{ width: '100%', direction: 'rtl' }} spacing={1}>
                <CheckCircleOutlineIcon style={{ alignItems: 'center', borderRadius: '32px', background: 'transparent', width: '64px', height: '25px', color: '#4BB543' }} />
                <label style={{ padding: '2px', color: SECONDARY_WHITE, fontWeight: '600' }}>{scannerLanguage === 'עברית' ? 'נסיעה מאושרת' : 'رحلة مصرٌحة'}</label>
            </Stack>

            <label style={{ padding: '0px', margin: '0px' }}>{valid()}</label><b>{confirmation.amount}</b>
            <label style={{ padding: '0px', margin: '0px' }}>{"שם אירוע: "}</label><b>CHAN HASHAYAROT</b>
            <label style={{ padding: '0px', margin: '0px' }}>{"יעד נסיעה: "}</label><b>Tel Aviv בורסא</b>

        </Stack>, 'success')
    }

    const decline = () => {
        cancelLoad()
        showPopover(<Stack style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <label style={{ padding: '8px', color: SECONDARY_WHITE, fontWeight: '600' }}>{scannerLanguage === 'עברית' ? 'נסיעה לא מאושרת' : 'رحلة غير مصرٌحة'}</label>
            <ErrorOutlineIcon style={{ alignItems: 'center', borderRadius: '32px', background: 'white', width: '64px', height: '64px', color: '#bd3333' }} />
        </Stack>, 'error')
    }

    const updateScanResult = (res) => {
        if (res) {
            if (appUser.admin && !appUser.producingEventId) {
                nav({ pathname: '/scanResult', search: '?confirmationVoucher=' + res })
                return
            }
            let confirmationIdx = barCodes.findIndex(bcode => res === bcode.confirmationVoucher)
            let confirmation = barCodes[confirmationIdx]
            if (confirmation) {
                if (confirmation.ridesLeft < 1) {
                    showPopover(<Stack spacing={1} style={{ maxWidth: '300px', padding: '18px' }}>
                        <label style={{ color: 'white' }}>{'ברקוד זה נסרק כבר, ולא נשארו בו נסיעות'}</label>
                        <label style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>{'סריקה אחרונה ב: ' + (confirmation.lastScanDate ? getDateString(confirmation.lastScanDate) : getDateString(getCurrentDate()))}</label>
                    </Stack>, 'normal')
                    return
                }

                firebase.realTime.invalidateTransactionConfirmations(confirmation.confirmationVoucher, confirmation.twoWay ? (confirmation.ridesLeft === 2 ? 1 : 0) : 0)
                    .then(() => {
                        let temp = barCodes
                        temp[confirmationIdx].ridesLeft = temp[confirmationIdx].ridesLeft - 1
                        approve(confirmation)
                        setBarcodes(temp)
                    })
                    .catch(decline)
            } else {
                decline()
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
                facingMode: { exact: 'evironment' },
                aspectRatio: 1,
                frameRate: 60
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