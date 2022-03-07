import { Input, FormControl, InputLabel } from "@mui/material"
import { EMAIL, FORGOT_PASSWORD, LOGIN_OK, MY_ACCOUNT, NO_ACCOUNT, OR, PASSWORD, SIDE, TOOLBAR_LOGIN } from '../../settings/strings'
import Auth from "./Auth"
import { makeStyles } from "@mui/styles"
import SectionTitle from "../SectionTitle"
import { InnerPageHolder, PageHolder } from "../utilities/Holders"
import Button from "../Button"
import { Stack } from "@mui/material"
import { useFirebase } from "../../context/Firebase"
import { useNavigate } from "react-router"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Link } from "react-router-dom"
import { useLanguage } from "../../context/Language"
import { useLocation } from "react-router"
export default function Login() {

    const nav = useNavigate()
    const location = useLocation()
    const { firebase } = useFirebase()
    const useStyles = makeStyles(theme => ({
        labelRoot: {
            right: '-64px'

        },
        shrink: {
            transformOrigin: "top right"
        }
    }));
    function login(e) {
        e.preventDefault()
        const u = e.target[0].value
        const p = e.target[1].value
        signInWithEmailAndPassword(firebase.auth, u, p)
            .then(() => (location.state && location.state.cachedLocation) ? nav(location.state.cachedLocation) : nav('/pnp'))
            .catch(err => alert('הפרטים שהכנסת אינם נכונים'))

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
            <form onSubmit={login} style={{
                display: 'flex',
                justifyContent: 'center',
                width: '80%',
                minWidth: '300px',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <SectionTitle title={TOOLBAR_LOGIN(lang)} style={{
                    background: 'whitesmoke',
                    marginTop: '0px',
                    marginBottom: '32px'
                }} />
                <Stack spacing={3} style={{ width: '80%' }}>

                    <FormControl >
                        <InputLabel classes={{
                            root: classes.labelRoot,
                            shrink: classes.shrink

                        }} htmlFor="email_input">{EMAIL(lang)}</InputLabel>
                        <Input type='email' sx={{ direction: SIDE(lang) }} id="email_input" aria-describedby="email_helper_text" />

                    </FormControl>
                    <FormControl >
                        <InputLabel classes={{
                            root: classes.labelRoot,
                            shrink: classes.shrink
                        }} htmlFor="password_input">{PASSWORD(lang)}</InputLabel>
                        <Input type="password" dir={SIDE(lang)} id="password_input" aria-describedby="password_helper_text" />

                    </FormControl>
                    <br />
                    <Button title={LOGIN_OK(lang)} onClick={() => { }} type='submit' />



                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: '8px',
                        marginRight: '8px'
                    }}>

                        <hr style={{ width: '42%', height: '.1px' }} />
                        <p style={{ width: '20%' }}>{OR(lang)}</p>
                        <hr style={{ width: '42%', height: '.1px' }} />
                    </div>

                </Stack>

            </form>

            <Auth style={{ margin: '0px' }} title='' redirect= {(location.state && location.state.cachedLocation) ? location.state.cachedLocation : "/pnp"} />

            <div>
                <Link to={(location.state && location.state.cachedLocation) ? { pathname: '/register', state: { cachedLocation: location.state.cachedLocation } } : '/register'} >{NO_ACCOUNT(lang)}</Link>
            </div>

            <div>
                <Link style={{ fontSize: '12px', textDecoration: 'none red' }} to={'/register'}>{FORGOT_PASSWORD(lang)}</Link>
            </div>
        </div>
    </div >)
}