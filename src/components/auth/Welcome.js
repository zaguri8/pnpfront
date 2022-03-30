import { useFirebase } from "../../context/Firebase";
import { useLanguage } from "../../context/Language";
import { SECONDARY_WHITE } from "../../settings/colors";
import { SIDE } from "../../settings/strings";

export function Welcome() {
    const { appUser } = useFirebase()

    const { lang } = useLanguage()
    return <div style={{ padding: '4px', width: '75%' }}>
        {appUser && <span style={{ color: SECONDARY_WHITE, width: '100%' }}
         dir={SIDE(lang)}>
         <b>{lang ==='heb' ?  `תודה ${appUser.name} !` : `Thanks, ${appUser.name} !`}</b>
         <br/>
         {lang === 'heb' ? `תודה שמילאת את טופס ההרשמה שלנו. אנו שמחים שהצטרפת אלינו. שיהיה לך יום נעים, Pick n Pull` :
            `Thanks ${appUser.name}! Thank you for filling out our sign up form. We are glad that you joined us . Have a nice day, Pick n Pull`}</span>}
    </div>
}