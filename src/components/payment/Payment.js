import { List, Button, Checkbox, Stack, TextField } from '@mui/material'
import axios from 'axios'
import { makeStyles } from '@mui/styles'
import $ from 'jquery'
import './Payment.css'
import React, { useEffect, useState } from 'react'
import { HtmlTooltip } from '../utilities/HtmlTooltip'
import { ACCEPT_TERMS_REQUEST, CONTINUE_TO_SECURE_PAYMENT, FULL_NAME, PHONE_NUMBER, RIDE_INFO, SAME_SPOT, TERMS_OF_USE, TOS } from '../../settings/strings'
import { submitButton, textFieldStyle } from '../../settings/styles'
import { useFirebase } from '../../context/Firebase'
import AddIcon from '@mui/icons-material/Add';
import { useLoading } from '../../context/Loading'
import { credit_cards } from '../../assets/images'
import bit from '../../assets/images/bit.png'
import RemoveIcon from '@mui/icons-material/Remove';
import { useLanguage } from "../../context/Language";
import { AMOUNT_OF_TICKETS, PAYMENT_FOR_RIDE, SIDE, TOTAL_TO_PAY } from '../../settings/strings'
import { useLocation, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { DARKER_BLACK_SELECTED, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_WHITE, SECONDARY_BLACK, SECONDARY_WHITE } from '../../settings/colors'
import HTMLFromText from '../utilities/HtmlFromText'
import { isValidPhoneNumber } from '../../utilities';
export function PaymentForm({ product }) {

    const { lang } = useLanguage()
    const { closeDialog } = useLoading()
    const nav = useNavigate()
    const [ticketAmount, setTicketAmount] = useState(1)
    const { firebase, appUser, user } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()
    const [paymentLink, setPaymentLink] = useState()
    const location = useLocation()
    const [extraPeople, setExtraPeople] = useState([])
    const requestPayment = () => {
        if (!firebase.auth.currentUser || !appUser) {
            nav('/login', { cachedLocation: location.pathname })
            return
        }
        if (extraPeople.length > 0) {
            for (var p of extraPeople)
                if (p.fullName.length < 1) {
                    alert(lang === 'heb' ? 'יש למלא את כל פרטי הנוסעים' : 'Please fill in all passengers information')
                    return
                }
            if (!isValidPhoneNumber(p.phoneNumber)) {
                alert(lang === 'heb' ? 'יש להכניס מספרי טלפון תקינים עבור כל הנוסעים' : 'Please fill in all passengers valid phone numbers')
                return
            }
        }

        if (!$('#termsOfUser_payment').is(':checked')) {
            alert(lang === 'heb' ? 'אנא אשר את התקנון על מנת להמשיך' : 'In order to continue, you should first agree to our terms of service')
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
            extraPeople: extraPeople,
            amount: ticketAmount,
            eventId: product.eventId,
            rideId: product.rideId,
            startPoint: product.startPoint,
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
            })

    }


    const RideStartDest = () => {
        return (
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
                            <label style={{ color: PRIMARY_WHITE, fontSize: '14px' }}>{SAME_SPOT(lang)}</label> </div> </div> : ''}
                </Stack>


                <Stack >
                    {(product.twoWay || product.direction === '2') && <div><label style={{ fontWeight: 'bold' }}>
                        {(lang === 'heb' ? 'שעת יציאה' : 'Ride time: ')}
                    </label>
                        <div><label style={{ color: PRIMARY_WHITE, fontSize: '14px' }}>{product.rideTime}</label> </div></div>}
                    {(product.twoWay || product.direction === '1') && <div><label style={{ fontWeight: 'bold' }}>
                        {(lang === 'heb' ? 'שעת חזרה' : 'Back time: ')}
                    </label>
                        <div><label style={{ color: PRIMARY_WHITE, fontSize: '14px' }}>{product.backTime}</label> </div></div>}
                </Stack>
            </Stack>
        )
    }

    const AddRemoveButton = () => {
        return (
            <span style={{ padding: '8px', display: 'flex', flexDirection: 'column', rowGap: '8px', alignItems: 'center', justifyContent: 'center', columnGap: '8px' }}>
                <div style={{ background: 'none', display: 'flex', alignItems: 'center', columnGap: '4px' }}>
                    <AddIcon sx={{ cursor: 'pointer', background: DARK_BLACK, color: 'white' }} onClick={() => {
                        const newAmountAdded = ticketAmount + 1 <= 10 ? ticketAmount + 1 : 10
                        setTicketAmount(newAmountAdded)
                        const new_p = { id: newAmountAdded, fullName: '', phoneNumber: '' }
                        extraPeople.push(new_p)
                        setExtraPeople(extraPeople)
                    }} /><RemoveIcon sx={{ cursor: 'pointer', background: DARK_BLACK, color: 'white' }} onClick={() => {
                        const newAmountRemoved = ticketAmount - 1 >= 1 ? ticketAmount - 1 : 1
                        setTicketAmount(newAmountRemoved)
                        extraPeople.splice(newAmountRemoved - 1, 1)
                        setExtraPeople(extraPeople)
                    }
                    } /></div>
                <span style={{ color: SECONDARY_WHITE }}>{`${AMOUNT_OF_TICKETS(lang)} ${ticketAmount}`}</span>
            </span>

        )
    }

    const PaymentMethodsImages = () => {
        return (<Stack direction={'row'} spacing={2}>
            <img style={{ marginLeft: '4px', width: '50px', height: '24px', alignSelf: 'center', background: SECONDARY_WHITE, marginBottom: '0px' }} src={credit_cards} />

            <img style={{ marginRight: '4px', borderRadius: '8px', width: '32px', height: '32px', alignSelf: 'center', background: SECONDARY_WHITE, marginBottom: '0px' }} src={bit} />
        </Stack>)
    }

    const RideInfo = () => {
        return (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: SECONDARY_WHITE, justifyContent: 'center' }}>


            <span style={{ marginTop: '0px', padding: '0px', fontWeight: 'bold' }}>{PAYMENT_FOR_RIDE(lang)}</span>
            <div style={{ padding: '8px' }}>
                <HTMLFromText style={{ color: PRIMARY_WHITE, fontSize: '14px' }} text={RIDE_INFO(lang)} />
                <hr style={{ borderWidth: '.1px', borderColor: 'gray' }} />

                <RideStartDest />
                <hr style={{ borderWidth: '.1px', borderColor: 'gray' }} />
            </div>
            <PaymentMethodsImages />
        </div>)
    }
    const TotalToPay = () => {
        return (<label style={{ fontSize: '24px', padding: '4px', fontWeight: '100', color: SECONDARY_WHITE }}>{TOTAL_TO_PAY(lang, Number(product.price) * ticketAmount)}</label>
        )
    }

    const SubmitButtonPayment = () => {
        return (<HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={product.soldOut ? (lang === 'heb' ? 'כרטיסים אזלו' : 'Sold out') : CONTINUE_TO_SECURE_PAYMENT(lang)} arrow>
            <span>
                <Button onClick={requestPayment}

                    sx={{ ...submitButton(false), ... { margin: '0px', background: product.soldOut ? SECONDARY_BLACK : DARKER_BLACK_SELECTED, padding: '8px', fontSize: '16px', marginTop: '16px', width: lang === 'heb' ? '75%' : '90%' } }}
                    disabled={product.soldOut} >{product.soldOut ? (lang === 'heb' ? 'כרטיסים אזלו' : 'SOLD OUT') : CONTINUE_TO_SECURE_PAYMENT(lang)}</Button>
            </span>
        </HtmlTooltip>
        )
    }

    const textStyle = {
        root: {
            "& .MuiOutlinedInput-root": {
                background: 'none',
                borderRadius: '32px',

                maxHeight: '35px',
                padding: '0px',
                border: '.8px solid white',
                color: PRIMARY_BLACK, ...{
                    '& input[type=number]': {
                        '-moz-appearance': 'textfield'
                    },
                    '& input[type=number]::-webkit-outer-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0
                    },
                    '& input[type=time]::-webkit-calendar-picker-indicator': {
                        filter: 'invert(200%) sepia(85%) saturate(10%) hue-rotate(356deg) brightness(107%) contrast(117%)'
                    },
                    '& input[type=date]::-webkit-calendar-picker-indicator': {
                        filter: 'invert(200%) sepia(85%) saturate(10%) hue-rotate(356deg) brightness(107%) contrast(117%)'
                    },
                    '& input[type=number]::-webkit-inner-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0
                    }
                }
            }
        }, noBorder: {
            border: "1px solid red",
            outline: 'none'
        }
    }
    const useStyles = makeStyles(() => textStyle)


    const classes = useStyles()
    const PeopleCard = ({ pNum, onChangePNum, onChangeFName }) => {


        const cardStyle = {
            transition: 'all .1s',
            width: '100%',
            border: '1px solid black',
            borderRadius: '8px',
            background: SECONDARY_WHITE,
            marginTop: pNum === 0 ? '4px' : '16px',
            paddingTop: '16px',
            paddingBottom: '16px',
            textAlignment: 'center'
        }


        return (<Stack id={`pCard_num_${pNum}`} style={cardStyle}>

            <Stack justifyContent='center' alignItems={'center'} spacing={1}>
                <label style={{ fontWeight: 'bold' }}>{lang === 'heb' ? 'נוסע ' + (pNum + 2) : 'Passenger ' + (pNum + 2)}</label>
                {(function fields() {
                    const corresponding_person = extraPeople[pNum]
                    return (<React.Fragment><TextField
                        onChange={(e) => { onChangeFName(e.target.value) }} classes={{ root: classes.root }} placeholder={corresponding_person && corresponding_person.fullName ? corresponding_person.fullName : FULL_NAME(lang)} />
                        <TextField
                            onChange={(e) => { onChangePNum(e.target.value) }} classes={{ root: classes.root }} name='phone' type='number' placeholder={corresponding_person && corresponding_person.phoneNumber ? corresponding_person.phoneNumber : PHONE_NUMBER(lang)} />
                    </React.Fragment>
                    )
                })()}
            </Stack>

        </Stack>)
    }
    const AdditionalPeople = React.memo(() => {
        const populate = () => {
            const A = []
            for (var i = 2; i <= ticketAmount; i++) {
                A.push(<PeopleCard
                    onChangeFName={(fullName) => {
                        extraPeople[i - 3 < 0 ? 0 : i - 3].fullName = fullName
                        setExtraPeople(extraPeople)
                    }}
                    onChangePNum={(phoneNumber) => {
                        extraPeople[i - 3 < 0 ? 0 : i - 3].phoneNumber = phoneNumber
                        setExtraPeople(extraPeople)
                    }}
                    key={`pCard_num_${i - 2}`}
                    pNum={i - 2} />)
            }
            return A.length > 0 ? A : null
        }

        return <div style={{ padding: '4px' }}>
            {extraPeople.length > 0 && <hr style={{ borderWidth: '.1px' }} />}
            {extraPeople.length > 0 && <label style={{ color: SECONDARY_WHITE, marginBottom: '0px' }}>{lang === 'heb' ? 'מלא את פרטיי הנוסעים הנוספים' : 'Fill in all extra passengers information'}</label>}
            {populate()}
        </div>
    })


    const getElement = () => {
        return paymentLink ? <iframe style={{ minHeight: '500px', minWidth: '300px', maxWidth: '95%', maxHeight: '90%' }} src={paymentLink} /> : (
            <div>
                <RideInfo />
                <AddRemoveButton />
                <TotalToPay />
                <AdditionalPeople />
                <SubmitButtonPayment />
                <Stack  >
                    <label style={{ paddingTop: '16px', fontSize: '14px', color: SECONDARY_WHITE }}>{TERMS_OF_USE(lang)}</label>
                    <input
                        type="checkbox"
                        id='termsOfUser_payment'
                        style={{
                            cursor: 'pointer',
                            width: '18px',
                            height: '18px',
                            alignSelf: 'center',
                            background: ORANGE_GRADIENT_PRIMARY,
                            color: SECONDARY_WHITE, margin: '8px'
                        }}
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