
import { Stack } from '@mui/material'
import { Unsubscribe } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useFirebase } from '../../context/Firebase'
import { useLanguage } from '../../context/Language'
import { LOADING, NOTFOUND, SIDE } from '../../settings/strings'
import { TransactionSuccess } from '../../store/payments/types'
import SectionTitle from '../SectionTitle'
import './PaymentSuccess.css'
import { TRANSACTION_DETAILS } from '../../settings/strings'
import { PageHolder, InnerPageHolder } from '../utilities/Holders'
import Spacer from '../utilities/Spacer'
import { useLoading } from '../../context/Loading'
import { SECONDARY_WHITE } from '../../settings/colors'
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
        if (appUser && !location.state && query.has('customer_uid') && appUser.customerId === query.get('customer_uid') && query.has('transaction_uid')) {
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
        }
        return () => { unsub && unsub() }
    }, [])

    return <PageHolder>
        <SectionTitle title={TRANSACTION_DETAILS(lang)} style={{}} />
        <InnerPageHolder>
            {transaction ? <Stack className= 'payment_details_holder' dir={SIDE(lang)}>
                <label>{lang === 'heb' ? 'מוצר' : 'Product'}</label>
                {transaction ? <span>{transaction.more_info}</span> : <span>{LOADING(lang)}</span>}
                <Spacer offset={1} />
                <label>{lang === 'heb' ? 'סטאטוס' : 'Status'}</label>
                {transaction ? <span>{transaction.status_description}</span> : <span>{LOADING(lang)}</span>}
                <Spacer offset={1} />
                <label>{lang === 'heb' ? 'סה"כ שולם' : 'Amount'}</label>
                {transaction ? <span>{transaction.amount + "₪"}</span> : <span>{LOADING(lang)}</span>}
                <Spacer offset={1} />
                <label>{lang === 'heb' ? 'תאריך רכישה' : 'Purchase Date'}</label>
                {transaction ? <span>{transaction.date}</span> : <span>{LOADING(lang)}</span>}
                <Spacer offset={1} />
                <label>{lang === 'heb' ? 'מספר אישור' : 'Approval Number'}</label>
                {transaction ? <span>{transaction.approval_num}</span> : <span>{LOADING(lang)}</span>}
                <Spacer offset={1} />
                <label>{lang === 'heb' ? 'שם בעל הכרטיס' : 'Card holder name'}</label>
                {transaction ? <span>{transaction.card_holder_name}</span> : <span>{LOADING(lang)}</span>}
                <Spacer offset={1} />
                <label>{lang === 'heb' ? 'סוג חיוב' : 'Type of purchase'}</label>
                {transaction ? <span>{transaction.number_of_payments === '1' ? (lang === 'heb' ? 'רגיל' : 'Normal') : lang === 'heb' ? 'תשלומים' : 'Payments'}</span> : <span>{NOTFOUND(lang)}</span>}
                <Spacer offset={1} />
                <label>{lang === 'heb' ? 'מספר תשלומים' : 'Number of Payments'}</label>
                {transaction ? <span>{transaction.number_of_payments}</span> : <span>{LOADING(lang)}</span>}
                <Spacer offset={1} />
                <label>{lang === 'heb' ? '4 ספרות אחרונות של כרטיס' : 'Four last digits of card'}</label>
                {transaction ? <span>{transaction.four_digits}</span> : <span>{LOADING(lang)}</span>}

            </Stack> : <h1 style = {{color:SECONDARY_WHITE,fontSize:'14px'}}>{lang === 'heb' ? 'קבלה לא נמצאה' : 'Receipt not found'}</h1>}

        </InnerPageHolder>
    </PageHolder>
}