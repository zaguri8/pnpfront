import { useEffect, useState } from 'react'
import { useFirebase } from '../../context/Firebase'
import { useLoading } from '../../context/Loading'
import { v4 } from 'uuid'
import { SIDE } from '../../settings/strings'
import { ORANGE_GRADIENT_PRIMARY, SECONDARY_WHITE } from '../../settings/colors'
import { useLanguage } from '../../context/Language'
import { Button } from '@mui/material'
import { PageHolder } from '../utilities/Holders'
import { submitButton } from '../../settings/styles'
import { useNavigate } from 'react-router'
import SectionTitle from '../SectionTitle'
const MyPayments = () => {
    const { firebase, user, appUser } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()
    const nav = useNavigate()
    const { lang } = useLanguage()
    const [transactions, setTransactions] = useState()
    useEffect(() => {
        let unsub = null
        if (user && appUser) {
            doLoad()
            unsub = firebase.realTime.getAllTransactions(appUser.customerId, (trans) => {
                setTransactions(trans)
                cancelLoad()
            }, (e) => {
                firebase.realTime.addError({
                    type: 'getAllTransactions',
                    error: '',
                    date: new Date().toISOString(),
                    errorId: '',
                    extraData: e
                })
                cancelLoad()
            })
        }
        return () => unsub && unsub()
    }, [])

    const TransactionRow = ({ transaction, index }) => {
        return (transaction ? <tr style={{ display: 'flex', justifyContent: 'space-around', background: index % 2 === 0 ? 'white' : 'whitesmoke', color: 'black', padding: '8px' }}>
            <td style={{ fontSize: '10px', maxWidth: '120px', textAlign: 'center' }}>{transaction.date}</td>
            <td style={{ fontSize: '10px', maxWidth: '120px', textAlign: 'center' }}>{transaction.more_info}</td>
            <td style={{ fontSize: '10px', maxWidth: '120px', textAlign: 'center' }}><Button
                onClick={() => nav('/payment/success', { state: transaction })}
                style={{ ...submitButton(false), ...{textTransform:'none', width: '100%', paddingLeft: '4px', paddingRight: '4px', fontSize: '16px' } }}>{lang === 'heb' ? 'הצג פירוט' : 'Show details'}</Button></td>
        </tr> : null)
    }



    return (transactions && transactions.length > 0 ? <PageHolder>
        <SectionTitle title={lang === 'heb' ? 'היסטוריית רכישות' : 'Ride History'} style={{}} />
        <table style={{ marginTop: '32px', width: window.outerWidth < 500 ? '90%' : '75%', maxWidth: '500px' }} id={'transactions_table'}>

            <tbody id='table_transactions_content' dir={SIDE(lang)} style={{ alignItems: 'center' }}>
                <tr style={{ backgroundImage: ORANGE_GRADIENT_PRIMARY, height: 'fit-content', color: 'white', display: 'flex', justifyContent: 'space-around', padding: '8px', alignItems: 'center' }}>
                    <th style={{ fontSize: '10px', maxWidth: '120px', textAlign: 'center' }}>{lang === 'heb' ? 'תאריך' : 'Date'}</th>
                    <th style={{ fontSize: '10px', maxWidth: '120px', textAlign: 'center' }}>{lang === 'heb' ? 'נסיעה' : 'Ride'}</th>
                    <th style={{ fontSize: '10px', maxWidth: '120px', textAlign: 'center' }}>{lang === 'heb' ? 'פרטים' : 'Details'}</th>
                </tr>
                {transactions.map((trans, index) => <TransactionRow key={v4()} transaction={trans} index={index} />)}
            </tbody>
        </table></PageHolder> : <h1 style={{ color: SECONDARY_WHITE }}>{lang === 'heb' ? 'אין נסיעות' : 'No Rides'}</h1>)
}
export default MyPayments