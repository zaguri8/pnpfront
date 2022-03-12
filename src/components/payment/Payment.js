import { InputLabel, List, TextField, Button, Checkbox } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { HtmlTooltip } from '../utilities/HtmlTooltip'
import { ACCEPT_TERMS_REQUEST, FILL_ALL_FIELDS, PAY_COMPLETE, TERMS_OF_USE, TOS } from '../../settings/strings'
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
    const { firebase, appUser, user } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()
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
        appUser && chargeCreditCard(appUser, transaction, firebase.realTime).then(res => {
            if (!res) {
                alert("אלון" + 'אירעתה שגיאה לא ידועה  אנא נסה שוב מאוחר יותר')
                cancelLoad()
                return
            }
            if (res.error) {
                alert(res.error)
            } else if (res.data && res.data.results && res.data.results.status === 'error') {
                alert(res.data.results.description)
            } else if (res.data.data) {
                alert('הזמנתך התקבלה בהצלחה. את/ה יכול/ה לראות את פרטי ההזמנה באיזור האישי')
            } else { alert('אירעתה שגיאה לא ידועה  אנא נסה שוב מאוחר יותר') }
            cancelLoad()
        })
    }

    const [transaction, setTransaction] = useState({
        customer: {
            customer_name: '',
            email: appUser ? appUser.email : user.email ? user.email : ''
        },
        credit_card: {
            auth_number: "",
            exp_mm: "",
            exp_yy: "",
            number: ""
        },
        "product": {
            "price": (ticketAmount * Number(product.price)) + "",
            "amount": ticketAmount,
            "name": product.name
        }
    })

    const setTicketAmountForProduct = (amount) => {
        setTransaction({
            ...transaction, ...{
                product: {
                    "price": transaction.product.price,
                    "amount": amount,
                    "name": transaction.product.name
                }
            }
        })
    }
    const setPriceForProduct = (price) => {
        setTransaction({
            ...transaction, ...{
                product: {
                    "price": price + "",
                    "amount": transaction.product.amount,
                    "name": transaction.product.name
                }
            }
        })
    }

    const setCreditCardNameHolder = (name) => {
        setTransaction({
            ...transaction, ...{
                customer: {
                    customer_name: name,
                    email: user.email
                }
            }
        })
    }

    const setCreditCardNumber = (number) => {
        setTransaction({
            ...transaction, ...{
                credit_card: {
                    auth_number: transaction.credit_card.auth_number,
                    exp_mm: transaction.credit_card.exp_mm,
                    exp_yy: transaction.credit_card.exp_yy,
                    number: number
                }
            }
        })
    }
    const setCreditCardExpMM = (expmm) => {
        setTransaction({
            ...transaction, ...{
                credit_card: {
                    auth_number: transaction.credit_card.auth_number,
                    exp_mm: expmm,
                    exp_yy: transaction.credit_card.exp_yy,
                    number: transaction.credit_card.number
                }
            }
        })
    }
    const setCreditCardExpYY = (expyy) => {
        setTransaction({
            ...transaction, ...{
                credit_card: {
                    auth_number: transaction.credit_card.auth_number,
                    exp_mm: transaction.credit_card.exp_mm,
                    exp_yy: expyy,
                    number: transaction.credit_card.number
                }
            }
        })
    }
    const setCreditCardAuth = (auth_number) => {
        setTransaction({
            ...transaction, ...{
                credit_card: {
                    auth_number: auth_number,
                    exp_mm: transaction.credit_card.exp_mm,
                    exp_yy: transaction.credit_card.exp_yy,
                    number: transaction.credit_card.number
                }
            }
        })
    }
    return (<List style={{ direction: SIDE(lang), width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ marginTop: '0px', padding: '4px', fontWeight: 'bold' }}>{PAYMENT_FOR_RIDE(lang)}</label><label style={{ padding: '4px', fontSize: '14px' }}>{`${product.desc}`}</label>

        <img style={{ width: '48px', height: '18px', alignSelf: 'center', marginBottom: '0px' }} src={credit_cards} />
        <TextField
            onChange={(e) => setCreditCardNameHolder(e.target.value)}
            style={{ margin: '4px', width: '80%' }}
            name='name'
            placeholder={CARD_HOLDER_NAME(lang)}
        />
        <TextField
            onChange={(e) => setCreditCardNumber(e.target.value)}
            style={{ margin: '4px', width: '80%' }}
            name='number'
            placeholder={CARD_NUMBER(lang)}
        />

        <label style={{ padding: '4px' }}>{EXPIRATION(lang)}</label>
        <div style={{ display: 'flex' }}>
            <TextField
                onChange={(e) => setCreditCardExpYY(e.target.value)}
                style={{ margin: '4px', width: '80%' }}
                name={'expiry'}
                placeholder={EXP_Y(lang)}
            />
            <TextField
                name='expiry'
                onChange={(e) => setCreditCardExpMM(e.target.value)}
                style={{ margin: '4px', width: '80%' }}
                placeholder={EXP_M(lang)}
            />


        </div>
        <TextField
            name='cvc'
            style={{ margin: '4px', width: '80%' }}
            onChange={(e) => setCreditCardAuth(e.target.value)}
            placeholder={CVV(lang)}
        />
        <span style={{ padding: '8px', display: 'flex', flexDirection: 'column', rowGap: '8px', alignItems: 'center', justifyContent: 'center', columnGap: '8px' }}>
            <div style={{ background: 'whitesmoke', display: 'flex', alignContent: 'center', alignItems: 'center', columnGap: '4px' }}>
                <AddIcon onClick={() => {
                    const newAmountAdded = ticketAmount + 1 <= 10 ? ticketAmount + 1 : 10
                    setTicketAmount(newAmountAdded)
                    setTicketAmountForProduct(newAmountAdded)
                    setPriceForProduct(newAmountAdded * Number(product.price))
                }} /><RemoveIcon onClick={() => {
                    const newAmountRemoved = ticketAmount - 1 >= 1 ? ticketAmount - 1 : 1
                    setTicketAmount(newAmountRemoved)
                    setTicketAmountForProduct(newAmountRemoved)
                    setPriceForProduct(newAmountRemoved * Number(product.price))
                }
                } /></div>
            <span>{`${AMOUNT_OF_TICKETS(lang)} ${ticketAmount}`}</span>
        </span>
        <label style={{ fontSize: '24px', padding: '4px', fontWeight: '100' }}>{TOTAL_TO_PAY(lang, Number(product.price) * ticketAmount)}</label>
        <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!isValidTransaction(transaction) ? FILL_ALL_FIELDS(lang) : !termsOfUser ? ACCEPT_TERMS_REQUEST(lang) : PAY_COMPLETE(lang)} arrow>
            <span>
                <Button onClick={requestPayment} sx={{ ...submitButton(false), ... { margin: '0px', padding: '8px', width: '100%' } }} disabled={!isValidTransaction(transaction) || !termsOfUser} >{PAY_COMPLETE(lang)}</Button>
            </span>
        </HtmlTooltip>
        <span style={{ padding: '8px' }}><InputLabel style={{fontSize:'14px',paddingTop:'16px', textAlign: 'center', marginLeft: '8px', marginRight: '8px' }}>{TERMS_OF_USE(lang)}</InputLabel>
            <Checkbox
                onChange={handleTermsOfUseChange}
                name={TERMS_OF_USE(lang)} value={TERMS_OF_USE(lang)} />
                <br/>
            <Link  to={'/termsOfService'}>{TOS(lang)}</Link>
        </span>
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