import { Input, FormControl, InputLabel, Stack } from "@mui/material"
import { ALREADY_REGISTERED, BIRTH_DATE, EMAIL, SIDE, FIRST_NAME, LAST_NAME, MY_ACCOUNT, PASSWORD, PHONE_NUMBER, PICKED, REGISTER_OK, REGISTER_TITLE } from '../../settings/strings'
import { useState } from "react"
import { Link } from "react-router-dom"
import { makeStyles } from "@mui/styles"
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
import FavoriteEventsDialog from "../utilities/PNPDialog"
import { useLanguage } from "../../context/Language"


export default function Register() {


    const nav = useNavigate()
    const { firebase } = useFirebase()
    const location = useLocation()
    const { doLoad, cancelLoad } = useLoading()
    const useStyles = makeStyles(theme => ({
        labelRoot: {
            right: '-64px'

        },
        shrink: {
            transformOrigin: "top right"
        }
    }));
    const { lang } = useLanguage()
    function register(e) {

        function validate(phone, firstname, lastname, selectedFavoriteEvents) {
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
                errors.push(`Invalid phone number ${phone}`)
            }
            if ((selectedFavoriteEvents.length < 1
                || selectedFavoriteEvents.length === 1) && selectedFavoriteEvents[0].length === 0) {
                errors.push('Invalid favorite events, please pick atleast 1')
            }
            if (firstname.length < 2) {
                errors.push(`Invalid firstname ${firstname}`)
            }
            if (lastname.length < 2) {
                errors.push(`Invalid last name ${lastname}`)
            }
            return errors
        }
        e.preventDefault()
        const firstName = e.target[0].value
        const lastName = e.target[1].value
        const phone = e.target[2].value
        const email = e.target[3].value
        const password = e.target[4].value
        const birthDate = e.target[5].value
        const selectedFavoriteEvents = $('#selected_favorite_events').text().replace(`${PICKED(lang)}`, "").replaceAll(' 🎉 ', ',').split(',')
        const validationErrors = validate(phone, firstName, lastName, selectedFavoriteEvents)
        if (validationErrors.length > 0) {
            alert(validationErrors.join('\n'))
            return
        }
        doLoad()
        createUserWithEmailAndPassword(firebase.auth, email, password)
            .then(() => {
                firebase.realTime.addUser({
                    name: firstName + " " + lastName,
                    email: email,
                    customerId: '',
                    phone: phone,
                    birthDate: birthDate,
                    favoriteEvents: selectedFavoriteEvents,
                    coins: 0,
                    producer: false
                }).then(result => {
                    cancelLoad()
                        (location.state && location.state.cachedLocation) ? nav(location.state.cachedLocation) : nav('/')
                }).catch(err => {
                    alert('הייתה בעיה בהתחברות אנא נסה שוב בעוד מספר רגעים')
                    firebase.realTime.createError('Register error', err)
                    cancelLoad()
                }
                )
            }).catch(err => {
                alert('האימייל או סיסמא שהזנת אינם תקינים')
            })

    }


    const [date, setDate] = useState()
    const classes = useStyles()
    return (<PageHolder>
        <SectionTitle title={MY_ACCOUNT(lang)} style={{}} />
        <InnerPageHolder>
            <form onSubmit={register} style={{
                display: 'flex',
                justifyContent: 'center',
                width: '80%',
                minWidth: '300px',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <SectionTitle title={REGISTER_TITLE(lang)} style={{
                    background: 'whitesmoke',
                    marginTop: '0px',
                    marginBottom: '32px'
                }} />
                <Stack spacing={3} style={{ width: '80%' }}>
                    <FormControl>
                        <InputLabel required classes={{
                            root: classes.labelRoot,
                            shrink: classes.shrink
                        }} htmlFor="first_name_input">{FIRST_NAME(lang)}</InputLabel>
                        <Input sx={{ direction: SIDE(lang) }} id="first_name_input" aria-describedby="first_name_helper_text" />

                    </FormControl>
                    <FormControl>
                        <InputLabel required classes={{
                            root: classes.labelRoot,
                            shrink: classes.shrink
                        }} htmlFor="last_name_input">{LAST_NAME(lang)}</InputLabel>
                        <Input sx={{ direction: SIDE(lang) }} id="last_name_input" aria-describedby="last_name_helper_text" />

                    </FormControl>
                    <FormControl>
                        <InputLabel required classes={{
                            root: classes.labelRoot,
                            shrink: classes.shrink
                        }} htmlFor="phone_number_input">{PHONE_NUMBER(lang)}</InputLabel>
                        <Input sx={{ direction: SIDE(lang) }} id="phone_number_input" aria-describedby="phone_number_helper_text" />

                    </FormControl>
                    <FormControl>
                        <InputLabel required classes={{
                            root: classes.labelRoot,
                            shrink: classes.shrink
                        }} htmlFor="email_input">{EMAIL(lang)}</InputLabel>
                        <Input sx={{ direction: SIDE(lang) }} type='email' id="email_input" aria-describedby="email_helper_text" />

                    </FormControl>

                    <FormControl>
                        <InputLabel variant="outlined" required classes={{
                            root: classes.labelRoot,
                            shrink: classes.shrink
                        }} htmlFor="password_input">{PASSWORD(lang)}</InputLabel>
                        <Input sx={{ direction: SIDE(lang) }} type='password' id="password_input" aria-describedby="password_helper_text" />
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label={<p >{BIRTH_DATE(lang)}</p>}
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <FavoriteEventsDialog />

                    <Button title={REGISTER_OK(lang)} onClick={() => { }} type='submit' />

                    <div>
                        <Link to={'/login'}>{ALREADY_REGISTERED(lang)}</Link>
                    </div>


                </Stack>
            </form>
        </InnerPageHolder>
    </PageHolder >)
}