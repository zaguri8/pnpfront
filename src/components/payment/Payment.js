import { InputLabel, List, TextField, Button, Checkbox } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { HtmlTooltip } from '../utilities/HtmlTooltip'
import { ACCEPT_TERMS_REQUEST, CONTINUE_TO_SECURE_PAYMENT, FILL_ALL_FIELDS, PAY_COMPLETE, TERMS_OF_USE, TOS } from '../../settings/strings'
import { submitButton } from '../../settings/styles'
import { useFirebase } from '../../context/Firebase'
import AddIcon from '@mui/icons-material/Add';
import { useLoading } from '../../context/Loading'
import { credit_cards } from '../../assets/images'
import { isValidTransaction } from '../../store/validators'

import RemoveIcon from '@mui/icons-material/Remove';
import { useLanguage } from "../../context/Language";
import { chargeCreditCard } from '../../store/payments'
import { AMOUNT_OF_TICKETS, CARD_HOLDER_NAME, CARD_NUMBER, CVV, EXPIRATION, EXP_M, EXP_Y, PAYMENT_FOR_RIDE, SIDE, TOTAL_TO_PAY } from '../../settings/strings'
import { useLocation, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
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
        doLoad()

        const customer = {
            customer_name: appUser.name,
            uid: appUser.customerId,
            email: appUser.email,
            phone: appUser.phone
        }
        const payProduct = {
            name: product.name,
            price: Number(product.price) * ticketAmount,
            amount: 1
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
        return paymentLink ? <iframe style={{ minHeight: '500px', minWidth: '320px' }} src={paymentLink} /> : (
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>


                    <span style={{ marginTop: '0px', padding: '4px', fontWeight: 'bold' }}>{PAYMENT_FOR_RIDE(lang)}</span>
                    <label style={{ padding: '4px', fontSize: '14px' }}>{`${product.desc}`}</label>

                    <img style={{ width: '48px', height: '18px', alignSelf: 'center', marginBottom: '0px' }} src={credit_cards} />
                </div>

                <span style={{ padding: '8px', display: 'flex', flexDirection: 'column', rowGap: '8px', alignItems: 'center', justifyContent: 'center', columnGap: '8px' }}>
                    <div style={{ background: 'none', display: 'flex', alignContent: 'center', alignItems: 'center', columnGap: '4px' }}>
                        <AddIcon sx={{ cursor: 'pointer', background: 'orange', color: 'white' }} onClick={() => {
                            const newAmountAdded = ticketAmount + 1 <= 10 ? ticketAmount + 1 : 10
                            setTicketAmount(newAmountAdded)
                            setTotalPrice(newAmountAdded * Number(product.price))
                        }} /><RemoveIcon sx={{ cursor: 'pointer', background: 'orange', color: 'white' }} onClick={() => {
                            const newAmountRemoved = ticketAmount - 1 >= 1 ? ticketAmount - 1 : 1
                            setTicketAmount(newAmountRemoved)
                            setTotalPrice(newAmountRemoved * Number(product.price))
                        }
                        } /></div>
                    <span>{`${AMOUNT_OF_TICKETS(lang)} ${ticketAmount}`}</span>
                </span>
                <label style={{ fontSize: '24px', padding: '4px', fontWeight: '100' }}>{TOTAL_TO_PAY(lang, Number(product.price) * ticketAmount)}</label>
                <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!termsOfUser ? ACCEPT_TERMS_REQUEST(lang) : CONTINUE_TO_SECURE_PAYMENT(lang)} arrow>
                    <span>
                        <Button onClick={requestPayment}
                            sx={{ ...submitButton(false), ... { margin: '0px', padding: '8px',fontSize:'16px',marginTop:'16px', width: '75%' } }}
                            disabled={!termsOfUser} >{CONTINUE_TO_SECURE_PAYMENT(lang)}</Button>
                    </span>
                </HtmlTooltip>
                <span style={{ padding: '8px' }}><InputLabel style={{ fontSize: '14px', paddingTop: '16px', textAlign: 'center', marginLeft: '8px', marginRight: '8px' }}>{TERMS_OF_USE(lang)}</InputLabel>
                    <Checkbox
                        onChange={handleTermsOfUseChange}
                        name={TERMS_OF_USE(lang)} value={TERMS_OF_USE(lang)} />
                    <br />
                    <Link to={'/termsOfService'} onClick={closeDialog}>{TOS(lang)}</Link>
                </span></div>
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