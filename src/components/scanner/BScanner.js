import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { QrReader } from 'react-qr-reader';
import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_PINK, PRIMARY_WHITE, SECONDARY_WHITE } from "../../settings/colors";
import { PageHolder } from "../utilities/Holders";
import { useScanner } from '../../context/ScannerContext'
import Spacer from "../utilities/Spacer";
import { Button, Stack, TextField } from "@mui/material";
import './BScanner.css'
import { makeStyles } from "@mui/styles";
import { textFieldStyle } from "../../settings/styles";
import { useFirebase } from "../../context/Firebase";
import { useHeaderBackgroundExtension } from "../../context/HeaderContext";
import { useLoading } from "../../context/Loading";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getCurrentDate, getDateString } from "../../utilities";
function BScanner() {
    const location = useLocation()
    const nav = useNavigate()
    const { openScanner, isScanning, faceMode, setFaceMode, scannerLanguage, setScannerLanguage } = useScanner()
    useEffect(() => {
        if (!location.state)
            openScanner(scannerLanguage)
    }, [])
    const { user, appUser, firebase } = useFirebase()
    const inputRef = useRef()
    const [barcodes, setBarcodes] = useState()

    const [inScanningZone, setInScanningZone] = useState()
    const useStyles = makeStyles(textFieldStyle(PRIMARY_PINK, { background: PRIMARY_WHITE, direction: 'rtl' }))
    const classes = useStyles()
    const { doLoad, cancelLoad, openDialog } = useLoading()
    const { hideHeader, showHeader } = useHeaderBackgroundExtension()
    const [producingEventId, setProducingEventId] = useState()
    const [producingEvent, setProducingEvent] = useState()
    const selectionStyle = {
        background: SECONDARY_WHITE,
        width: '50%',
        padding: '8px',
        textAlign: 'center',
        alignSelf: 'center',
        margin: '16px'
    }
    const approve = (confirmation) => {
        const valid = () => {
            if (scannerLanguage === 'עברית') {
                return 'מספר נוסעים: '
            } else {
                return "عدد الركاب: "
            }
        }
        cancelLoad()
        openDialog({
            content: <Stack style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <label style={{ padding: '8px', color: SECONDARY_WHITE, fontWeight: '600' }}>{scannerLanguage === 'עברית' ? 'נסיעה מאושרת' : 'رحلة مصرٌحة'}</label>
                <label style={{ padding: '8px', color: SECONDARY_WHITE }}>{valid()}<b>{confirmation.amount}</b></label>
                <CheckCircleOutlineIcon style={{ alignItems: 'center', borderRadius: '32px', background: 'white', width: '64px', height: '64px', color: '#4BB543' }} />
            </Stack>
        })
    }

    const decline = () => {
        cancelLoad()
        openDialog({
            content: <Stack style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <label style={{ padding: '8px', color: SECONDARY_WHITE, fontWeight: '600' }}>{scannerLanguage === 'עברית' ? 'נסיעה לא מאושרת' : 'رحلة غير مصرٌحة'}</label>
                <ErrorOutlineIcon style={{ alignItems: 'center', borderRadius: '32px', background: 'white', width: '64px', height: '64px', color: '#bd3333' }} />
            </Stack>
        })
    }



    const updateScanResult = (res) => {
        if (res) {
            if (appUser.admin && !appUser.producingEventId) {
                nav({ pathname: '/scanResult', search: '?confirmationVoucher=' + res })
                return
            }
            let confirmation = barcodes.find(bcode => res === bcode.confirmationVoucher)
            if (confirmation) {
                if (confirmation.ridesLeft < 1) {
                    openDialog({
                        content: <Stack spacing={1} style={{ maxWidth: '300px', padding: '18px' }}>
                            <label style={{ color: 'white' }}>{'ברקוד זה נסרק כבר, ולא נשארו בו נסיעות'}</label>
                            <label style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>{'סריקה אחרונה ב: ' + (confirmation.lastScanDate ? getDateString(confirmation.lastScanDate) : getDateString(getCurrentDate()))}</label>
                        </Stack>
                    })
                    return
                }
                firebase.realTime.invalidateTransactionConfirmations(confirmation.confirmationVoucher, confirmation.twoWay ? (confirmation.ridesLeft === 2 ? 1 : 0) : 0)
                    .then(() => { approve(confirmation) })
                    .catch(decline)
            } else {
                alert('ברקוד לא מאושר')
            }
        }
    }


    useEffect(() => {
        if (appUser.admin) {
            setProducingEventId(0)
        } else {
            setProducingEventId(appUser.producingEventId)
        }

    }, [appUser])
    useEffect(() => {
        let sub = null;
        if (producingEventId !== 0) {
            sub = firebase.realTime.getPublicEventById(appUser.producingEventId, event => {
                setProducingEvent(event)
            })
        }
        return () => sub && sub();
    }, [producingEventId])
    useEffect(() => {
        hideHeader()
        return () => showHeader()
    }, [])

    const startProducerScanningSession = () => {
        doLoad()
        let unsub = firebase.realTime.getAllTransactionConfirmations(producingEventId, transactions => {
            setTimeout(() => {
                setBarcodes(transactions)
                setInScanningZone(true)
                cancelLoad()
                unsub()
            }, 1000)
        })
    }

    return <div style={{
        padding: '16px',
        borderRadius: '32px',
        height: '100%',
        maxWidth: '500px',
        display: 'flex',
        marginTop: '32px',
        minHeight: '420px',
        marginBottom: '32px',
        alignItems: 'center',
        flexDirection: 'column',
        width: window.outerWidth < 400 ? '80%' : '60%',
        marginLeft: 'auto',
        marginRight: 'auto',
        background: 'black'
    }}>
        {!appUser.admin && <React.Fragment>
            <label style={{
                fontSize: '14px',
                color: 'white',
                direction: 'rtl'
            }}>
                שלום, {appUser.name}
            </label>
            <label style={{
                fontSize: '12px',
                color: 'white',
                direction: 'rtl'
            }}>
                <b> זהו דף סריקה לאירוע {producingEvent.eventName}<br /><span style={{ fontSize: '10px' }}>אנא וודא שאינך יוצא מהסורק במהלך סשן סריקה</span></b>
            </label>
        </React.Fragment>}
        {
            (function detEl() {
                if (inScanningZone || producingEventId === 0)
                    return <React.Fragment>
                        <Spacer offset={1} />
                        {!isScanning ? <button
                            style={{ background: PRIMARY_PINK, maxWidth: '200px' }}
                            onClick={() => {
                                openScanner(scannerLanguage)
                            }}>{scannerLanguage === 'עברית' ? 'פתח מצלמה' : `افتح الكاميرا`}</button> : <button
                                style={{ background: '#bd3333' }}
                                onClick={() => {
                                }}
                            >{scannerLanguage === 'עברית' ? 'סגור סורק' : `اغلق الكاميرا`}</button>}
                        <br />
                        <br />

                        <Stack>
                            <label style={{ color: SECONDARY_WHITE }}>{'כיוון מצלמה / الكاميرا'}</label>
                            <select style={selectionStyle}
                                value={faceMode}
                                onChange={(e) => {
                                    setFaceMode(e.target.value)
                                }}>
                                <option

                                    value={'user'}>
                                    {scannerLanguage === 'עברית' ? 'מצלמה קדמית' : `كاميرا أمامية`}
                                </option>
                                <option value={'environment'}>
                                    {scannerLanguage === 'עברית' ? 'מצלמה אחורית' : `كاميرا الرؤية الخلفية`}
                                </option>
                            </select>
                            <label style={{ color: SECONDARY_WHITE }}>{'שפה / لغة'}</label>
                            <select
                                value={scannerLanguage}
                                onChange={(val) => {
                                    setScannerLanguage(val.target.value)
                                }}
                                style={selectionStyle}>
                                <option style={{ color: 'black' }} value={'بالعربية'} >{'بالعربية'}</option>
                                <option value={'עברית'} >{'עברית'}</option>
                            </select>
                        </Stack>
                        <span style={{ color: SECONDARY_WHITE, fontSize: '12px' }}>{scannerLanguage === 'עברית' ? 'סורק זה דורש מצלמה של טלפון חכם' : `يتطلب هذا الماسح كاميرا هاتف ذكي`}</span>
                        <span>{scannerLanguage === 'עברית' ? 'אישור ידני' : 'تأكيد يدوي'}</span>
                        <input ref={inputRef} className="qr_code_num" placeholder={scannerLanguage === 'עברית' ? 'הכנס מספר אישור' : 'أدخل رقم التأكيد'}></input>
                        <button onClick={() => {
                            let val = inputRef.current.value
                            if (!val || val.length < 1) {
                                alert('יש להכניס מספר אישור')
                                return;
                            }
                            updateScanResult(val)
                        }} style={{ padding: '4px', paddingInline: '8px', marginTop: '16px', background: PRIMARY_ORANGE }}>{'אשר ידנית'}
                        </button>

                    </React.Fragment>
                else if (producingEvent)

                    return <Stack spacing={1}>

                        <Button
                            onClick={startProducerScanningSession}
                            style={{
                                background: 'white',
                                color: PRIMARY_PINK,
                                textTransform: 'none',
                                fontFamily: 'Open Sans Hebrew'
                            }}>
                            התחל סשן סריקה
                        </Button>
                    </Stack>
                else
                    return <label style={{ color: 'white', direction: 'rtl' }}>נראה שעדיין לא הוקצה לך אירוע..</label>
            })()
        }

    </div>
}

export default BScanner