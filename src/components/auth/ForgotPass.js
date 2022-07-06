import { Button, TextField } from "@mui/material";
import { makeStyles } from '@mui/styles'
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useFirebase } from "../../context/Firebase";
import { useLanguage } from "../../context/Language";
import { useLoading } from "../../context/Loading";
import { BLACK_ROYAL, PRIMARY_BLACK, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import { SIDE } from "../../settings/strings";
import { submitButton, textFieldStyle } from "../../settings/styles";
import { InnerPageHolder, PageHolder } from "../utilities/Holders";


export default function ForgotPass() {

    const [email, setEmail] = useState('')

    const useStyles = makeStyles(() => textFieldStyle(SECONDARY_BLACK, {width:'275px', background: SECONDARY_WHITE }))
    const classes = useStyles()
    const { lang } = useLanguage()

    const { firebase } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()

    return <PageHolder>
        <InnerPageHolder style={{ background: BLACK_ROYAL }}>
            <TextField
                type='email'
                classes={{ root: classes.root }}
                value={email}
                name='email'
                dir={SIDE(lang)}
                onChange={(e) => { setEmail(e.target.value) }}
                placeholder={lang === 'heb' ? 'הכנס כתובת אימייל' : 'Enter email address'}></TextField>
            <label style={{ maxWidth: '275px', padding: '8px', color: SECONDARY_WHITE }}>{lang === 'heb' ? 'הכנס את כתובת האימייל שלך ונשלח לך דוא"ל לאיפוס סיסמא' : 'Enter your email address to receive a link with a password reset'}</label>
            <label style={{ maxWidth: '275px', color: SECONDARY_WHITE, fontSize: '12px', padding: '4px' }}>{lang === 'heb' ? 'לא קיבלת את מייל האיפוס ? נסה לבדוק בדואר ספאם' : 'Havent got an email ? try looking in the spam mail'}</label>
            <Button
                onClick={() => {
                    doLoad()
                    sendPasswordResetEmail(firebase.auth, email)
                        .then(res => {
                            cancelLoad()
                            alert('מייל לאיפוס סיסמא נשלח !')
                        }).catch(e => {
                            cancelLoad()
                            alert('אירעתה שגיאה בעת שליחת מייל לאיפוס סיסמא')
                        })
                }}
                style={{ ...submitButton(false), ...{ fontSize: '16px', margin: '4px', textTransform: 'none', width: lang === 'heb' ? '75%' : '95%', padding: '4px',maxWidth:'200px', height: 'fit-content' } }}>
                {lang === 'heb' ? 'שלח לינק איפוס סיסמא' : 'Send Password reset email'}
            </Button>
        </InnerPageHolder>
    </PageHolder>
}