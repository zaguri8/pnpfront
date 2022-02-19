import { ToolbarItem } from './ToolbarItem'
import { profile } from '../assets/images.js'
import { flex } from '../styles';
import { MENU_ITEM_1, MENU_ITEM_2, MENU_ITEM_3, MENU_ITEM_4, MENU_ITEM_5 } from '../strings';
import logo from '../assets/images/logo_black.png'

function MenuProfile() {
    return (<div style={{
        display: 'flex',
        flexDirection: 'row',
        padding: '16px'
    }}>

        <img src={profile} style={{
            width: '75px',
            height: '75px'
        }} />
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '8px'
        }}>
            <span style={{
                padding: '4px',
                cursor: 'pointer'
            }}>הרשמה</span>
            <span style={{
                padding: '4px',
                cursor: 'pointer'
            }}>התחברות</span>
        </div>
    </div>);
}


function AppMenu(props) {


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


        <MenuProfile/>
        <ToolbarItem text={MENU_ITEM_1('heb')} bold={true} action={props.menuToggle} line={true} style={{ width: '80%' }} />
        <ToolbarItem text={MENU_ITEM_2('heb')} bold={true} action={props.menuToggle} line={true} style={{ width: '80%' }} />
        <ToolbarItem text={MENU_ITEM_3('heb')} bold={true} action={props.menuToggle} line={true} style={{ width: '80%' }} />
        <ToolbarItem text={MENU_ITEM_4('heb')} bold={true} action={props.menuToggle} style={{ width: '80%' }} />

    </div>
}
export default AppMenu