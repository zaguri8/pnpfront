
import { Button, Stack } from '@mui/material'
import { Unsubscribe } from 'firebase/database'
import $ from 'jquery'
import waze from '../../assets/images/waze.png'
import googleMap from '../../assets/images/google-maps.png'
import React, { useEffect, useState } from 'react'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { useLocation } from 'react-router-dom'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { useFirebase } from '../../context/Firebase'
import { useNavigate } from 'react-router'
import { useLanguage } from '../../context/Language'
import { LOADING, NAVIGATION, NOTFOUND, RIDE_INFO, SAME_SPOT, SIDE } from '../../settings/strings'
import { TransactionSuccess } from '../../store/payments/types'
import logo from '../../assets/images/logo_white.png'
import SectionTitle from '../SectionTitle'
import './PaymentSuccess.css'
import { TRANSACTION_DETAILS } from '../../settings/strings'
import { PageHolder, InnerPageHolder } from '../utilities/Holders'
import Spacer from '../utilities/Spacer'
import { useLoading } from '../../context/Loading'
import { BLACK_ELEGANT, DARKER_BLACK_SELECTED, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_PINK, PRIMARY_WHITE, SECONDARY_WHITE } from '../../settings/colors'
import { QRCodeSVG } from 'qrcode.react'
import { floatStyle } from '../WhatsApp'
import { boxShadow, submitButton } from '../../settings/styles'
import { PNPPublicRide } from '../../store/external/types'
import { isValidPublicRide } from '../../store/validators'
import MapComponent from '../MapComponent';
import { useGoogleState } from '../../context/GoogleMaps'
import { useHeaderBackgroundExtension } from '../../context/HeaderContext'
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
    const nav = useNavigate()
    const [transaction, setTransaction] = useState<TransactionSuccess | undefined>()

    const { hideHeader, showHeader } = useHeaderBackgroundExtension()
    useEffect(() => {
        hideHeader();
        return () => showHeader()
    })
    useEffect(() => {
        if (!query) { nav('/'); return }
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
            if (window.scrollY > 250) {
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
        if (isLoading) return;
        if (transaction) {

            if (!ride) {
                doLoad()
                const eventId = transaction.more_info.eventId
                const rideId = transaction.more_info.rideId
                await firebase.realTime.getPublicRideById(eventId, rideId)
                    .then(dbRide => {
                        cancelLoad()
                        if (isValidPublicRide(dbRide)) {

                            openDialog({ content: getElement(dbRide) })
                            setRide(dbRide)
                        } else {
                            openDialog({ content: <label style={{ padding: '6px', color: SECONDARY_WHITE }}>{lang === 'heb' ? 'פרטי הסעה זו אינם קיימים, ייתכן שזו הסעה ישנה ' : 'There is no details for this ride in the system, it might be an exp[red ride'}</label> })
                        }
                    }).catch(() => { cancelLoad() })
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
    const [center, setCenter] = useState<{ lat: number, lng: number } | undefined>()
    function navFunc(center: { lat: number, lng: number }) {
        window.open(
            'https://www.google.com/maps/search/?api=1&query=' + center.lat + ',' + center.lng
        )
    }
    const { google } = useGoogleState()

    function codeAddress(address: string) {
        if (google && google !== null && google.maps) {
            let geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function (results: any, status: any) {
                if (status == google.maps.GeocoderStatus.OK) {
                    let lat = results[0].geometry.location.lat()
                    let lng = results[0].geometry.location.lng()
                    setCenter({ lat: lat, lng: lng })

                }
                else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });
        }
    }
    useEffect(() => {
        if (transaction)
            codeAddress(transaction.more_info.startPoint)
    }, [google, transaction])
    const bImportantStyle = {
        color: SECONDARY_WHITE,
        padding: '4px',
        minWidth: 'max-content',
        borderRadius: '2px',
        border: '.1px solid whitesmoke',
        background: 'black',
        margin: '8px',
        fontWeight: 'bold',
        fontSize: '12px'
    }

    return <PageHolder style={{ overflowX: 'hidden' }}>
        {transaction ? <div>
            <SectionTitle style={{ marginBottom: '4px' }} title={lang === 'heb' ? 'ברקוד' : 'Barcode'} />

            <InnerPageHolder style={{ background: 'none', border: 'none', margin: '0px', width: '250px', padding: '0px', height: 'fit-content' }}>
                <label dir={SIDE(lang)}
                    style={{
                        ...{
                            color: SECONDARY_WHITE,
                            display: 'flex',
                            margin: '8px',
                            flexDirection: 'column',
                            alignItems: 'center',
                            fontSize: '12px'
                        }, ... { border: 'none', fontWeight: 'bold' }
                    }}>
                    <InfoRoundedIcon style={{ padding: '2px', borderRadius: '16px', color: 'white' }} />
                    {lang === 'heb' ? 'שימו לב לשעות היציאה והחזרה - יש להגיע 10 דקות לפני. ההסעה לא תחכה למאחרים.' : 'Pay attention to the departure and return hours - you must arrive 10 minutes before. The shuttle will not wait for the latecomers.'}</label>

                <span dir={SIDE(lang)}

                    style={bImportantStyle}>{(lang === 'heb' ? 'תוקף ברקוד: ' : 'Barcode expiration: ') + (lang === 'heb' ? (transaction.more_info.twoWay ? 'שני סריקות בלבד (סריקה לכל כיוון)' : 'סריקה אחת בלבד (כיוון אחד)') : (transaction.more_info.twoWay ? 'Two scans (Two directions)' : 'One Scan (One direction)'))}</span>
                <b><span dir={SIDE(lang)} style={{ color: SECONDARY_WHITE, padding: '4px', margin: '4px', fontSize: '14px' }}>{(lang === 'heb' ? 'מספר נוסעים: ' : 'Number of passengers: ') + transaction.more_info.amount}</span></b>

                <span dir={SIDE(lang)} style={{ color: SECONDARY_WHITE, fontWeight: 'bold', fontSize: '9px', marginTop: '10px' }}>{lang === 'heb' ? 'במידה ורכשת מספר כרטיסים, הברקוד הנל מכיל את כולם.' : 'If you have purchased more then 1 ticket, the following barcode includes them as-well'}<b>{lang === 'heb' ? ' יש לעלות ביחד.' : 'Boarding together is required'}</b></span>
                <Spacer offset={1} />
                <Button style={{
                    fontFamily: 'Open Sans Hebrew',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    color: PRIMARY_WHITE,
                    width: '100%',
                    background: PRIMARY_PINK
                }} onClick={() => {
                    openDialog({
                        content: <div>
                            <QRCodeSVG style={{ width: '171px', height: '171px', margin: '8px' }} value={transaction.approval_num} />


                            <Spacer offset={1} />
                            <label style={{ color: PRIMARY_ORANGE }}>{'צלמו מסך למועד האירוע !'}</label>
                        </div>
                    })
                }}>{lang === 'heb' ? 'הצג ברקוד' : 'Show barcode'}</Button>
            </InnerPageHolder>

        </div> : null}
        {transaction && <InnerPageHolder style={{ background: 'none', borderRadius: '0px', padding: '0px', border: 'none' }}>
            <Button

                onClick={openRideDetails}
                style={{ ...submitButton(false), ...{ textTransform: 'none', width: '100%', backgroundColor: PRIMARY_ORANGE, maxWidth: '300px', padding: '0px', margin: '0px' } }}>{lang === 'heb' ? 'הצג פרטי הסעה' : 'Show ride details'}</Button>
        </InnerPageHolder>}
        {center && <React.Fragment>
            <SectionTitle title={NAVIGATION(lang)} style={{ paddingBottom: '0px' }} />
            <InnerPageHolder style={{ background: 'none', border: 'none' }}>
                <MapComponent mapProps={{
                    center: center,
                    zoom: 15,
                    content: null,
                    containerStyle: {
                        zIndex: 0,
                        transform: 'translateY(-32px)',
                        width: '300px',
                        border: '1px solid white',
                        height: '300px', ...boxShadow()
                    }
                }} />
                <div style={{ zIndex: 1, border: '.1px solid white', padding: '4px', alignItems: 'center', borderBottomRightRadius: '8px', borderBottomLeftRadius: '8px', width: '293px', justifyContent: 'space-between', display: 'flex', flexDirection: 'row', transform: 'translateY(-156px)' }}>
                    <img
                        src={waze}
                        style={{ cursor: 'pointer', height: '30px', width: '30px', margin: '4px', ...boxShadow() }}
                        alt={'נווט עם וויז'}
                        onClick={() => {
                            window.open(`https://waze.com/ul?ll=${center.lat},${center.lng}&navigate=yes`)
                        }}
                    >
                    </img>
                    <label style={{ color: SECONDARY_WHITE }}>בחר אפליקציית ניווט</label>
                    <img
                        src={googleMap}
                        style={{ cursor: 'pointer', height: '25px', width: '20px', margin: '4px', ...boxShadow() }}
                        alt={'נווט עם גוגל'}
                        onClick={() => {
                            navFunc(center)
                        }}
                    >
                    </img>
                </div>
            </InnerPageHolder>


        </React.Fragment>}


        <SectionTitle title={TRANSACTION_DETAILS(lang)} style={{ transform: 'translateY(-176px)' }} />
        <InnerPageHolder style={{ border: '.5px solid white', background: 'rgb(0,0,0,0.2)', transform: 'translateY(-176px)', direction: SIDE(lang) }}>
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

                {/* <label>{lang === 'heb' ? 'שם בעל הכרטיס' : 'Card holder name'}</label>
                {transaction ? <span>{transaction.card_holder_name}</span> : <span>{LOADING(lang)}</span>} */}

                <label>{lang === 'heb' ? 'סוג חיוב' : 'Type of purchase'}</label>
                {transaction ? <span>{transaction.number_of_payments === '1' ? (lang === 'heb' ? 'רגיל' : 'Normal') : lang === 'heb' ? 'תשלומים' : 'Payments'}</span> : <span>{NOTFOUND(lang)}</span>}

                <label>{lang === 'heb' ? 'מספר תשלומים' : 'Number of Payments'}</label>
                {transaction ? <span>{transaction.number_of_payments}</span> : <span>{LOADING(lang)}</span>}

                {/* <label>{lang === 'heb' ? '4 ספרות אחרונות של כרטיס' : 'Four last digits of card'}</label>
                {transaction ? <span>{transaction.four_digits}</span> : <span>{LOADING(lang)}</span>} */}

            </Stack> : <h1 dir={SIDE(lang)} style={{ color: SECONDARY_WHITE, fontSize: '14px' }}>{lang === 'heb' ? 'קבלה לא נמצאה' : 'Receipt not found'}</h1>}

            <img src={logo} style={{ maxWidth: '200px', height: '25px', alignSelf: 'flex-end', marginTop: '32px' }}></img>
        </InnerPageHolder>


    </PageHolder>
}