import { ToolbarItem } from './ToolbarItem'
import { profile } from '../assets/images.js'
import { flex } from '../styles';
import { menuItem_1, menuItem_2, menuItem_3, menuItem_4, menuItem_5 } from '../strings';
import logo from '../assets/images/logo_black.png'
function AppMenu(props) {


    return <div id='menu' style={{
        ...{
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
        <ToolbarItem image={logo} />


        <div style={{ display: 'flex', flexDirection: 'row', padding: '16px' }}>

            <img src={profile} style={{ width: '75px', height: '75px' }} />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '8px',
            }}>
                <span style={{ padding: '4px', cursor: 'pointer' }}>הרשמה</span>
                <span style={{ padding: '4px', cursor: 'pointer' }}>התחברות</span>
            </div>
        </div>

        <ToolbarItem text={menuItem_3('heb')} bold={true} action={props.menuToggle} line={true} style={{ width: '80%' }} />
        <ToolbarItem text={menuItem_4('heb')} bold={true} action={props.menuToggle} line={true} style={{ width: '80%' }} />
        <ToolbarItem text={menuItem_1('heb')} bold={true} action={props.menuToggle} line={true} style={{ width: '80%' }} />
        <ToolbarItem text={menuItem_5('heb')} bold={true} action={props.menuToggle} style={{ width: '80%' }} />

    </div>
}
export default AppMenu