import logo from '../assets/images/logo_white.png';
import homeIcon from '../assets/images/appmenu/pink/home.svg'
import userIcon from '../assets/images/appmenu/pink/user.svg'
import questionIcon from '../assets/images/appmenu/pink/question.svg'
import coupleIcon from '../assets/images/appmenu/pink/couple.svg'
import busIcon from '../assets/images/appmenu/pink/bus.svg'
import listIcon from '../assets/images/appmenu/pink/list.svg'

import homeIconWhite from '../assets/images/appmenu/white/home_white.svg'
import userIconWhite from '../assets/images/appmenu/white/user_white.svg'
import questionIconWhite from '../assets/images/appmenu/white/question_white.svg'
import coupleIconWhite from '../assets/images/appmenu/white/couple_white.svg'
import busIconWhite from '../assets/images/appmenu/white/bus_white.svg'
import listIconWhite from '../assets/images/appmenu/white/list_white.svg'


import { HELLO, MENU_ITEM_1, MENU_ITEM_2, MENU_ITEM_3, MENU_ITEM_4, REGISTER_TITLE, SIDE, TOOLBAR_LOGIN, CREATE_EVENT, MENU_ITEM_5 } from '../settings/strings.js';
import { flex } from '../settings/styles.js';
import ToolbarItem from './toolbar/ToolbarItem';
import { v4 } from 'uuid';
import { useLocation } from 'react-router'
import { useFirebase } from '../context/Firebase';
import { useLanguage } from '../context/Language.js';
import DiamondIcon from '@mui/icons-material/Diamond';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router';
import { useLoading } from '../context/Loading';
import './AppMenu.css'
import { DARKER_BLACK_SELECTED, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, RED_ROYAL, SECONDARY_WHITE } from '../settings/colors.js';
import { Stack } from '@mui/material';
function MenuProfile(props: { clickedItem: (indexPath: number) => void }) {

    const { user, appUser, firebase, uploadUserImage } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()
    const { lang } = useLanguage()

    const nav = useNavigate()
    return (<div style={{
        display: 'flex',
        borderRadius: user ? '8px' : 'inherit',
        boxShadow: user ? 'rgba(0, 0, 0, 0.35) 0px -50px 120px -28px inset' : 'inherit',
        border: user ? '1px solid white' : 'inherit',
        width: user ? '80%' : 'auto',
        background: user ? PRIMARY_BLACK : 'none',
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

            {appUser === null ? <div style={{
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
            </div> : <Stack direction={'row'} paddingLeft='16px' paddingRight='16px' style={{ width: '100%' }}>
                <Stack >{appUser!.image ? <img style={{ marginLeft: '8px', borderRadius: '38px', objectFit: 'cover', border: '1px solid whitesmoke', width: '76px', height: '76px' }} src={appUser!.image}></img> : <AccountCircleIcon style={{ marginLeft: '8px', width: '75px', height: '75px' }} />}
                    <Stack alignItems={'center'}>


                        <label
                            dir={lang === 'heb' ? 'ltr' : 'rtl'}
                            htmlFor="files"
                            style={{ textAlign: 'center', cursor: 'pointer', columnGap: '2px', display: 'flex', fontWeight: 'bold', padding: '2px', justifyContent: 'center', marginLeft: '8px', fontSize: '10px', color: SECONDARY_WHITE }}>{lang === 'heb' ? 'ערוך תמונה' : 'Edit image'}<EditIcon style={{ width: '12px', height: '12px' }} /></label>
                        <input
                            onChange={async (e) => {
                                if (e.target.value) {
                                    if (e.target.files) {
                                        doLoad()
                                        await e.target.files[0].arrayBuffer()
                                            .then(async b => {
                                                return await uploadUserImage(b)
                                                    .then(() => {
                                                        cancelLoad(true)
                                                    }).catch(() => { cancelLoad(true) })
                                            }).catch(e => {
                                                cancelLoad(true)
                                            })
                                        e.target.files = null
                                    }
                                }
                            }}
                            id='files' type='file' style={{ display: 'none', width: '2px' }} />
                    </Stack>
                </Stack>
                <Stack style={{ marginTop: '16px' }}>
                    <span style={{ fontSize: '14px', color: 'white' }}>{`${HELLO(lang)}`}</span>
                    {appUser && appUser.name && <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>{`${appUser.name.split(' ').length > 1 ? appUser.name.split(' ')[0] : appUser?.name}`}</span>}
                </Stack>
            </Stack>}
        </div>
        {/* {user && <span style={{ fontSize: '10px', color: 'white', margin: '16px', padding: '0px' }}>מזהה : <b>{user.uid} </b> </span>} */}
    </div>);
}


function AppMenu(props: { menuToggle: (completion?: () => void) => void }) {


    const { lang } = useLanguage()
    const { openUnderConstruction } = useLoading()
    const location = useLocation()
    const nav = useNavigate()
    const clickedItem = (indexPath: number) => {
        props.menuToggle(() => {
            switch (indexPath) {
                case 1:
                    if (location.pathname === '/')
                        return
                    else nav('/')
                    break;
                case 2:
                    if (location.pathname === '/myaccount/transactions?i=1')
                        return
                    else nav('/myaccount/transactions?i=1')
                    break;
                case 3:
                    if (location.pathname === '/myaccount/transactions?i=2')
                        return
                    else nav('/myaccount/transactions?i=2')
                    break;
                case 4:
                    openUnderConstruction(lang)
                    break;
                case 5:
                    if (location.pathname === '/createPrivateEvent')
                        return
                    else nav('/createPrivateEvent')
                    break;
                case 6:
                    if (location.pathname === '/createEvent')
                        return
                    else nav('/createEvent')
                    break;
                case 8:
                    if (location.pathname === '/login')
                        return
                    else nav('/login')
                    break;

            }
        })

    }

    const MenuItem = (props: {
        text: string,
        icon: string[],
        marked: boolean,
        action: () => void,
    }) => {
        return <li className={props.marked ? 'app_menu_item_activated' : 'app_menu_item'} onClick={props.action}>
            <div className={props.marked ? 'app_menu_item_holder_activated' : 'app_menu_item_holder'}>
                {!props.marked && <div className='app_menu_item_decor' />}
                <img src={props.marked ? props.icon[1] : props.icon[0]} />
                <p>{props.text}</p>
            </div>
        </li>
    }
    const menuItems = [//app_menu_item_activated
        { text: MENU_ITEM_1(lang), icon: [homeIcon, homeIconWhite], marked: location.pathname === '/' },
        { text: MENU_ITEM_2(lang), icon: [userIcon, userIconWhite], marked: (location.pathname === '/myaccount/transactions' && location.search === '?i=1') },
        { text: MENU_ITEM_3(lang), icon: [listIcon, listIconWhite], marked: (location.pathname === '/myaccount/transactions' && location.search === '?i=2') },
        { text: MENU_ITEM_4(lang), icon: [questionIcon, questionIconWhite], marked: location.pathname === '/howdoesitwork' },
        { text: MENU_ITEM_5(lang), icon: [coupleIcon, coupleIconWhite], marked: location.pathname === '/createeventprivate' },
        { text: CREATE_EVENT(lang), icon: [busIcon, busIconWhite], marked: location.pathname === '/createevent' },
    ].map((item, index) => ({ ...item, action: () => clickedItem(index + 1) }))
        .map(item => <MenuItem key={v4()} text={item.text} icon={item.icon} marked={item.marked} action={item.action} />)


    return <div id='menu' style={{
        ...{
            whiteSpace: 'nowrap',
            direction: 'rtl',
            'overflow': 'scroll',
            height: '100vh',
            width: '300px',
            position: 'fixed',
            right: '0',
            zIndex: '10030',
        },
        ...flex('column', 'center'),
        ...{ background: PRIMARY_BLACK }
    }}>
        <ToolbarItem bold image={logo} />
        {/* <MenuProfile clickedItem={clickedItem} /> */}
        <ul className='app_menu_list'>
            {menuItems}
        </ul>
    </div>
}
export default AppMenu