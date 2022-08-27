import logo from '../../assets/images/logo_white.png';
import homeIcon from '../../assets/images/appmenu/pink/home.svg'
import userIcon from '../../assets/images/appmenu/pink/user.svg'
import questionIcon from '../../assets/images/appmenu/pink/question.svg'
import coupleIcon from '../../assets/images/appmenu/pink/couple.svg'
import busIcon from '../../assets/images/appmenu/pink/bus.svg'
import listIcon from '../../assets/images/appmenu/pink/list.svg'

import homeIconWhite from '../../assets/images/appmenu/white/home_white.svg'
import userIconWhite from '../../assets/images/appmenu/white/user_white.svg'
import questionIconWhite from '../../assets/images/appmenu/white/question_white.svg'
import coupleIconWhite from '../../assets/images/appmenu/white/couple_white.svg'
import busIconWhite from '../../assets/images/appmenu/white/bus_white.svg'
import listIconWhite from '../../assets/images/appmenu/white/list_white.svg'


import { HELLO, MENU_ITEM_1, MENU_ITEM_2, MENU_ITEM_3, MENU_ITEM_4, CREATE_EVENT, MENU_ITEM_5, CREATE_RIDE } from '../../settings/strings.js';
import { boxShadow, flex } from '../../settings/styles.js';
import ToolbarItem from './../toolbar/ToolbarItem';
import { v4 } from 'uuid';
import { useLocation } from 'react-router'
import './AppMenu.css'
import { PRIMARY_BLACK } from '../../settings/colors.js';
import { Hooks } from '../generics/types';
import { CommonHooks, withHookGroup } from '../generics/withHooks';


export type AppMenuProps = { menuToggle: (completion?: () => void) => void }
function AppMenu(props: AppMenuProps & Hooks) {
    const location = useLocation()
    const clickedItem = (indexPath: number) => {
        props.menuToggle(() => {
            switch (indexPath) {
                case 1:
                    if (location.pathname === '/')
                        return
                    else props.nav('/')
                    break;
                case 2:
                    if (location.pathname === '/myaccount/transactions?i=1')
                        return
                    else props.nav('/myaccount/transactions?i=1')
                    break;
                case 3:
                    if (location.pathname === '/myaccount/transactions?i=2')
                        return
                    else props.nav('/myaccount/transactions?i=2')
                    break;
                case 4:
                    props.loading.openUnderConstruction(props.language.lang)
                    break;
                case 5:
                    if (location.pathname === '/createPrivateEvent')
                        return
                    else props.nav('/createPrivateEvent')
                    break;
                case 6:
                    if (location.pathname === '/createEvent')
                        return
                    else props.nav('/createEvent')
                    break;
                case 7:
                    if (location.pathname === '/createRide')
                        return
                    else props.nav('/createRide')
                    break;
                case 8:
                    if (location.pathname === '/login')
                        return
                    else props.nav('/login')
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
                {props.marked && (function () { let a = []; for (let i = 0; i < 2; i++) { a.push(<div key={v4()} className={`app_menu_item_decor_${(2 + i)}`} />); } return a; })()}
            </div>
        </li>
    }
    const menuItems = [//app_menu_item_activated
        { text: MENU_ITEM_1(props.language.lang), icon: [homeIcon, homeIconWhite], marked: location.pathname === '/' },
        { text: MENU_ITEM_2(props.language.lang), icon: [userIcon, userIconWhite], marked: (location.pathname === '/myaccount/transactions' && location.search === '?i=1') },
        { text: MENU_ITEM_3(props.language.lang), icon: [listIcon, listIconWhite], marked: (location.pathname === '/myaccount/transactions' && location.search === '?i=2') },
        { text: MENU_ITEM_4(props.language.lang), icon: [questionIcon, questionIconWhite], marked: location.pathname === '/howdoesitwork' },
        { text: MENU_ITEM_5(props.language.lang), icon: [coupleIcon, coupleIconWhite], marked: location.pathname === '/createPrivateEvent' },
        { text: CREATE_EVENT(props.language.lang), icon: [busIcon, busIconWhite], marked: location.pathname === '/createEvent' },
        { text: CREATE_RIDE(props.language.lang), icon: [busIcon, busIconWhite], marked: location.pathname === '/createRide' }

    ].map((item, index) => ({ ...item, action: () => clickedItem(index + 1) }))
        .map(item => <MenuItem key={v4()} text={item.text} icon={item.icon} marked={item.marked} action={item.action} />)


    return <div id='menu' style={{
        ...{
            whiteSpace: 'nowrap',
            direction: 'rtl',
            'overflow': 'scroll',

            height: '100vh',
            width: '300px',
            overflowX: 'hidden',
            borderBottomLeftRadius: '72px',

            position: 'fixed',

            borderLeft: '1px solid rgba(255,255,255,0.5)',
            right: '0',
            zIndex: '10030',
            ...boxShadow()
        },
        ...flex('column', 'center'),
        ...{ background: PRIMARY_BLACK.replace('7)', '7,0.9)').replace('rgb', 'rgba') }
    }}>
        <ToolbarItem bold image={logo} />
        {/* <MenuProfile clickedItem={clickedItem} /> */}
        <ul className='app_menu_list'>
            {menuItems}
        </ul>
    </div>
}
export default withHookGroup<AppMenuProps>(AppMenu, CommonHooks)