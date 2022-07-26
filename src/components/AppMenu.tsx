import logo from '../assets/images/logo_white.png';

import { HELLO, MENU_ITEM_1, MENU_ITEM_6, MENU_ITEM_2, MENU_ITEM_3, MENU_ITEM_4, REGISTER_TITLE, SIDE, TOOLBAR_LOGIN, MENU_ITEM_7, MENU_ITEM_8, CREATE_EVENT } from '../settings/strings.js';
import { flex } from '../settings/styles.js';
import ToolbarItem from './toolbar/ToolbarItem';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation } from 'react-router'
import { useFirebase } from '../context/Firebase';
import { useLanguage } from '../context/Language.js';
import DiamondIcon from '@mui/icons-material/Diamond';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router';
import { useLoading } from '../context/Loading';
import { DARKER_BLACK_SELECTED, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, RED_ROYAL, SECONDARY_WHITE } from '../settings/colors.js';
import { Stack } from '@mui/material';
import Spacer from './utilities/Spacer';
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
                case 0:
                    break;
                case 1:
                    if (location.pathname === '/myaccount')
                        return
                    else nav('/myaccount')
                    break;
                case 2:
                    if (location.pathname === '/myaccount/transactions')
                        return
                    else nav('/myaccount/transactions')
                    break;
                case 3:
                    openUnderConstruction(lang)
                    break;
                case 4:
                    if (location.pathname === '/register')
                        return
                    else nav('/register')
                    break;
                case 5:
                    if (location.pathname === '/login')
                        return
                    else nav('/login')
                    break;
                case 6:
                    openUnderConstruction(lang)
                    break;
                case 7:
                    if (location.pathname === '/')
                        return
                    else nav('/')
                    break;
                case 8:
                    if (location.pathname === '/createPrivateEvent')
                        return
                    else nav('/createPrivateEvent')
                    break;

                case 9:
                    if (location.pathname === '/createEvent')
                        return
                    else nav('/createEvent')
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
            zIndex: '10030',
        },
        ...flex('column', 'center'),
        ...{ background: PRIMARY_BLACK }
    }}>
        <ToolbarItem bold image={logo} />
        <MenuProfile clickedItem={clickedItem} />
        <ToolbarItem text={MENU_ITEM_2(lang)} bold={true} action={() => clickedItem(1)} line={true} style={{ width: '80%', marginTop: '4px', marginBottom: '8px', borderRadius: '8px' }} />
        <ToolbarItem text={MENU_ITEM_3(lang)} bold={true} action={() => clickedItem(2)} line={true} style={{ width: '80%', marginTop: '4px', marginBottom: '8px', borderRadius: '8px' }} />
        <ToolbarItem text={MENU_ITEM_4(lang)} bold={true} action={() => clickedItem(3)} line={true} style={{ width: '80%', marginTop: '4px', marginBottom: '8px', borderRadius: '8px' }} />
        <ToolbarItem text={MENU_ITEM_6(lang)} bold={true} action={() => clickedItem(6)} line={true} style={{ width: '80%', fontWeight: 'bold', marginTop: '8px', marginBottom: '8px', borderRadius: '8px' }} />
        <ToolbarItem text={MENU_ITEM_8(lang)}
            icon={<DiamondIcon style={{ padding: '4px' }} />} bold={true} action={() => clickedItem(8)} line={true} style={{ width: '70%', padding: '4px', border: 'none', fontWeight: 'bold', marginTop: '8px', marginBottom: '8px', background: DARKER_BLACK_SELECTED }} />

        <ToolbarItem text={CREATE_EVENT(lang)}
            bold={true} action={() => clickedItem(9)} line={true} style={{ width: '50%', padding: '8px', border: 'none', fontWeight: 'bold', marginTop: '8px', marginBottom: '8px', background: DARKER_BLACK_SELECTED }} />

        <ToolbarItem text={MENU_ITEM_7(lang)}
            icon={<HomeIcon style={{ padding: '4px' }} />} bold={true} action={() => clickedItem(7)} line={true} style={{ width: '80%', border: 'none', fontWeight: 'bold', marginTop: '8px', marginBottom: '0px', background: 'none' }} />


    </div>
}
export default AppMenu