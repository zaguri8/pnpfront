import './Footer.css'
import React, { CSSProperties } from 'react'
import iconWhite from '../../assets/images/logo_white.png'
import { Stack } from '@mui/material'
import { v4 } from 'uuid'
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useLanguage } from '../../context/Language'
import { SIDE } from '../../settings/strings'
import { useNavigate } from 'react-router'
import { withHookGroup } from '../generics/withHooks'
import { Hooks } from '../generics/types'
function Footer(props: Hooks) {
    const menuRightContent = {
        "איך זה עובד?": () => console.log("sd"),
        "התחברות/הרשמה": () => props.nav('/myaccount/transactions'),
        "צור/י אירוע": () => props.nav('/createevent'),
        "English": () => props.language.setLang(props.language.lang === 'heb' ? 'en' : 'heb')
    }
    const openWhatsapp = () => {
        window.open('https://wa.me/972535006117')
    }
    const extraInfo = {
        "צור קשר": openWhatsapp,
        "תקנון": () => props.nav('termsOfService', { state: { returnPage: '/' } }),
        "מדיניות/פרטיות": () => console.log("sd"),
        "נגישות": () => console.log("sd")
    }
    return <div className='footer_container'>
        <div className="footer_right_stack">
            <img id={'footer_logo'} src={iconWhite} />

            <ul className="footer_right_list">
                <label>{props.language.lang === 'heb' ? 'ניווט מהיר' : 'Quick navigation'}</label>
                {Object.entries(menuRightContent).map(e =>
                    <li onClick={e[1]} key={v4()}>{e[0]}</li>)}
            </ul>
            <ul className="footer_right_list">
                <label>{props.language.lang === 'heb' ? 'מידע נוסף' : 'Additional info'}</label>
                {Object.entries(extraInfo).map(e =>
                    <li onClick={e[1]} key={v4()}>{e[0]}</li>)}
            </ul>
        </div>
        <Stack className="footer_social_media">
            <label>{props.language.lang === 'heb' ? 'במדיה החברתית' : 'Social media'}</label>
            <Stack direction={'row'} style={{ cursor: 'pointer' }}>
                <InstagramIcon />
                <WhatsAppIcon onClick={openWhatsapp} />
                <TwitterIcon />
                <FacebookIcon />
            </Stack>
        </Stack>

        <Stack className="footer_social_rights" dir={SIDE(props.language.lang)}>
            <label>{(props.language.lang === 'heb' ? 'כל הזכויות שמורות' : 'All rights reserved') + ", Pick n Pull 2022."}</label>
        </Stack>
    </div>
}

export default withHookGroup(Footer, ['language', 'nav'])