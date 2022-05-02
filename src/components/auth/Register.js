import { Input, FormControl, InputLabel, Stack, Checkbox } from "@mui/material"
import { ALREADY_REGISTERED, BIRTH_DATE, EMAIL, SIDE, FIRST_NAME, LAST_NAME, MY_ACCOUNT, PASSWORD, PHONE_NUMBER, PICKED, REGISTER_OK, REGISTER_TITLE, TERMS_OF_USE, FULL_NAME } from '../../settings/strings'
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { makeStyles } from "@mui/styles"
import { BLACK_ROYAL, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, SECONDARY_BLACK, SECONDARY_WHITE } from '../../settings/colors'
import SectionTitle from "../SectionTitle"
import Button from "../Button"
import { InnerPageHolder, PageHolder } from "../utilities/Holders"
import $ from 'jquery'
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { useFirebase } from "../../context/Firebase"
import { useNavigate } from "react-router"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField } from "@mui/material"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { DatePicker } from "@mui/lab"
import { useLoading } from "../../context/Loading"
import { useLocation } from "react-router"
import FavoriteEventsDialog, { events } from "../utilities/PNPDialog"
import { useLanguage } from "../../context/Language"
import { submitButton } from "../../settings/styles"
import { dateStringFromDate, reverseDate, unReverseDate } from "../utilities/functions"
import { Welcome } from "./Welcome"
import { useCookies } from "../../context/CookieContext"
import { PNPPage } from "../../cookies/types"

let finishRegister = false
export default function Register() {


    const nav = useNavigate()
    const { firebase, appUser } = useFirebase()
    const location = useLocation()
    const { doLoad, cancelLoad } = useLoading()

    const { isCacheValid, cacheDone } = useCookies()

    const useStyles = makeStyles(theme => ({
        labelRoot: {
            right: '-64px'

        },
        root: {
            "& .MuiOutlinedInput-root": {
                background: SECONDARY_WHITE,
                borderRadius: '32px',
                minWidth: '275px',
                alignSelf: 'center',
                padding: '0px',
                border: '.1px solid white',
                color: PRIMARY_BLACK, ...{
                    '& input[type=number]': {
                        '-moz-appearance': 'textfield'
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



    const { openDialog } = useLoading()
    function register(e) {

        function validate(phone, fullName) {
            let errors = []



            if (!((phone.includes('050')
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
            // if ((selectedFavoriteEvents.length < 1
            //     || selectedFavoriteEvents.length === 1) && selectedFavoriteEvents[0].length === 0) {
            //     errors.push(lang === 'heb' ? 'יש לבחור לפחות סוג אחד של אירועים על מנת להירשם' : 'Invalid favorite events, please pick atleast 1')
            // }
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
                firebase.realTime.addUser({
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
                    isCacheValid(PNPPage.register)
                        .then(valid => {
                            if (valid) {
                                firebase.realTime.addBrowsingStat(PNPPage.register, 'leaveWithAttendance')
                                cacheDone(PNPPage.register)
                            }
                        })
                    if (location.state && location.state.cachedLocation) {
                        nav(location.state.cachedLocation)
                    } else {
                        nav('/')
                    }
                    openDialog({ content: <Welcome /> })
                }).catch(err => {
                    alert('הייתה בעיה בהתחברות אנא נסה שוב בעוד מספר רגעים')
                    firebase.realTime.createError('Register error', err)
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

    useEffect(() => {
        return () => {
            if (!finishRegister)
                isCacheValid(PNPPage.register)
                    .then(valid => {
                        if (valid) {
                            firebase.realTime.addBrowsingStat(PNPPage.register, 'leaveNoAttendance')
                            cacheDone(PNPPage.register)
                        }
                    })
        }
    }, [])

    return (<PageHolder>
        <SectionTitle title={MY_ACCOUNT(lang)} style={{}} />
        <InnerPageHolder style={{ background: BLACK_ROYAL }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: '80%',
                minWidth: '300px',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <SectionTitle title={REGISTER_TITLE(lang)} style={{
                    background: 'none',
                    marginTop: '0px',
                    marginBottom: '32px'
                }} />
                <Stack spacing={3} style={{ width: '80%' }}>
                    <FormControl>
                        <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{FULL_NAME(lang)}</label>
                        <TextField sx={{ direction: SIDE(lang), color: SECONDARY_WHITE }}
                            classes={{ root: classes.root }}
                            placeholder={FULL_NAME(lang)}
                            onChange={(e) => { updateFullName(e.target.value) }}
                            id="first_name_input" aria-describedby="first_name_helper_text" />

                    </FormControl>
                    <FormControl>
                        <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{PHONE_NUMBER(lang)}</label>
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
                        <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EMAIL(lang)}</label>
                        <TextField
                            autoComplete="username"
                            type='email'
                            onChange={(e) => { updateEmail(e.target.value) }}
                            placeholder={EMAIL(lang)}
                            name="email"
                            classes={{ root: classes.root }}
                            sx={{ direction: SIDE(lang), color: SECONDARY_WHITE }} id="email_input" aria-describedby="email_helper_text" />

                    </FormControl>

                    <FormControl>
                        <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{PASSWORD(lang)}</label>
                        <TextField
                            autoComplete="new-password"
                            type="password"
                            placeholder={PASSWORD(lang)}
                            onChange={(e) => { updatePassword(e.target.value) }}
                            classes={{ root: classes.root }}
                            name="new-password"
                            sx={{ direction: SIDE(lang), color: SECONDARY_WHITE }} id="password_input" aria-describedby="password_helper_text" />
                    </FormControl>
                    {/* 
                    <FormControl style={{ width: '80%', alignSelf: 'center' }}>
                        <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{BIRTH_DATE(lang)}</label>
                        <TextField

                            value={unReverseDate(user.birthDate)}
                            classes={{ root: classes.root }}
                            InputLabelProps={{
                                shrink: true,
                                style: { color: SECONDARY_WHITE }
                            }}

                            type='date'
                            onChange={(e) => { updateBirthDate(e.target.value) }}
                            required />
                    </FormControl> */}
                    {/* <label style={{ color: SECONDARY_WHITE }}>{lang === 'heb' ? 'עזור לנו להכיר אותך : בחר את סוגי האירועים האהובים עלייך' : 'Help us know you better: Choose your favorite event types'}</label>
                    <FavoriteEventsDialog />
 */}

                    <Button title={REGISTER_OK(lang)}
                        type={'button'}
                        style={{ ...submitButton(false), ...{ padding: '8px', width: '100%', marginTop: '24px' } }}
                        variant="outlined"
                        onClick={register} />

                    <div>
                        <Link style={{ textDecoration: 'underline', color: SECONDARY_WHITE }} to={'/login'}>{ALREADY_REGISTERED(lang)}</Link>
                    </div>
                    <Stack >


                        <label style={{ fontSize: '14px', color: SECONDARY_WHITE }}>{TERMS_OF_USE(lang)}</label>
                        <Checkbox
                            style={{ width: 'fit-content', alignSelf: 'center', background: PRIMARY_BLACK, color: SECONDARY_WHITE, margin: '8px' }}
                            onChange={handleTermsOfUseChange}
                            name={TERMS_OF_USE(lang)} value={TERMS_OF_USE(lang)} />
                    </Stack>

                </Stack>
            </div>
        </InnerPageHolder>
    </PageHolder >)
}