import { InputLabel, List, Button, Checkbox } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import { HtmlTooltip } from '../utilities/HtmlTooltip'
import { ACCEPT_TERMS_REQUEST, CONTINUE_TO_SECURE_PAYMENT, TERMS_OF_USE, TOS } from '../../settings/strings'
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
import { DARK_BLACK, SECONDARY_WHITE } from '../../settings/colors'
import HTMLFromText from '../utilities/HtmlFromText'
export function PaymentForm({ product }) {

    const { lang } = useLanguage()
    const [termsOfUser, setTermsOfUse] = useState(false)
    const { closeDialog } = useLoading()
    const nav = useNavigate()
    const [ticketAmount, setTicketAmount] = useState(1)
    const [nameOnCard, setCreditCardNameHolder] = useState("")
    const [totalPrice, setTotalPrice] = useState(0)
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
            amount: ticketAmount
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
            })

    }


    const getElement = () => {
        return paymentLink ? <iframe style={{ minHeight: '500px', minWidth: '280px' }} src={paymentLink} /> : (
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: SECONDARY_WHITE, justifyContent: 'center' }}>


                    <span style={{ marginTop: '0px', padding: '4px', fontWeight: 'bold' }}>{PAYMENT_FOR_RIDE(lang)}</span>
                    <div style={{ padding: '8px' }}>
                        <HTMLFromText text={product.desc} />
                    </div>

                    <img style={{ width: '48px', height: '18px', alignSelf: 'center', marginBottom: '0px' }} src={credit_cards} />
                </div>

                <span style={{ padding: '8px', display: 'flex', flexDirection: 'column', rowGap: '8px', alignItems: 'center', justifyContent: 'center', columnGap: '8px' }}>
                    <div style={{ background: 'none', display: 'flex', alignContent: 'center', alignItems: 'center', columnGap: '4px' }}>
                        <AddIcon sx={{ cursor: 'pointer', background: DARK_BLACK, color: 'white' }} onClick={() => {
                            const newAmountAdded = ticketAmount + 1 <= 10 ? ticketAmount + 1 : 10
                            setTicketAmount(newAmountAdded)
                            setTotalPrice(newAmountAdded * Number(product.price))
                        }} /><RemoveIcon sx={{ cursor: 'pointer', background: DARK_BLACK, color: 'white' }} onClick={() => {
                            const newAmountRemoved = ticketAmount - 1 >= 1 ? ticketAmount - 1 : 1
                            setTicketAmount(newAmountRemoved)
                            setTotalPrice(newAmountRemoved * Number(product.price))
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
                <div style={{ padding: '8px' }}><InputLabel style={{ color: SECONDARY_WHITE, fontSize: '14px', paddingTop: '16px', textAlign: 'center', marginLeft: '8px', marginRight: '8px' }}>{TERMS_OF_USE(lang)}</InputLabel>
                    <Checkbox
                        onChange={handleTermsOfUseChange}
                        name={TERMS_OF_USE(lang)} value={TERMS_OF_USE(lang)} />
                    <br />
                    <Link style={{ color: SECONDARY_WHITE, textDecoration: 'underline' }} to={'/termsOfService'} onClick={closeDialog}>{TOS(lang)}</Link>
                </div></div>
        )
    }
    return (<List style={{ paddingTop: '0px', direction: SIDE(lang), width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {getElement()}
    </List >)
}
function Payment({ product }) {
    const { openDialog } = useLoading()
    const { lang } = useLanguage()

    const openRequestPaymentDialog = () => { openDialog({ content: <PaymentForm product={product} />, title: product.name }) }

    return <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center', width: '100%', alignItems: 'center', justifyContent: 'center' }}>

        <button onClick={() => openRequestPaymentDialog()}>{lang === 'heb' ? 'שלם' : 'Pay'}</button>
    </div>
}
export default Payment