import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { QrReader } from 'react-qr-reader';
import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_WHITE, SECONDARY_WHITE } from "../../settings/colors";
import { PageHolder } from "../utilities/Holders";
import Spacer from "../utilities/Spacer";
function BScanner() {

    const nav = useNavigate()
    const [error, setError] = useState()

    const location = useLocation()
    const [useScan, setUseScan] = useState(!location.state)
    const updateScanResult = (res) => {
        if (res) {
            try {
                const n = Number(res.text)
                nav({ pathname: '/scanResult', search: '?confirmationVoucher=' + res.text })
            } catch (e) {
                alert('ברקוד לא תקין')
            }
        }
    }
    const [faceMode, setFaceMode] = useState('environment')
    return <div style={{
        padding: '16px',
        borderRadius: '32px',
        height: '100%',
        marginTop: '32px',
        minHeight:'420px',
        marginBottom:'32px',
        width: window.outerWidth < 400 ? '80%' : '60%',
        marginLeft: 'auto',
        marginRight: 'auto',
        background: ORANGE_GRADIENT_PRIMARY
    }}>

        <Spacer offset={1} />
        {!useScan ? <button
            style={{ background: DARK_BLACK }}
            onClick={() => {
                setUseScan(true)
            }}>{'פתח סורק'}</button> : <button
                style={{ background: '#bd3333' }}
                onClick={() => {
                    setUseScan(false)
                }}
            >{'סגור סורק'}</button>}
        <br />
        <br />
        <select style={{ padding: '4px', margin: '4px', fontSize: '16px' }}
            value={faceMode}
            onChange={(e) => {
                setFaceMode(e.target.value)
            }}>
            <option

                value={'user'}>
                {'מצלמה קדמית'}
            </option>
            <option value={'environment'}>
                {'מצלמה אחורית'}
            </option>
        </select>
        <br />
        {useScan && <QrReader
            containerStyle={{ maxWidth: window.outerWidth < 400 ? '75%' : '50%', maxHeight: '100%', marginLeft: 'auto', marginRight: 'auto' }}
            onError={setError}
            constraints={{ facingMode: { exact: faceMode } }}
            onResult={(result, error) => {
                if (!!result) {
                    updateScanResult(result)
                }
            }}
        />}
        <span style={{ color: SECONDARY_WHITE, fontSize: '12px' }}>{'סורק זה דורש מצלמה של טלפון חכם'}</span>
        <br />

        <br />
    </div>
}

export default BScanner