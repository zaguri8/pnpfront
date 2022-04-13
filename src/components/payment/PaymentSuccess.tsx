
import { Button, Stack } from '@mui/material'
import { Unsubscribe } from 'firebase/database'
import $ from 'jquery'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { useFirebase } from '../../context/Firebase'
import { useLanguage } from '../../context/Language'
import { LOADING, NOTFOUND, RIDE_INFO, SAME_SPOT, SIDE } from '../../settings/strings'
import { TransactionSuccess } from '../../store/payments/types'
import logo from '../../assets/images/logo_white.png'
import SectionTitle from '../SectionTitle'
import './PaymentSuccess.css'
import { TRANSACTION_DETAILS } from '../../settings/strings'
import { PageHolder, InnerPageHolder } from '../utilities/Holders'
import Spacer from '../utilities/Spacer'
import { useLoading } from '../../context/Loading'
import { ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_WHITE, SECONDARY_WHITE } from '../../settings/colors'
import { QRCodeSVG } from 'qrcode.react'
import { floatStyle } from '../WhatsApp'
import { submitButton } from '../../settings/styles'
import { PNPPublicRide } from '../../store/external/types'
import { isValidPublicRide } from '../../store/validators'
function useQuery() {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search])
}
export default function PaymentSuccess() {

    const query = useQuery()

    const { firebase, appUser } = useFirebase()
    const location = useLocation()
    const { doLoad, cancelLoad, isLoading, openDialog } = useLoading()
    const [ride, setRide] = useState<PNPPublicRide | undefined>()
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

    const openRideDetails = async () => {
        if (transaction) {

            if (!ride) {
                const eventId = transaction.more_info.eventId
                const rideId = transaction.more_info.rideId
                await firebase.realTime.getPublicRideById(eventId, rideId)
                    .then(dbRide => {
                        if (isValidPublicRide(dbRide)) {
                            openDialog({ content: getElement(dbRide) })
                            setRide(dbRide)
                        } else {
                            openDialog({ content: <label style={{ padding: '6px', color: SECONDARY_WHITE }}>{lang === 'heb' ? 'פרטי הסעה זו אינם קיימים, ייתכן שזו הסעה ישנה ' : 'There is no details for this ride in the system, it might be an exp[red ride'}</label> })
                        }
                    }).catch(console.log)
            } else {
                openDialog({ content: getElement(ride) })
            }
        }
    }

    const getElement = (product: PNPPublicRide) => {

        return (<div>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', padding: '8px', alignItems: 'center', color: SECONDARY_WHITE, justifyContent: 'center' }}>
                <div style={{ padding: '8px' }}>
                    <label dir={SIDE(lang)}>{(lang === 'heb' ? 'הסעה ל' : 'Ride to ') + transaction!.more_info.productName}</label>
                    <hr style={{ borderWidth: '.1px', borderColor: 'gray' }} />
                    <Stack direction='row'>
                        <Stack>
                            {product.extras.exactStartPoint ? <div>
                                <label style={{ display: 'block', fontWeight: 'bold' }}>
                                    {(lang === 'heb' ? 'נקודת יציאה' : 'Starting point: ')}
                                </label>

                                <label style={{ color: PRIMARY_WHITE, fontSize: '14px' }}>{product.extras.exactStartPoint}</label></div> : null}
                            {product.extras.exactBackPoint ? <div><label style={{ display: 'block', fontWeight: 'bold' }}>
                                {(lang === 'heb' ? 'נקודת חזרה' : 'Back point: ')}
                            </label>
                                <div>
                                    <label style={{ color: PRIMARY_WHITE, fontSize: '14px' }}>{SAME_SPOT(lang)}</label> </div> </div> : ''}
                        </Stack>

                        <Stack >
                            {(product.extras.twoWay || product.extras.rideDirection === '2') && <div><label style={{ fontWeight: 'bold' }}>
                                {(lang === 'heb' ? 'שעת יציאה' : 'Ride time: ')}
                            </label>
                                <div><label style={{ color: PRIMARY_WHITE, fontSize: '14px' }}>{product.rideTime}</label> </div></div>}
                            {(product.extras.twoWay || product.extras.rideDirection === '1') && <div><label style={{ fontWeight: 'bold' }}>
                                {(lang === 'heb' ? 'שעת חזרה' : 'Back time: ')}
                            </label>
                                <div><label style={{ color: PRIMARY_WHITE, fontSize: '14px' }}>{product.backTime}</label> </div></div>}
                        </Stack>
                    </Stack>
                </div>
            </div>
        </div>
        )
    }


    return <PageHolder>
        {transaction ? <div>
            <SectionTitle style={{ marginTop: '8px', marginBottom: '0px' }} title={lang === 'heb' ? 'ברקוד' : 'Barcode'} />
            <br />
            <InnerPageHolder style={{ margin: '0px', width: '245px', height: lang === 'heb' ? '320px' : '365px', background: ORANGE_GRADIENT_PRIMARY }}>
                <label dir={SIDE(lang)} style={{ color: SECONDARY_WHITE, padding: '8px', fontSize: '12px' }}>{lang === 'heb' ? 'שימו לב לשעות היציאה והחזרה - יש להגיע 10 דק לפני. ההסעה לא תחכה למאחרים.' : 'Pay attention to the departure and return hours - you must arrive 10 minutes before. The shuttle will not wait for the latecomers.'}</label>
                <QRCodeSVG style={{ width: '171px', height: '171px' }} value={transaction.approval_num} />

                <span dir={SIDE(lang)} style={{ color: 'white', padding: '4px', margin: '4px', fontSize: '12px' }}>{(lang === 'heb' ? 'תוקף ברקוד: ' : 'Barcode expiration: ') + (lang === 'heb' ? (transaction.more_info.twoWay ? 'שני סריקות בלבד (שני כיוונים)' : 'סריקה אחת בלבד (כיוון אחד)') : (transaction.more_info.twoWay ? 'Two scans (Two directions)' : 'One Scan (One direction)'))}</span>
                <b><span dir={SIDE(lang)} style={{ color: SECONDARY_WHITE, padding: '4px', margin: '4px', fontSize: '14px' }}>{(lang === 'heb' ? 'מספר נוסעים: ' : 'Number of passengers: ') + transaction.more_info.amount}</span></b>

                <span dir={SIDE(lang)} style={{ color: SECONDARY_WHITE, fontWeight: 'bold', fontSize: '9px', marginTop: '10px' }}>{lang === 'heb' ? `נא לשים לב הברקוד תקף ל${transaction.more_info.twoWay ? 'שני כיוונים' : 'כיוון אחד'} ${!transaction.more_info.twoWay ? 'בלבד' : 'בלבד, סריקה לכל כיוון (הלוך חזור)'}, במידה ורכשת מספר כרטיסים הברקוד הנל מכיל את כולם.` : 'This barcode is not to be hand over, a single scan contains the ride approval for all the passengers above'}</span>
            </InnerPageHolder>

        </div> : null}
        {transaction && <InnerPageHolder style={{ borderRadius: '0px', padding: '0px', border: 'none', background: 'none' }}>
            <Button

                onClick={openRideDetails}
                style={{ ...submitButton(false), ...{ textTransform: 'none', width: '100%', maxWidth: '300px', padding: '0px', margin: '0px' } }}>{lang === 'heb' ? 'הצג פרטי הסעה' : 'Show ride details'}</Button>
        </InnerPageHolder>}
        <SectionTitle title={TRANSACTION_DETAILS(lang)} style={{}} />


        <InnerPageHolder style={{ direction: SIDE(lang) }}>
            {<div id='floating_indicator_payment'>

                <span>{lang === 'heb' ? 'קבלה למטה' : 'Receipt down'}</span>
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

            <img src={logo} style={{ maxWidth: '200px', height: '25px', alignSelf: 'flex-end', marginTop: '32px' }}></img>
        </InnerPageHolder>
    </PageHolder>
}