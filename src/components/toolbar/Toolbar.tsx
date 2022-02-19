import { toolbar } from "../../settings/styles"
import ToolbarItem from "./ToolbarItem"
import { CREATE_EVENT, TOOLBAR_LOGIN, TOOLBAR_LANGUAGE } from "../../settings/strings"
import { flex } from "../../settings/styles"
import search from '../../assets/images/search.png'
import { menuIcon_black } from "../../assets/images"
import { ORANGE_GRADIENT_PRIMARY } from "../../settings/colors"
export type ToolbarProps = {
    menuToggle: () => void
}
export function ToolBar(props: ToolbarProps) {

    return <div id='toolbar' style={{ ...toolbar() }}>
        <div style={{ ...flex('row', 'center', 'center'), ...{ zIndex: '9' } }}>
            <ToolbarItem style={{ 'backgroundImage': ORANGE_GRADIENT_PRIMARY, color: 'white', padding: '6px', marginLeft: '4px', marginRight: '4px' }} id='create_event' text={CREATE_EVENT('heb')} action={() => { }} />
            <ToolbarItem id='login' text={TOOLBAR_LOGIN('heb')} action={() => { }} />
            <ToolbarItem id='language' text={TOOLBAR_LANGUAGE('heb')} action={() => { }} />
            <ToolbarItem id='search' image={search} />
        </div>
        <div style={{ ...flex('row', 'center', 'center') }}>
            <ToolbarItem id='options' image={menuIcon_black} style={{ 'marginRight': '32px' }} action={props.menuToggle} />

        </div>

    </div>
}