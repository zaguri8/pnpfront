import { Input, FormControl, InputLabel, Stack, Checkbox } from "@mui/material"
import { ALREADY_REGISTERED, BIRTH_DATE, EMAIL, SIDE, FIRST_NAME, LAST_NAME, MY_ACCOUNT, PASSWORD, PHONE_NUMBER, PICKED, REGISTER_OK, REGISTER_TITLE, TERMS_OF_USE, FULL_NAME } from '../../settings/strings'
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { makeStyles } from "@mui/styles"
import './Register.css'
import { PRIMARY_BLACK, SECONDARY_WHITE } from '../../settings/colors'
import SectionTitle from "../other/SectionTitle"
import Button from "../other/Button"
import { InnerPageHolder, PageHolder } from "../utilityComponents/Holders"
import $ from 'jquery'
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { useUser } from "../../context/Firebase"
import { useNavigate } from "react-router"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField } from "@mui/material"
import { DatePicker } from "@mui/lab"
import { useLoading } from "../../context/Loading"
import { useLocation } from "react-router"
import FavoriteEventsDialog, { events } from "../utilityComponents/PNPDialog"
import { useLanguage } from "../../context/Language"
import { submitButton } from "../../settings/styles"
import { dateStringFromDate, reverseDate, unReverseDate } from "../utilityComponents/functions"
import { Welcome } from "./Welcome"
import { useCookies } from "../../context/CookieContext"
import { PNPPage } from "../../cookies/types"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useHeaderBackgroundExtension } from "../../context/HeaderContext"
import { StoreSingleton } from "../../store/external"

let finishRegister = false


