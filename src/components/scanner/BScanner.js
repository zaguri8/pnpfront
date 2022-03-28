import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { QrReader } from 'react-qr-reader';
import { SECONDARY_WHITE } from "../../settings/colors";
function BScanner() {
    const [data, setData] = useState('No result');
    const nav = useNavigate()
    //  nav({ pathname: '/scanResult', search: '?confirmationVoucher=' + result.text })


    const [scan, setScan] = useState()
    const [error, setError] = useState()


    const [useScan, setUseScan] = useState(false)
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
    return <div>
        {!useScan ? <button onClick={() => {
            setUseScan(true)
        }}>{'סרוק'}</button> : <button
            onClick={() => {
                setUseScan(false)
            }}
        >{'בטל'}</button>}
        <br />
        <br />
        <select style={{ padding: '4px' }} onChange={(e) => {
            setFaceMode(e.target.value)
        }}>
            <option value={'user'}>
                {'מצלמה קדמית'}
            </option>
            <option value={'environment'}>
                {'מצלמה אחורית'}
            </option>
        </select>
        {useScan && <QrReader
            containerStyle={{ maxWidth: window.outerWidth < 400 ? '75%' : '50%', maxHeight: '75%', marginLeft: 'auto', marginRight: 'auto' }}
            onError={setError}

            constraints={{ facingMode: { exact: faceMode } }}
            onResult={(result, error) => {
                if (!!result) {
                    updateScanResult(result)
                }
            }}
        />}
        <br />
        <br />
    </div>
}

export default BScanner