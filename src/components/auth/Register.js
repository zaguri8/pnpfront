import { Input, FormControl, InputLabel, Stack } from "@mui/material"
import { ALREADY_REGISTERED, BIRTH_DATE, EMAIL, FIRST_NAME, LAST_NAME, MY_ACCOUNT, PASSWORD, PHONE_NUMBER, PICKED, REGISTER_OK, REGISTER_TITLE } from '../../settings/strings'
import { useState } from "react"
import { Link } from "react-router-dom"
import { makeStyles } from "@mui/styles"
import SectionTitle from "../SectionTitle"
import Button from "../Button"
import $ from 'jquery'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useAuthState } from "../../context/Firebase"
import { useNavigate } from "react-router"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField } from "@mui/material"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { DatePicker } from "@mui/lab"
import { LoadingIndicator } from "../invitation/InvitationCard"
import { useLoading } from "../../context/Loading"
import FavoriteEventsDialog from "../utilities/PNPDialog"
export default function Register() {


    const nav = useNavigate()
    const { firebase } = useAuthState()
    const { doLoad, cancelLoad, isLoading } = useLoading()
    const useStyles = makeStyles(theme => ({
        labelRoot: {
            right: '-64px'

        },
        shrink: {
            transformOrigin: "top right"
        }
    }));
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
            if (selectedFavoriteEvents.length < 1
                || selectedFavoriteEvents.length === 1 && selectedFavoriteEvents[0].length === 0) {
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
        const selectedFavoriteEvents = $('#selected_favorite_events').text().replace(`${PICKED('heb')}`, "").replaceAll(' 🎉 ', ',').split(',')
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
                    phone: phone,
                    birthDate: birthDate,
                    favoriteEvents: selectedFavoriteEvents,
                    producer: false
                }).then(result => {
                    cancelLoad()
                    nav('/pnp')
                }).catch(err => {
                    alert('הייתה בעיה בהתחברות אנא נסה שוב בעוד מספר רגעים')
                    firebase.store.addError(err)
                    cancelLoad(false)
                }
                )
            }).catch(err => {
                console.log(err)
                alert('האימייל או סיסמא שהזנת אינם תקינים')
            })

    }
    const [date, setDate] = useState()
    const classes = useStyles()
    return (<div style={{
        width: '100%',
        marginBottom: '120px',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    }}>

        <SectionTitle title={MY_ACCOUNT('heb')} style={{}} />
        <div style={{
            background: 'whitesmoke',
            width: '50%',
            maxWidth: '500px',
            marginTop: '32px',
            minWidth: '200px',
            borderRadius: '12px',
            padding: '32px',
            paddingLeft: '64px',
            paddingRight: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            border: '.5px solid white',
        }}>
            <LoadingIndicator loading={isLoading} />
            <form onSubmit={register} style={{
                display: 'flex',
                justifyContent: 'center',
                width: '80%',
                minWidth: '300px',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <SectionTitle title={REGISTER_TITLE('heb')} style={{
                    background: 'whitesmoke',
                    marginTop: '0px',
                    marginBottom: '32px'
                }} />
                <Stack spacing={3} style={{ width: '80%' }}>
                    <FormControl>
                        <InputLabel required classes={{
                            root: classes.labelRoot,
                            shrink: classes.shrink
                        }} htmlFor="first_name_input">{FIRST_NAME('heb')}</InputLabel>
                        <Input sx={{ direction: 'rtl' }} id="first_name_input" aria-describedby="first_name_helper_text" />

                    </FormControl>
                    <FormControl>
                        <InputLabel required classes={{
                            root: classes.labelRoot,
                            shrink: classes.shrink
                        }} htmlFor="last_name_input">{LAST_NAME('heb')}</InputLabel>
                        <Input sx={{ direction: 'rtl' }} id="last_name_input" aria-describedby="last_name_helper_text" />

                    </FormControl>
                    <FormControl>
                        <InputLabel required classes={{
                            root: classes.labelRoot,
                            shrink: classes.shrink
                        }} htmlFor="phone_number_input">{PHONE_NUMBER('heb')}</InputLabel>
                        <Input sx={{ direction: 'rtl' }} id="phone_number_input" aria-describedby="phone_number_helper_text" />

                    </FormControl>
                    <FormControl>
                        <InputLabel required classes={{
                            root: classes.labelRoot,
                            shrink: classes.shrink
                        }} htmlFor="email_input">{EMAIL('heb')}</InputLabel>
                        <Input sx={{ direction: 'rtl' }} type='email' id="email_input" aria-describedby="email_helper_text" />

                    </FormControl>

                    <FormControl>
                        <InputLabel variant="outlined" required classes={{
                            root: classes.labelRoot,
                            shrink: classes.shrink
                        }} htmlFor="password_input">{PASSWORD('heb')}</InputLabel>
                        <Input sx={{ direction: 'rtl' }} type='password' id="password_input" aria-describedby="password_helper_text" />
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label={<p >{BIRTH_DATE('heb')}</p>}
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <FavoriteEventsDialog />

                    <Button title={REGISTER_OK('heb')} onClick={() => { }} type='submit' />

                    <div>
                        <Link to={'/login'}>{ALREADY_REGISTERED('heb')}</Link>
                    </div>


                </Stack>
            </form>

        </div>
    </div >)
}