export function RegistrationForm({
    registrationSuccessAction,
    externalRegistration = false,
    registerButtonText,
    style = {} }) {
    const { firebase } = useUser()
    const { doLoad, cancelLoad } = useLoading()
    const [registerSettings, setRegisterSettings] = useState()

    useEffect(() => {
        doLoad()
        const unsub = StoreSingleton.getTools().realTime.addListenerToRegistrationPage((settings) => {
            cancelLoad()
            setRegisterSettings(settings)
        }, (e) => {

            console.log(e)
            cancelLoad()
        })
        return () => unsub()
    }, [])

    const useStyles = makeStyles(theme => ({
        labelRoot: {
            right: '-64px'
        },
        root: {
            "& .MuiOutlinedInput-root": {
                background: SECONDARY_WHITE,
                borderRadius: '16px',
                alignSelf: 'center',
                fontSize: '11px',
                width: '100%',
                maxWidth: '245px',
                border: '.1px solid white',
                color: PRIMARY_BLACK, ...{
                    '& input[type=number]': {
                        '-moz-appearance': 'textfield'
                    },
                    '::placeholder': {
                        'textAlign': 'center'
                    },
                    '& input[type=number]::-webkit-outer-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0
                    },
                    '& input[type=number]::-webkit-inner-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0
                    }
                }
            }
        },
        shrink: {
            transformOrigin: "top right"
        }
    }));

    const { lang } = useLanguage()

    const [user, setUser] = useState({
        phone: '',
        fullName: '',
        email: '',
        password: '',
        birthDate: dateStringFromDate(new Date()),
        selectedFavoriteEvents: events('heb')
    })

    function updateUserPhone(phone) {
        setUser({ ...user, ...{ phone: phone } })
    }
    function updateFullName(name) {
        setUser({ ...user, ...{ fullName: name } })
    }

    function updateEmail(email) {
        setUser({ ...user, ...{ email: email } })
    }
    function updatePassword(pass) {
        setUser({ ...user, ...{ password: pass } })
    }
    function updateBirthDate(bd) {
        const s = reverseDate(bd)
        setUser({ ...user, ...{ birthDate: s } })
    }
    function updateSelectedFavoriteEvents(favs) {
        setUser({ ...user, ...{ selectedFavoriteEvents: favs } })
    }

    function register(e) {
        function validate(phone, fullName) {
            let errors = []
            if (!((phone.includes('050')
                || phone.includes('051')
                || phone.includes('052')
                || phone.includes('053')
                || phone.includes('054')
                || phone.includes('055')
                || phone.includes('056')
                || phone.includes('057')
                || phone.includes('058')
                || phone.includes('059')))
                || phone.length !== 10) {
                errors.push(lang === 'heb' ? 'יש להזין מס טלפון תקין' : `Invalid phone number ${phone}`)
            }
            if (registerSettings && registerSettings.requireBirthDate
                && user.birthDate) {
                let today = dateStringFromDate(new Date())
                if (user.birthDate === today) {
                    errors.push("יש להזין תאריך לידה תקין")
                }
            }
            if (fullName.length < 2) {
                errors.push(lang === 'heb' ? 'יש להזין שם מלא תקין' : `Invalid fullname ${fullName}`)
            }
            if (!termsOfUse) {
                errors.push('יש לאשר את תנאי השימוש')
            }
            return errors
        }
        // const selectedEvents = $('#selected_favorite_events').text().replace(`${PICKED(lang)}`, "").replaceAll(' 🎉 ', ',').split(',')
        const validationErrors = validate(user.phone, user.fullName)
        if (validationErrors.length > 0) {
            alert(validationErrors.join('\n'))
            return
        }

        doLoad()

        createUserWithEmailAndPassword(firebase.auth, user.email, user.password)
            .then(() => {
                finishRegister = true;
                StoreSingleton.getTools().realTime.addUser({
                    name: user.fullName,
                    email: user.email,
                    customerId: '',
                    admin: false,
                    phone: user.phone,
                    birthDate: user.birthDate,
                    favoriteEvents: events('heb'),
                    coins: 0,
                    producer: false
                }).then(result => {
                    cancelLoad()
                    setTimeout(() => {
                        registrationSuccessAction(firebase.auth.currentUser)
                    }, 1500)
                }).catch(err => {
                    alert('הייתה בעיה בהתחברות אנא נסה שוב בעוד מספר רגעים')
                    StoreSingleton.getTools().realTime.createError('Register error', err)
                    cancelLoad()
                })
            }).catch(err => {
                if (err.message.includes('auth/email-already-in-use')) {
                    alert('האימייל שהזנת קיים כבר במערכת')
                } else {
                    alert('האימייל או סיסמא שהזנת אינם תקינים')
                }
                cancelLoad()
            })
    }

    const classes = useStyles()

    const [termsOfUse, setTermsOfUse] = useState()
    const handleTermsOfUseChange = (e) => {
        setTermsOfUse(e.target.checked)
    }

    return <div style={{
        ...{
            display: 'flex',
            justifyContent: 'center',
            width: '80%',
            minWidth: '300px',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: 'center'
        }, ...style
    }}>

        <Stack spacing={3} alignSelf={'center'}>
            <Stack direction={'row'} spacing={4}>
                <FormControl>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE, fontSize: '14px' }}>{PHONE_NUMBER(lang)}</label>
                    <TextField
                        type="tel"
                        placeholder={PHONE_NUMBER(lang)}
                        onChange={(e) => { updateUserPhone(e.target.value) }}
                        name="phone"
                        classes={{ root: classes.root }}
                        autoComplete="phone"
                        sx={{ direction: SIDE(lang), color: SECONDARY_WHITE }} id="phone_number_input" aria-describedby="phone_number_helper_text" />

                </FormControl>
                <FormControl>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE, fontSize: '14px' }}>{FULL_NAME(lang)}</label>
                    <TextField sx={{ direction: SIDE(lang), color: SECONDARY_WHITE }}
                        classes={{ root: classes.root }}
                        placeholder={FULL_NAME(lang)}
                        onChange={(e) => { updateFullName(e.target.value) }}
                        id="first_name_input" aria-describedby="first_name_helper_text" />

                </FormControl>

            </Stack>
            <Stack direction={'row'} spacing={4}>


                <FormControl>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE, fontSize: '14px' }}>{PASSWORD(lang)}</label>
                    <TextField
                        autoComplete="new-password"
                        type="password"
                        placeholder={PASSWORD(lang)}
                        onChange={(e) => { updatePassword(e.target.value) }}
                        classes={{ root: classes.root }}
                        name="new-password"
                        sx={{ direction: SIDE(lang), color: SECONDARY_WHITE }} id="password_input" aria-describedby="password_helper_text" />
                </FormControl>
                <FormControl>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE, fontSize: '14px' }}>{EMAIL(lang)}</label>
                    <TextField
                        autoComplete="username"
                        type='email'
                        onChange={(e) => { updateEmail(e.target.value) }}
                        placeholder={EMAIL(lang)}
                        name="email"
                        classes={{ root: classes.root }}
                        sx={{ direction: SIDE(lang), color: SECONDARY_WHITE }} id="email_input" aria-describedby="email_helper_text" />

                </FormControl>
            </Stack>
            {registerSettings && registerSettings.requireBirthDate && <FormControl>
                <label style={{ padding: '4px', color: SECONDARY_WHITE, fontSize: '14px' }}>{BIRTH_DATE(lang)}</label>
                <TextField
                    type="date"
                    placeholder={BIRTH_DATE(lang)}
                    value={unReverseDate(user.birthDate)}
                    onChange={(e) => { updateBirthDate(e.target.value) }}
                    name="date"
                    classes={{ root: classes.root }}
                    autoComplete="birthdate"
                    sx={{ direction: SIDE(lang), color: SECONDARY_WHITE }} id="birth_date_input" aria-describedby="birth_date_helper_text" />

            </FormControl>}

            <Button title={registerButtonText}
                type={'button'}
                style={{ ...submitButton(false), ...{ padding: '8px', width: '100%', marginTop: '24px' } }}
                variant="outlined"
                onClick={register} />

            {!externalRegistration && <div>
                <Link style={{ textDecoration: 'underline', color: SECONDARY_WHITE }} to={'/login'}>{ALREADY_REGISTERED(lang)}</Link>
            </div>}
            <Stack >


                <label style={{ fontSize: '12px', color: SECONDARY_WHITE }}>{TERMS_OF_USE(lang)}</label>
                <Checkbox
                    style={{ width: 'fit-content', alignSelf: 'center', background: PRIMARY_BLACK, color: SECONDARY_WHITE, margin: '8px' }}
                    onChange={handleTermsOfUseChange}
                    name={TERMS_OF_USE(lang)} value={TERMS_OF_USE(lang)} />
            </Stack>

        </Stack>
    </div >
}
export default function Register() {
    const nav = useNavigate()
    const { lang } = useLanguage()
    const location = useLocation()
    const { isCacheValid, cacheDone } = useCookies()
    const { openDialog } = useLoading()
    const { hideHeader, showHeader } = useHeaderBackgroundExtension()
    useEffect(() => {
        hideHeader()
        return () => showHeader()
    }, [])
    useEffect(() => {
        return () => {
            if (!finishRegister)
                isCacheValid(PNPPage.register)
                    .then(valid => {
                        if (valid) {
                            StoreSingleton.getTools().realTime.addBrowsingStat(PNPPage.register, 'leaveNoAttendance')
                            cacheDone(PNPPage.register)
                        }
                    })
        }
    }, [])
    return (<PageHolder>
        <InnerPageHolder style={{ background: 'none', border: 'none' }}>
            <SectionTitle title={REGISTER_TITLE(lang)} style={{
                background: 'none',
                marginTop: '0px',
                marginBottom: '32px'
            }} />
            <RegistrationForm
                externalRegistration={false}
                registerButtonText={REGISTER_OK(lang)}
                registrationSuccessAction={(user) => {
                    isCacheValid(PNPPage.register)
                        .then(valid => {
                            if (valid) {
                                StoreSingleton.getTools().realTime.addBrowsingStat(PNPPage.register, 'leaveWithAttendance')
                                cacheDone(PNPPage.register)
                            }
                        })
                    if (location.state && location.state.cachedLocation) {
                        nav(location.state.cachedLocation)
                    } else {
                        nav('/')
                    }
                    openDialog({ content: <Welcome /> })
                }} />
        </InnerPageHolder>
    </PageHolder >)
}