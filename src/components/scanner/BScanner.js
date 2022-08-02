import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { QrReader } from 'react-qr-reader';
import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_PINK, PRIMARY_WHITE, SECONDARY_WHITE } from "../../settings/colors";
import { PageHolder } from "../utilities/Holders";
import { useScanner } from '../../context/ScannerContext'
import Spacer from "../utilities/Spacer";
import { Stack } from "@mui/material";
import './BScanner.css'
function BScanner() {
    const location = useLocation()
    const nav = useNavigate()
    const { openScanner, isScanning, faceMode, setFaceMode, scannerLanguage, setScannerLanguage } = useScanner()
    useEffect(() => {
        if (!location.state)
            openScanner(scannerLanguage)
    }, [])
    const inputRef = useRef()
    const selectionStyle = {
        background: SECONDARY_WHITE,
        width: '50%',
        padding: '8px',
        textAlign: 'center',
        alignSelf: 'center',
        margin: '16px'
    }

    const updateScanResult = (res) => {
        if (res) {
            try {
                const n = Number(res)
                nav({ pathname: '/scanResult', search: '?confirmationVoucher=' + res })
            } catch (e) {
                nav({ pathname: '/scanResult', search: '?confirmationVoucher=' + res })
            }
        }
    }
    return <div style={{
        padding: '16px',
        borderRadius: '32px',
        height: '100%',
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
        {/* {useScan && <QrReader
            scanDelay={0}
            
            videoStyle={{ maxWidth: window.outerWidth < 600 ? '100%' : '50%', maxHeight: window.outerWidth < 600 ? '400px' : '100%', height: window.outerWidth < 400 ? '400px' : '100%' }}
            onError={setError}
            style={{ maxWidth: window.outerWidth < 600 ? '100%' : '50%', maxHeight: window.outerWidth < 600 ? '400px' : '100%', height: window.outerWidth < 400 ? '400px' : '100%' }}
            videoContainerStyle={{ maxWidth: window.outerWidth < 600 ? '100%' : '50%', maxHeight: window.outerWidth < 600 ? '400px' : '100%', height: window.outerWidth < 400 ? '400px' : '100%' }}
            constraints={{ facingMode: { exact: faceMode } }}
            onResult={(result, error) => {
                if (!!result) {
                    updateScanResult(result)
                }
            }}
        />} */}
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
        }} style={{ padding: '4px', paddingInline: '8px', marginTop: '16px', background: PRIMARY_ORANGE }}>{'אשר ידנית'}</button>
    </div>
}

export default BScanner