import { toolbar } from "../styles"
import { ToolbarItem } from "./ToolbarItem"
import { createEvent, login, language, toolbarItem_1 } from "../strings"
import { flex } from "../styles"
import $ from 'jquery'
import logo from '../assets/images/logo_white.png'
import { useEffect } from "react"
import { menuIcon } from "../assets/images"
export type ToolbarProps = {
    menuToggle: () => void
}
export function ToolBar(props: ToolbarProps) {

    return <div id='toolbar' style={{ ...toolbar() }}>
        <div style={{ ...flex('row', 'center', 'center'), ...{ zIndex: '9' } }}>
            <ToolbarItem id='options_2' style={{ display: 'none' }} image={menuIcon} action={() => { }} />
            <ToolbarItem id='create_event' text={createEvent('heb')} action={() => { }} />
            <ToolbarItem id='login' text={login('heb')} action={() => { }} />
            <ToolbarItem id='language' text={language('heb')} action={() => { }} />
        </div>
        <div style={{ ...flex('row', 'center', 'center') }}>
            <ToolbarItem id='options' image={menuIcon} style={{ 'marginRight': '32px' }} action={props.menuToggle} />
            <ToolbarItem id='logo' image={logo} />
        </div>

    </div>
}