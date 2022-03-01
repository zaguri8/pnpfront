import { profile } from '../assets/images.js';
import logo from '../assets/images/logo_black.png';
import { MENU_ITEM_1, MENU_ITEM_2, MENU_ITEM_3, MENU_ITEM_4, PICK_IMAGE, REGISTER_TITLE, TOOLBAR_LOGIN } from '../settings/strings.js';
import { flex } from '../settings/styles.js';
import $ from 'jquery'
import ToolbarItem from './toolbar/ToolbarItem';
import { useAuthState } from '../context/Firebase.js';
import { useLanguage } from '../context/Language.js';
import { List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router';

function MenuProfile(props: { clickedItem: (indexPath: Number) => void }) {

    const { user } = useAuthState()
    const { lang } = useLanguage()
    const nav = useNavigate()
    return (<div style={{
        display: 'flex',
        background: user ? 'orange' : 'inherit',
        borderRadius: user ? '8px' : 'inherit',
        border: user ? '1px solid gray' : 'inherit',
        width: user ? '80%' : 'auto',
        margin: user ? '16px' : 'inherit',
        flexDirection: 'column',
        padding: '16px'
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {<div >

                {user != null && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    <input onChange={(event) => {
                        if (event.target.files) {
                            $('#menu_profile_image').attr('src', URL.createObjectURL(event.target.files[0]))
                            $('#menu_profile_image').css('borderRadius', '42.5px')
                        }

                    }} type="file" id="files" style={{ display: 'none' }} />

                </div>}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <img id='menu_profile_image' alt='' src={profile} style={{
                        width: '75px',
                        borderRadius: '42.5px',
                        border: '1px solid white',
                        height: '75px'
                    }} />          <label style={{
                        fontSize: '10px',
                        color: 'white',
                        padding: '4px'
                    }} onChange={(e) => alert(e)} htmlFor='files'>{PICK_IMAGE(lang, false)}</label></div></div>}
            {user === null ? <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '8px'
            }}>
                <span onClick={() => props.clickedItem(4)} style={{
                    padding: '4px',
                    cursor: 'pointer'
                }}>{REGISTER_TITLE(lang)}</span>
                <span onClick={() => props.clickedItem(5)} style={{
                    padding: '4px',
                    cursor: 'pointer'
                }}>{TOOLBAR_LOGIN(lang)}</span>
            </div> : <List style={{ paddingLeft: '16px', paddingRight: '16px' }} >
                <span style={{ fontSize: '14px', color: 'white', textUnderlinePosition: 'under', textDecoration: 'underline' }}>שם</span>
                <ListItemText style={{ color: 'white' }}>{user.email.split('@')[0]}</ListItemText>
                <span style={{ fontSize: '14px', color: 'white', textUnderlinePosition: 'under', textDecoration: 'underline' }}>אסימונים</span>
                <ListItemText style={{ color: 'white' }}>{user.email.split('@')[0]}</ListItemText>

            </List>}
        </div>
        {user && <span style={{ fontSize: '10px', color: 'white', margin: '0px', padding: '0px' }}>מזהה : <b>{user.uid} </b> </span>}
    </div>);
}


function AppMenu(props: { menuToggle: (completion?: () => void) => void }) {


    const nav = useNavigate()
    const clickedItem = (indexPath: Number) => {
        props.menuToggle(() => {
            switch (indexPath) {
                case 0:
                    break;
                case 1:
                    nav('/myaccount')
                    break;
                case 2:
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
        ...{ background: 'white' }
    }}>
        <ToolbarItem bold image={logo} />
        <MenuProfile clickedItem={clickedItem} />
        <ToolbarItem text={MENU_ITEM_1('heb')} bold={true} action={() => clickedItem(0)} line={true} style={{ width: '80%' }} />
        <ToolbarItem text={MENU_ITEM_2('heb')} bold={true} action={() => clickedItem(1)} line={true} style={{ width: '80%' }} />
        <ToolbarItem text={MENU_ITEM_3('heb')} bold={true} action={() => clickedItem(2)} line={true} style={{ width: '80%' }} />
        <ToolbarItem text={MENU_ITEM_4('heb')} bold={true} action={() => clickedItem(3)} style={{ width: '80%' }} />

    </div>
}
export default AppMenu