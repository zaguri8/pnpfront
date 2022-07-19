import { toolbar } from "../../settings/styles"
import ToolbarItem, { toolbarItemStyle } from "./ToolbarItem"
import { CREATE_EVENT, TOOLBAR_LOGIN, MY_ACCOUNT } from "../../settings/strings"
import { flex } from "../../settings/styles"
import logo_white from '../../assets/images/logo_white.png'
import search from '../../assets/images/search.png'
import israel from '../../assets/images/israel.png'
import america from '../../assets/images/america.png'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { menuIcon } from "../../assets/images"
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { DARKER_BLACK_SELECTED, PRIMARY_BLACK, PRIMARY_WHITE } from "../../settings/colors"
import { useFirebase } from "../../context/Firebase"
import { useLanguage } from "../../context/Language"
import { useLocation, useNavigate } from "react-router"
export type ToolbarProps = {
    menuToggle: () => void
}
export function ToolBar(props: ToolbarProps) {

    const { user, appUser } = useFirebase()

    const nav = useNavigate()
    const { lang, setLang } = useLanguage()
    const location = useLocation()
    return <div id='toolbar'>
        <div style={{
            ...flex('row', 'center', 'center'),
            ...{ zIndex: '9', overflow: 'hidden' }
        }}>
            {/* <ToolbarItem style={{
                'backgroundImage': DARKER_BLACK_SELECTED,
                color: 'white',
                paddingTop: '4px',
                paddingBottom: '4px',
                fontSize: '16px',
                marginLeft: '4px',
                minWidth: 'fit-content',
                marginRight: '4px'
            }} id='create_event' text={CREATE_EVENT(lang)} action={() => { nav('/createevent') }} />
 */}
            <ToolbarItem style={{marginBottom:'2px'}} id='options' image={menuIcon} action={props.menuToggle} />
            <ToolbarItem id='login' icon={<AccountBoxIcon />}

                style={{ color: PRIMARY_WHITE, marginTop: '4px' }}
                action={() => {
                    user === null ? nav('/login') : nav('/myaccount')
                }} />

            {appUser && appUser.producer && <QrCodeScannerIcon
                onClick={() =>  {
                    if (location.pathname === '/scan') return;
                    nav('/scan')
                }}
                id='scan'

                sx={{ ... { width: '18px', height: '18px', marginBottom: '2px' }, ...toolbarItemStyle({ image: true }) }}
            />}

            {appUser && appUser.admin && <AdminPanelSettingsIcon
                onClick={() =>  {
                    if (location.pathname === '/adminPanel') return;
                    nav('/adminPanel')
                }}
                id='scan'

                sx={{ ... { width: '18px', height: '18px', marginBottom: '2px' }, ...toolbarItemStyle({ image: true }) }}
            />}

            {<img style={{ cursor: 'pointer', width: '90px', height: '30px', position: 'absolute', right: '16px' }} src={logo_white}
                onClick={() => {
                    if (location.pathname === '/') return;
                    nav('/');
                }
                } />}
        </div>

        {/* 
        <div style={{ ...flex('row', 'center', 'center') }}>
            <div id='lang' style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }} onClick={() => setLang(lang === 'heb' ? 'en' : 'heb')}>
                <ToolbarItem id='language' text={lang === 'heb' ? 'HE' : 'EN'} style={{ fontFamily: 'Open Sans Hebrew', fontSize: '14px', margin: '0px', color: 'white', padding: '2px' }} action={() => { }} />
                <img style={{ padding: '4px', width: '25px', height: '25px' }} src={lang === 'heb' ? israel : america} />

            </div>
           

        </div> */}

    </div>
}