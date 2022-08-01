import { toolbar } from "../../settings/styles"
import ToolbarItem, { toolbarItemStyle } from "./ToolbarItem"
import { CREATE_EVENT, TOOLBAR_LOGIN, MY_ACCOUNT } from "../../settings/strings"
import { flex } from "../../settings/styles"
import menuIcon from '../../assets/images/menuburger.svg';
import userIcon from '../../assets/images/user.svg';
import logo_white from '../../assets/images/logo_white.png'
import search from '../../assets/images/search.png'
import israel from '../../assets/images/israel.png'
import america from '../../assets/images/america.png'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { DARKER_BLACK_SELECTED, PRIMARY_BLACK, PRIMARY_WHITE } from "../../settings/colors"
import { useFirebase } from "../../context/Firebase"
import { useLanguage } from "../../context/Language"
import { useLocation, useNavigate } from "react-router"
export type ToolbarProps = {
    menuToggle: (off: boolean) => void
}
export function ToolBar(props: ToolbarProps) {

    const { user, appUser } = useFirebase()
    const nav = useNavigate()
    const location = useLocation()
    return <div id='toolbar'>
        <div style={{
            ...flex('row', 'center', 'center'),
            ...{ zIndex: '9', overflow: 'hidden' }
        }}>
            <ToolbarItem style={{ marginBottom: '2px' }} id='options' image={menuIcon} action={() => props.menuToggle(false)} />
            <ToolbarItem id='login' image={userIcon}

                style={{ color: PRIMARY_WHITE, marginTop: '4px' }}
                action={() => {
                    user === null ? nav('/login') : nav('/myaccount/transactions')
                    props.menuToggle(true);
                }} />

            {appUser && appUser.producer && <QrCodeScannerIcon
                onClick={() => {
                    if (location.pathname === '/scan') return;
                    nav('/scan')
                }}
                id='scan'

                sx={{ ... { width: '18px', height: '18px', marginBottom: '2px' }, ...toolbarItemStyle({ image: true }) }}
            />}

            {appUser && appUser.admin && <AdminPanelSettingsIcon
                onClick={() => {
                    if (location.pathname === '/adminPanel') return;
                    nav('/adminPanel')
                    props.menuToggle(true);
                }}
                id='scan'

                sx={{ ... { width: '18px', height: '18px', marginBottom: '2px' }, ...toolbarItemStyle({ image: true }) }}
            />}

            {<img style={{ cursor: 'pointer', width: '90px', height: '30px', position: 'absolute', right: '16px' }} src={logo_white}
                onClick={() => {
                    if (location.pathname === '/') return;
                    nav('/');
                    props.menuToggle(true);
                }
                } />}
        </div>

    </div>
}