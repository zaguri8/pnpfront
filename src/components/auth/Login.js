import { Input, FormControl, InputLabel, TextField } from "@mui/material"
import { EMAIL, FORGOT_PASSWORD, LOGIN_OK, MY_ACCOUNT, NO_ACCOUNT, OR, PASSWORD, SIDE, TOOLBAR_LOGIN } from '../../settings/strings'
import { makeStyles } from "@mui/styles"
import SectionTitle from "../SectionTitle"
import Button from "../Button"
import { Stack } from "@mui/material"
import { useFirebase } from "../../context/Firebase"
import { useNavigate } from "react-router"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Link } from "react-router-dom"
import { useLanguage } from "../../context/Language"
import { useLocation } from "react-router"
import { BLACK_ROYAL, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_WHITE, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors"
import { submitButton } from "../../settings/styles"
import { useLoading } from "../../context/Loading"
import { useState } from "react"
export default function Login() {

    const nav = useNavigate()
    const location = useLocation()
    const { firebase } = useFirebase()
    const useStyles = makeStyles(theme => ({
        labelRoot: {
            right: '-64px'

        },
        root: {
            "& .MuiOutlinedInput-root": {
                background: SECONDARY_WHITE,
                borderRadius: '32px',
                padding: '0px',
                minWidth:'275px',
                alignSelf:'center',
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
    const { doLoad, cancelLoad } = useLoading()

    const [user, setUser] = useState({ u: '', p: '' })
    function login(e) {
        e.preventDefault()
        doLoad()
        signInWithEmailAndPassword(firebase.auth, user.u, user.p)
            .then(() => {

                if (location.state && location.state.cachedLocation)
                    nav(location.state.cachedLocation)
                else
                    nav('/')
            })
            .catch(err => {
                alert('הפרטים שהכנסת אינם נכונים')
                cancelLoad()
            })

    }
    const classes = useStyles()
    const { lang } = useLanguage()

    return (<div style={{
        width: '100%',
        marginBottom: '120px',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    }}>
        <SectionTitle title={MY_ACCOUNT(lang)} style={{}} />
        <div style={{
            background: BLACK_ROYAL,
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
            <form onSubmit={login} style={{
                display: 'flex',
                justifyContent: 'center',
                width: '80%',
                minWidth: '300px',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <SectionTitle title={TOOLBAR_LOGIN(lang)} style={{
                    background: 'none',
                    marginTop: '0px',
                    marginBottom: '32px'
                }} />
                <Stack spacing={3} style={{ width: '80%' }}>

                    <FormControl >
                        <label style={{ color: SECONDARY_WHITE, padding: '4px' }} htmlFor="email_input">{EMAIL(lang)}</label>
                        <TextField
                            classes={{ root: classes.root }}
                            name="email"
                            onChange={(e) => { setUser({ ...user, ...{ u: e.target.value } }) }}
                            style={{ color: SECONDARY_WHITE }}
                            autoComplete="username"
                            type="email" sx={{ direction: SIDE(lang) }} id="email_input" aria-describedby="email_helper_text" />

                    </FormControl>
                    <FormControl >
                        <label style={{ color: SECONDARY_WHITE, padding: '4px' }} htmlFor="password_input">{PASSWORD(lang)}</label>
                        <TextField
                            classes={{ root: classes.root }}
                            autoComplete="current-password"
                            onChange={(e) => { setUser({ ...user, ...{ p: e.target.value } }) }}
                            type='password'
                            name='password'
                            style={{ color: SECONDARY_WHITE }}
                            dir={SIDE(lang)} id="password_input" aria-describedby="password_helper_text" />

                    </FormControl>
                    <br />
                    <Button title={LOGIN_OK(lang)} style={{ ...submitButton(false), ...{ padding: '8px', width: '100%' } }} variant="outlined" type='submit' />



                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: '8px',
                        marginRight: '8px'
                    }}>

                        <hr style={{ width: '42%', height: '.1px' }} />
                        <p style={{ width: '20%', color: PRIMARY_WHITE }}>{OR(lang)}</p>
                        <hr style={{ width: '42%', height: '.1px' }} />
                    </div>

                </Stack>

            </form>

            {/* <Auth style={{ margin: '0px' }} title='' redirect= {(location.state && location.state.cachedLocation) ? location.state.cachedLocation : "/pnp"} /> */}

            <div>
                <Link style={{ textDecoration: 'underline', color: SECONDARY_WHITE }} to={(location.state && location.state.cachedLocation) ? { pathname: '/register', state: { cachedLocation: location.state.cachedLocation } } : '/register'} >{NO_ACCOUNT(lang)}</Link>
            </div>

            <div>
                <Link style={{ fontSize: '12px', textDecoration: 'underline', color: SECONDARY_WHITE }} to={'/forgotPass'}>{FORGOT_PASSWORD(lang)}</Link>
            </div>
        </div>
    </div >)
}