import { toolbar } from "../styles"
import { ToolbarItem } from "./ToolbarItem"
import { createEvent, login, language, toolbarItem_1 } from "../strings"
import { flex } from "../styles"
import search from '../assets/images/search.png'
import $ from 'jquery'

import { menuIcon_black } from "../assets/images"
import { orangeGradient } from "../colors"
export type ToolbarProps = {
    menuToggle: () => void
}
export function ToolBar(props: ToolbarProps) {

    return <div id='toolbar' style={{ ...toolbar() }}>
        <div style={{ ...flex('row', 'center', 'center'), ...{ zIndex: '9' } }}>
            <ToolbarItem style={{ 'backgroundImage': orangeGradient, color: 'white', padding: '6px', marginLeft: '4px', marginRight: '4px' }} id='create_event' text={createEvent('heb')} action={() => { }} />
            <ToolbarItem id='login' text={login('heb')} action={() => { }} />
            <ToolbarItem id='language' text={language('heb')} action={() => { }} />
            <ToolbarItem id='search' image={search} />
        </div>
        <div style={{ ...flex('row', 'center', 'center') }}>
            <ToolbarItem id='options' image={menuIcon_black} style={{ 'marginRight': '32px' }} action={props.menuToggle} />

        </div>

    </div>
}