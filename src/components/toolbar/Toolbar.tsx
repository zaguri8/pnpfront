import { toolbar } from "../../settings/styles"
import ToolbarItem from "./ToolbarItem"
import { CREATE_EVENT, TOOLBAR_LOGIN, TOOLBAR_LANGUAGE, MY_ACCOUNT } from "../../settings/strings"
import { flex } from "../../settings/styles"
import search from '../../assets/images/search.png'
import israel from '../../assets/images/israel.png'
import america from '../../assets/images/america.png'
import { menuIcon_black } from "../../assets/images"
import { ORANGE_GRADIENT_PRIMARY } from "../../settings/colors"
import { useAuthState } from "../../context/Firebase"
import { useLanguage } from "../../context/Language"
export type ToolbarProps = {
    menuToggle: () => void
}
export function ToolBar(props: ToolbarProps) {

    const { firebase, user } = useAuthState()

    const { lang, setLang } = useLanguage()
    return <div id='toolbar' style={{ ...toolbar() }}>
        <div style={{
            ...flex('row', 'center', 'center'),
            ...{ zIndex: '9' }
        }}>
            <ToolbarItem style={{
                'backgroundImage': ORANGE_GRADIENT_PRIMARY,
                color: 'white',
                paddingTop: '4px',
                paddingBottom: '4px',
                marginLeft: '4px',
                minWidth: 'fit-content',
                marginRight: '4px'
            }} id='create_event' text={CREATE_EVENT(lang)} action={() => { }} />
            <ToolbarItem id='login' text={user === null ? TOOLBAR_LOGIN(lang) : MY_ACCOUNT(lang)} action={() => {
                firebase.auth.signOut()
            }} />

            <ToolbarItem id='search' style={{ paddingLeft: '4px' }} image={search} /> </div>
        <div style={{ ...flex('row', 'center', 'center') }}>
            <div style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }} onClick={() => setLang(lang === 'heb' ? 'en' : 'heb')}>
                <ToolbarItem id='language' text={lang === 'heb' ? 'EN' : 'HE'} style={{fontFamily:'Open Sans Hebrew', fontSize: '14px', margin: '0px', padding: '2px' }} action={() => { }} />
                <img style={{padding:'4px', width: '25px', height: '25px' }} src={lang === 'heb' ? america : israel} />
            
            </div>
            <ToolbarItem id='options' image={menuIcon_black} style={{ 'marginRight': '24px' }} action={props.menuToggle} />

        </div>

    </div>
}