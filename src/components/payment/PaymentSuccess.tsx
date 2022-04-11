
import { Stack } from '@mui/material'
import { Unsubscribe } from 'firebase/database'
import $ from 'jquery'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { useFirebase } from '../../context/Firebase'
import { useLanguage } from '../../context/Language'
import { LOADING, NOTFOUND, SIDE } from '../../settings/strings'
import { TransactionSuccess } from '../../store/payments/types'
import logo from '../../assets/images/logo_white.png'
import SectionTitle from '../SectionTitle'
import './PaymentSuccess.css'
import { TRANSACTION_DETAILS } from '../../settings/strings'
import { PageHolder, InnerPageHolder } from '../utilities/Holders'
import Spacer from '../utilities/Spacer'
import { useLoading } from '../../context/Loading'
import { ORANGE_GRADIENT_PRIMARY, SECONDARY_WHITE } from '../../settings/colors'
import { QRCodeSVG } from 'qrcode.react'
import { floatStyle } from '../WhatsApp'
function useQuery() {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search])
}
export default function PaymentSuccess() {

    const query = useQuery()

    const { firebase, appUser } = useFirebase()
    const location = useLocation()
    const { doLoad, cancelLoad, isLoading } = useLoading()
    const { lang } = useLanguage()
    const [transaction, setTransaction] = useState<TransactionSuccess | undefined>()
    useEffect(() => {

        let unsub: Unsubscribe | null = null;
        if (query.has('customer_uid') && query.has('transaction_uid')) {
            doLoad()
            unsub = firebase.realTime.getTransaction(query.get('customer_uid')!, query.get('transaction_uid')!, (trans) => {
                setTransaction(trans)
                cancelLoad()
            }, (e: Error) => {
                firebase.realTime.addError({
                    type: 'getTransaction',
                    error: '',
                    date: new Date().toISOString(),
                    errorId: '',
                    extraData: e
                })
                cancelLoad()
            })
        } else if (location.state && location.state as TransactionSuccess) {
            setTransaction(location.state as TransactionSuccess)
        } else {
            alert('wtf')
        }
        return () => { unsub && unsub() }
    }, [])


    useEffect(() => {

        const handleIndicatorPayment = () => {
            if (window.scrollY > 100) {
                $('#floating_indicator_payment')
                    .css('display', 'none')
            } else {
                $('#floating_indicator_payment')
                    .css('display', 'flex')
            }
        }


        window.addEventListener('scroll', handleIndicatorPayment)



        return () => { window.removeEventListener('scroll', handleIndicatorPayment) }
    }, [])
    return <PageHolder>
        {transaction ? <div>
            <SectionTitle style={{ marginTop: '8px', marginBottom: '0px' }} title={lang === 'heb' ? 'ברקוד' : 'Barcode'} />
            <br />
            <InnerPageHolder style={{ margin: '0px', width: '245px', height: '245px',background:ORANGE_GRADIENT_PRIMARY }}>
                <QRCodeSVG style={{ width: '171px', height: '171px' }} value={transaction.approval_num} />

                <span dir={SIDE(lang)} style={{ color: 'white', padding: '4px', margin: '4px', fontSize: '12px' }}>{(lang === 'heb' ? 'תוקף ברקוד: ' : 'Barcode expiration: ') + (lang === 'heb' ? (transaction.more_info.twoWay ? 'שני סריקות בלבד (שני כיוונים)' : 'סריקה אחת בלבד (כיוון אחד)') : (transaction.more_info.twoWay ? 'Two scans (Two directions)' : 'One Scan (One direction)'))}</span>
                <b><span dir={SIDE(lang)} style={{ color: SECONDARY_WHITE, padding: '4px', margin: '4px', fontSize: '14px' }}>{(lang === 'heb' ? 'מספר נוסעים: ' : 'Number of passengers: ') + transaction.more_info.amount}</span></b>

                <span dir={SIDE(lang)} style={{ color: SECONDARY_WHITE, fontWeight: 'bold', fontSize: '9px', marginTop: '10px' }}>{lang === 'heb' ? `נא לשים לב הברקוד תקף ל${transaction.more_info.twoWay ? 'שני כיוונים' : 'כיוון אחד'} ${!transaction.more_info.twoWay ? 'בלבד' : 'בלבד, סריקה לכל כיוון (הלוך חזור)'}, במידה ורכשת מספר כרטיסים הברקוד הנל מכיל את כולם.` : 'This barcode is not to be hand over, a single scan contains the ride approval for all the passengers above'}</span>
            </InnerPageHolder> </div> : null}
        <SectionTitle title={TRANSACTION_DETAILS(lang)} style={{}} />

        <InnerPageHolder style={{ direction: SIDE(lang) }}>
            {<div id='floating_indicator_payment'>

                <span>{lang === 'heb' ? 'קבלה למטה' : 'Barcode down'}</span>
                <KeyboardDoubleArrowDownIcon />
            </div>}
            {transaction ? <Stack className='payment_details_holder' dir={SIDE(lang)}>
                <label>{lang === 'heb' ? 'מוצר' : 'Product'}</label>
                {transaction ? <span>{transaction.more_info.productName}</span> : <span>{LOADING(lang)}</span>}
            
                <label>{lang === 'heb' ? 'כמות' : 'Product'}</label>
                {transaction ? <span>{transaction.more_info.amount}</span> : <span>{LOADING(lang)}</span>}
               
                <label>{lang === 'heb' ? 'כיווני נסיעה' : 'Product'}</label>
                {transaction ? <span>{transaction.more_info.twoWay ? 'שני כיוונים' : 'כיוון אחד'}</span> : <span>{LOADING(lang)}</span>}
                {transaction && !transaction.more_info.twoWay &&
                    <div><label>{lang === 'heb' ? 'כיוון נסיעה' : 'Product'}</label>
                        <span>{transaction.more_info.direction === '1' ? 'הלוך' : 'חזור'}</span></div>}
               
                <label>{lang === 'heb' ? 'סטאטוס' : 'Status'}</label>
                {transaction ? <span>{transaction.status_description}</span> : <span>{LOADING(lang)}</span>}
                
                <label>{lang === 'heb' ? 'סה"כ שולם' : 'Amount'}</label>
                {transaction ? <span>{transaction.amount + "₪"}</span> : <span>{LOADING(lang)}</span>}
              
                <label>{lang === 'heb' ? 'תאריך רכישה' : 'Purchase Date'}</label>
                {transaction ? <span>{transaction.date}</span> : <span>{LOADING(lang)}</span>}
         
                <label>{lang === 'heb' ? 'מספר אישור' : 'Approval Number'}</label>
                {transaction ? <span>{transaction.approval_num}</span> : <span>{LOADING(lang)}</span>}
           
                <label>{lang === 'heb' ? 'שם בעל הכרטיס' : 'Card holder name'}</label>
                {transaction ? <span>{transaction.card_holder_name}</span> : <span>{LOADING(lang)}</span>}
              
                <label>{lang === 'heb' ? 'סוג חיוב' : 'Type of purchase'}</label>
                {transaction ? <span>{transaction.number_of_payments === '1' ? (lang === 'heb' ? 'רגיל' : 'Normal') : lang === 'heb' ? 'תשלומים' : 'Payments'}</span> : <span>{NOTFOUND(lang)}</span>}
             
                <label>{lang === 'heb' ? 'מספר תשלומים' : 'Number of Payments'}</label>
                {transaction ? <span>{transaction.number_of_payments}</span> : <span>{LOADING(lang)}</span>}
           
                <label>{lang === 'heb' ? '4 ספרות אחרונות של כרטיס' : 'Four last digits of card'}</label>
                {transaction ? <span>{transaction.four_digits}</span> : <span>{LOADING(lang)}</span>}

            </Stack> : <h1 dir={SIDE(lang)} style={{ color: SECONDARY_WHITE, fontSize: '14px' }}>{lang === 'heb' ? 'קבלה לא נמצאה' : 'Receipt not found'}</h1>}

                    <img src = {logo} style = {{width:'fit-content',height:'25px',alignSelf:'flex-end',marginTop:'32px'}}></img>
        </InnerPageHolder>

    </PageHolder>
}