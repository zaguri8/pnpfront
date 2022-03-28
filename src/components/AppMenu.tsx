import logo from '../assets/images/logo_white.png';
import { HELLO, MENU_ITEM_1, MENU_ITEM_2, MENU_ITEM_3, MENU_ITEM_4, REGISTER_TITLE, TOOLBAR_LOGIN } from '../settings/strings.js';
import { flex } from '../settings/styles.js';
import ToolbarItem from './toolbar/ToolbarItem';
import { useFirebase } from '../context/Firebase';
import { useLanguage } from '../context/Language.js';
import { useNavigate } from 'react-router';
import { useLoading } from '../context/Loading';
import { ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, SECONDARY_WHITE } from '../settings/colors.js';
function MenuProfile(props: { clickedItem: (indexPath: number) => void }) {

    const { user, appUser, firebase, uploadUserImage } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()
    const { lang } = useLanguage()

    const nav = useNavigate()
    return (<div style={{
        display: 'flex',
        backgroundImage: user != null ? ORANGE_GRADIENT_PRIMARY : 'inherit',
        borderRadius: user ? '8px' : 'inherit',
        boxShadow: user ? 'rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset' : 'inherit',
        border: user ? '1px solid white' : 'inherit',
        width: user ? '80%' : 'auto',
        margin: user ? '16px' : 'inherit',
        flexDirection: 'column',
        paddingTop: '16px',
        paddingBottom: '16px'
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: 'fit-content',
            justifyContent: 'center'
        }}>

            {user === null ? <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <span onClick={() => props.clickedItem(4)} style={{
                    padding: '4px',
                    color: SECONDARY_WHITE,
                    cursor: 'pointer'
                }}>{REGISTER_TITLE(lang)}</span>
                <span onClick={() => props.clickedItem(5)} style={{
                    padding: '4px',
                    color: SECONDARY_WHITE,
                    cursor: 'pointer'
                }}>{TOOLBAR_LOGIN(lang)}</span>
            </div> : <div><span style={{ fontSize: '14px', color: 'white' }}>{`${HELLO(lang)}`}</span><br /><span style={{ fontSize: '14px', color: 'white' }}>{`${appUser?.name}`}</span></div>}
        </div>
        {/* {user && <span style={{ fontSize: '10px', color: 'white', margin: '16px', padding: '0px' }}>מזהה : <b>{user.uid} </b> </span>} */}
    </div>);
}


function AppMenu(props: { menuToggle: (completion?: () => void) => void }) {


    const { lang } = useLanguage()

    const nav = useNavigate()
    const clickedItem = (indexPath: number) => {
        props.menuToggle(() => {
            switch (indexPath) {
                case 0:
                    break;
                case 1:
                    nav('/myaccount')
                    break;
                case 2:
                    nav('/myaccount/transactions')
                    break;
                case 3:
                    break;
                case 4:
                    nav('/register')
                    break;
                case 5:
                    nav('/login')
                    break;
            }
        })

    }

    return <div id='menu' style={{
        ...{
            whiteSpace: 'nowrap',
            direction: 'rtl',
            'overflow': 'scroll',
            height: '100vh',
            width: '300px',
            position: 'fixed',
            right: '0',
            zIndex: '9999',
        },
        ...flex('column', 'center'),
        ...{ background: PRIMARY_BLACK }
    }}>
        <ToolbarItem bold image={logo} />
        <MenuProfile clickedItem={clickedItem} />
        <ToolbarItem text={MENU_ITEM_1(lang)} bold={true} action={() => clickedItem(0)} line={true} style={{ width: '80%' }} />
        <ToolbarItem text={MENU_ITEM_2(lang)} bold={true} action={() => clickedItem(1)} line={true} style={{ width: '80%' }} />
        <ToolbarItem text={MENU_ITEM_3(lang)} bold={true} action={() => clickedItem(2)} line={true} style={{ width: '80%' }} />
        <ToolbarItem text={MENU_ITEM_4(lang)} bold={true} action={() => clickedItem(3)} style={{ width: '80%' }} />

    </div>
}
export default AppMenu