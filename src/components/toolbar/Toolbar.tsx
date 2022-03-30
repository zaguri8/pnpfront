import { toolbar } from "../../settings/styles"
import ToolbarItem, { toolbarItemStyle } from "./ToolbarItem"
import { CREATE_EVENT, TOOLBAR_LOGIN, MY_ACCOUNT } from "../../settings/strings"
import { flex } from "../../settings/styles"
import search from '../../assets/images/search.png'
import israel from '../../assets/images/israel.png'
import america from '../../assets/images/america.png'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { menuIcon } from "../../assets/images"
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { DARKER_BLACK_SELECTED, PRIMARY_WHITE } from "../../settings/colors"
import { useFirebase } from "../../context/Firebase"
import { useLanguage } from "../../context/Language"
import { useNavigate } from "react-router"
export type ToolbarProps = {
    menuToggle: () => void
}
export function ToolBar(props: ToolbarProps) {

    const { user, appUser } = useFirebase()

    const nav = useNavigate()
    const { lang, setLang } = useLanguage()
    return <div id='toolbar' style={{ ...toolbar() }}>
        <div style={{
            ...flex('row', 'center', 'center'),
            ...{ zIndex: '9', overflow: 'hidden' }
        }}>
            <ToolbarItem style={{
                'backgroundImage': DARKER_BLACK_SELECTED,
                color: 'white',
                paddingTop: '4px',
                paddingBottom: '4px',
                fontSize: '16px',
                marginLeft: '4px',
                minWidth: 'fit-content',
                marginRight: '4px'
            }} id='create_event' text={CREATE_EVENT(lang)} action={() => { nav('/createevent') }} />
            <ToolbarItem id='login' style={{ color: PRIMARY_WHITE }} text={user === null ? TOOLBAR_LOGIN(lang) : MY_ACCOUNT(lang)} action={() => {
                user === null ? nav('/login') : nav('/myaccount')
            }} />

            <ToolbarItem
                action={() => nav('/searchRide')}
                id='search' style={{ paddingLeft: '4px' }} image={search} />

            {appUser && appUser.producer && <QrCodeScannerIcon
                onClick={() => nav('/scan')}
                id='scan'

                sx={{ ... { width: '18px', height: '18px', marginBottom: '2px' }, ...toolbarItemStyle({ image: true }) }}
            />}

            {appUser && appUser.admin && <AdminPanelSettingsIcon
                onClick={() => nav('/adminPanel')}
                id='scan'

                sx={{ ... { width: '18px', height: '18px', marginBottom: '2px' }, ...toolbarItemStyle({ image: true }) }}
            />}
        </div>


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
            <ToolbarItem id='options' image={menuIcon} style={{ 'marginRight': '24px' }} action={props.menuToggle} />

        </div>

    </div>
}