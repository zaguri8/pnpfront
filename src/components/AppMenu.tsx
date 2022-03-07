import { profile } from '../assets/images.js';
import logo from '../assets/images/logo_black.png';
import { HELLO, MENU_ITEM_1, MENU_ITEM_2, MENU_ITEM_3, MENU_ITEM_4, MY_COINS, MY_NAME, PICK_IMAGE, REGISTER_TITLE, TOOLBAR_LOGIN } from '../settings/strings.js';
import { flex } from '../settings/styles.js';
import $ from 'jquery'
import ToolbarItem from './toolbar/ToolbarItem';
import { useFirebase } from '../context/Firebase';
import { useLanguage } from '../context/Language.js';
import { List, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router';
import { useLoading } from '../context/Loading';
import { getDownloadURL } from 'firebase/storage';
import coins from '../assets/images/coins.png'
import { ORANGE_GRADIENT_PRIMARY } from '../settings/colors.js';
function MenuProfile(props: { clickedItem: (indexPath: Number) => void }) {

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
        padding: '16px'
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {<div >

                {user != null && user != undefined && appUser != null && appUser != undefined && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    <input onChange={(event) => {
                        if (event.target.files) {
                            doLoad()
                            const image = event.target.files[0]
                            image.arrayBuffer()
                                .then(buffer => uploadUserImage(buffer))
                                .then((res) => {
                                    if (res) {
                                        getDownloadURL(res.ref)
                                            .then(url => {
                                                firebase.realTime.updateUserImage(url).then(() => {
                                                    $('#menu_profile_image').css('borderRadius', '42.5px')
                                                    $('#menu_profile_image').attr('src', url)
                                                    cancelLoad()
                                                })
                                            }).catch(error => { console.log(error) })
                                    }
                                }).catch(error => { console.log(error) })
                        }

                    }} type="file" id="files" style={{ display: 'none' }} />

                </div>}
                {user ? <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <img id='menu_profile_image' alt='' src={appUser != null ? appUser.image : profile} style={{
                        width: '75px',
                        borderRadius: '42.5px',
                        border: '1px solid white',
                        height: '75px'
                    }} />          <label style={{
                        fontSize: '10px',
                        color: 'white',
                        padding: '4px'
                    }} onChange={(e) => alert(e)} htmlFor='files'>{PICK_IMAGE(lang, false)}</label></div> : null} </div>}
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
            </div> : <List style={{ paddingLeft: '16px', paddingRight: '16px', marginTop: '-24px', marginRight: '-8px', paddingTop: '0px' }} >
                <span style={{ fontSize: '18px', color: 'white', textUnderlinePosition: 'under' }}>{HELLO(lang)}</span>
                <ListItemText style={{ color: 'white' }}>{appUser?.name}</ListItemText>

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