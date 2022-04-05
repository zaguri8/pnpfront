import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { QrReader } from 'react-qr-reader';
import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_WHITE, SECONDARY_WHITE } from "../../settings/colors";
import { PageHolder } from "../utilities/Holders";
import { useScanner } from '../../context/ScannerContext'
import Spacer from "../utilities/Spacer";
function BScanner() {
    const location = useLocation()
    const { openScanner, isScanning, faceMode, setFaceMode } = useScanner()

    useEffect(() => {
        if (!location.state)
            openScanner()
    }, [])
    return <div style={{
        padding: '16px',
        borderRadius: '32px',
        height: '100%',
        marginTop: '32px',
        minHeight: '420px',
        marginBottom: '32px',
        width: window.outerWidth < 400 ? '80%' : '60%',
        marginLeft: 'auto',
        marginRight: 'auto',
        background: ORANGE_GRADIENT_PRIMARY
    }}>


        <Spacer offset={1} />
        {!isScanning ? <button
            style={{ background: DARK_BLACK }}
            onClick={() => {
                openScanner()
            }}>{'פתח סורק'}</button> : <button
                style={{ background: '#bd3333' }}
                onClick={() => {
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
        <span style={{ color: SECONDARY_WHITE, fontSize: '12px' }}>{'סורק זה דורש מצלמה של טלפון חכם'}</span>
        <br />

        <br />
    </div>
}

export default BScanner