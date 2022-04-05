import { InputLabel, List, Button, Checkbox, Stack } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import { HtmlTooltip } from '../utilities/HtmlTooltip'
import { ACCEPT_TERMS_REQUEST, CONTINUE_TO_SECURE_PAYMENT, RIDE_INFO, TERMS_OF_USE, TOS } from '../../settings/strings'
import { submitButton } from '../../settings/styles'
import { useFirebase } from '../../context/Firebase'
import AddIcon from '@mui/icons-material/Add';
import { useLoading } from '../../context/Loading'
import { credit_cards } from '../../assets/images'

import RemoveIcon from '@mui/icons-material/Remove';
import { useLanguage } from "../../context/Language";
import { AMOUNT_OF_TICKETS, PAYMENT_FOR_RIDE, SIDE, TOTAL_TO_PAY } from '../../settings/strings'
import { useLocation, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_WHITE, SECONDARY_WHITE } from '../../settings/colors'
import HTMLFromText from '../utilities/HtmlFromText'
export function PaymentForm({ product }) {

    const { lang } = useLanguage()
    const [termsOfUser, setTermsOfUse] = useState(false)
    const { closeDialog } = useLoading()
    const nav = useNavigate()
    const [ticketAmount, setTicketAmount] = useState(1)
    const { firebase, appUser, user } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()
    const [paymentLink, setPaymentLink] = useState()
    const location = useLocation()
    const handleTermsOfUseChange = (e) => {
        setTermsOfUse(e.target.checked)
    }
    const requestPayment = () => {
        if (!firebase.auth.currentUser || !appUser) {
            nav('/login', { cachedLocation: location.pathname })
            return
        }

        if (!appUser.customerId || appUser.customerId.length < 1) {
            alert('יש לרענן את הדף לונסות שוב, משתמשים רשומים דרך גוגל, אנא צרו משתמש חדש')
            const email = user.email.split('@')[0]
            firebase.realTime.addUser({
                name: email ? email : 'Annonymous user',
                email: user.email,
                customerId: '',
                admin: false,
                phone: user.phoneNumber ? user.phoneNumber : '050-000-000',
                birthDate: 'unset',
                favoriteEvents: [],
                coins: 0,
                producer: false
            })
            return
        }
        doLoad()

        const customer = {
            customer_name: appUser.name,
            uid: appUser.customerId,
            email: user.email,
            phone: appUser.phone
        }

        const payProduct = {
            name: product.name,
            price: Number(product.price),
            amount: ticketAmount,
            eventId: product.eventId,
            rideId: product.rideId,
            startPoint:product.startPoint,
            twoWay: product.twoWay,
            direction: product.direction
        }

        const send = {
            customer: customer,
            product: payProduct
        }
        axios.post('https://nadavsolutions.com/gserver/paymentLink', send)
            .then(res => {
                if (res.data.data) {
                    setPaymentLink(res.data.data.payment_page_link)
                    cancelLoad()
                }
            }).catch(e => {
                console.log(e)
            })

    }


    const getElement = () => {
        return paymentLink ? <iframe style={{ minHeight: '500px', minWidth: '280px', maxWidth: '90%', maxHeight: '90%' }} src={paymentLink} /> : (
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: SECONDARY_WHITE, justifyContent: 'center' }}>


                    <span style={{ marginTop: '0px', padding: '0px', fontWeight: 'bold' }}>{PAYMENT_FOR_RIDE(lang)}</span>
                    <div style={{ padding: '8px' }}>
                        <HTMLFromText style={{ color: PRIMARY_WHITE, fontSize: '14px' }} text={RIDE_INFO(lang)} />
                        <hr style={{ borderWidth: '.1px', borderColor: 'gray' }} />
                        <Stack direction='row'>

                            <Stack  >
                                {product.exactStartPoint ? <div>
                                    <label style={{ display: 'block', fontWeight: 'bold' }}>
                                        {(lang === 'heb' ? 'נקודת יציאה' : 'Starting point: ')}
                                    </label>

                                    <label style={{ color: PRIMARY_WHITE, fontSize: '14px' }}>{product.exactStartPoint}</label></div> : null}
                                {product.exactBackPoint ? <div><label style={{ display: 'block', fontWeight: 'bold' }}>
                                    {(lang === 'heb' ? 'נקודת חזרה' : 'Back point: ')}
                                </label>
                                    <div>
                                        <label style={{ color: PRIMARY_WHITE, fontSize: '14px' }}>{(lang == 'heb' ? 'במקום בו האוטובוס הוריד בהלוך' : 'Same spot where the bus stopped on arrival')}</label> </div> </div> : ''}
                            </Stack>
                            <Stack >
                                {(product.twoWay || product.direction === '2') && <div><label style={{ fontWeight: 'bold' }}>
                                    {(lang === 'heb' ? 'שעת יציאה' : 'Ride time: ')}
                                </label>
                                    <div><label style={{ color: PRIMARY_WHITE, fontSize: '14px' }}>{product.rideTime}</label> </div></div>}
                                {(product.twoWay || product.direction === '1') && <div><label style={{ fontWeight: 'bold' }}>
                                    {(lang === 'heb' ? 'שעת חזרה' : 'Ride time: ')}
                                </label>
                                    <div><label style={{ color: PRIMARY_WHITE, fontSize: '14px' }}>{product.backTime}</label> </div></div>}
                            </Stack>
                        </Stack>
                        <hr style={{ borderWidth: '.1px', borderColor: 'gray' }} />
                    </div>

                    <img style={{ width: '48px', height: '18px', alignSelf: 'center', background: SECONDARY_WHITE, marginBottom: '0px' }} src={credit_cards} />
                </div>

                <span style={{ padding: '8px', display: 'flex', flexDirection: 'column', rowGap: '8px', alignItems: 'center', justifyContent: 'center', columnGap: '8px' }}>
                    <div style={{ background: 'none', display: 'flex', alignContent: 'center', alignItems: 'center', columnGap: '4px' }}>
                        <AddIcon sx={{ cursor: 'pointer', background: DARK_BLACK, color: 'white' }} onClick={() => {
                            const newAmountAdded = ticketAmount + 1 <= 10 ? ticketAmount + 1 : 10
                            setTicketAmount(newAmountAdded)
                        }} /><RemoveIcon sx={{ cursor: 'pointer', background: DARK_BLACK, color: 'white' }} onClick={() => {
                            const newAmountRemoved = ticketAmount - 1 >= 1 ? ticketAmount - 1 : 1
                            setTicketAmount(newAmountRemoved)
                        }
                        } /></div>
                    <span style={{ color: SECONDARY_WHITE }}>{`${AMOUNT_OF_TICKETS(lang)} ${ticketAmount}`}</span>
                </span>
                <label style={{ fontSize: '24px', padding: '4px', fontWeight: '100', color: SECONDARY_WHITE }}>{TOTAL_TO_PAY(lang, Number(product.price) * ticketAmount)}</label>
                <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!termsOfUser ? ACCEPT_TERMS_REQUEST(lang) : CONTINUE_TO_SECURE_PAYMENT(lang)} arrow>
                    <span>
                        <Button onClick={requestPayment}
                            sx={{ ...submitButton(false), ... { margin: '0px', padding: '8px', fontSize: '16px', marginTop: '16px', width: lang === 'heb' ? '75%' : '90%' } }}
                            disabled={!termsOfUser} >{CONTINUE_TO_SECURE_PAYMENT(lang)}</Button>
                    </span>
                </HtmlTooltip>

                <Stack  >


                    <label style={{ paddingTop: '16px', fontSize: '14px', color: SECONDARY_WHITE }}>{TERMS_OF_USE(lang)}</label>
                    <Checkbox
                        style={{ width: 'fit-content', alignSelf: 'center', background: ORANGE_GRADIENT_PRIMARY, color: SECONDARY_WHITE, margin: '8px' }}
                        onChange={handleTermsOfUseChange}
                        name={TERMS_OF_USE(lang)} value={TERMS_OF_USE(lang)} />

                    <Link
                        onClick={() => { closeDialog() }}
                        style={{ fontSize: '12px', paddingTop: '8px', textDecoration: 'underline', color: SECONDARY_WHITE }} to={'/termsOfService'}>{TOS(lang)}</Link>
                </Stack>
            </div>
        )
    }
    return (<List style={{ paddingTop: '0px', direction: SIDE(lang), width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {getElement()}
    </List >)
}