import { Button, Stack } from "@mui/material"
import { QRCodeSVG } from "qrcode.react"
import React, { useEffect } from "react"
import { useLocation } from "react-router"
import { PRIMARY_PINK, PRIMARY_ORANGE, SECONDARY_WHITE } from "../../settings/colors"
import { SIDE } from "../../settings/strings"
import { boxShadow, submitButton } from "../../settings/styles"
import { withHook, withHookGroup } from "../generics/withHooks"
import { bImportantStyle } from "../payment/PaymentSuccess"
import { PageHolder } from "../utilityComponents/Holders"
export const PRIMARY_GRADIENT = `linear-gradient(45deg,${PRIMARY_PINK},${PRIMARY_ORANGE})`

function Barcode({ headerExt, loading, nav, backgroundExt, language }) {

    const location = useLocation()

    const articluateSpace = {
        padding: '16px',
        magrgin: '8px'
    }
    const generalSize = {
        width: '200px',
        height: '200px',
        margin: '8px', ...boxShadow()
    }


    useEffect(() => {
        headerExt.hideHeader()
        backgroundExt.changeBackgroundColor('black')
        headerExt.setHeaderBackground(`black`)
    }, [])

    return <PageHolder style={{ background: `linear-gradient(45deg,${PRIMARY_PINK},${PRIMARY_ORANGE})` }}>
        <label style={{ color: SECONDARY_WHITE, fontWeight: 'bold', marginTop: '32px' }}>{location.state.more_info.productName}</label>
        {location.state && <Stack
            alignItems={'center'}
            style={articluateSpace}>
            <QRCodeSVG
                style={generalSize}
                value={location.state.approval_num} />
            <span dir={SIDE(language.lang)}

                style={bImportantStyle}>{(language.lang === 'heb' ? 'תוקף ברקוד: ' : 'Barcode expiration: ') + (language.lang === 'heb' ? (location.state.more_info.twoWay ? 'שני סריקות בלבד (סריקה לכל כיוון)' : 'סריקה אחת בלבד (כיוון אחד)') : (location.state.more_info.twoWay ? 'Two scans (Two directions)' : 'One Scan (One direction)'))}</span>
            <b><span dir={SIDE(language.lang)} style={{ color: SECONDARY_WHITE, padding: '4px', margin: '4px', fontSize: '14px' }}>{(language.lang === 'heb' ? 'מספר נוסעים: ' : 'Number of passengers: ') + location.state.more_info.amount}</span></b>

            <span dir={SIDE(language.lang)} style={{ color: SECONDARY_WHITE, fontWeight: 'bold', fontSize: '9px', marginTop: '10px' }}>{language.lang === 'heb' ? 'במידה ורכשת מספר כרטיסים, הברקוד הנל מכיל את כולם.' : 'If you have purchased more then 1 ticket, the following barcode includes them as-well'}<b>{language.lang === 'heb' ? ' יש לעלות ביחד.' : 'Boarding together is required'}</b></span>
        </Stack>}
    </PageHolder>

}

export default withHookGroup(Barcode, ['headerExt', 'loading', 'nav', 'backgroundExt', 'language'])