import { useEffect } from "react"
import $ from 'jquery'
import './SayNoMoreItem.css'
import { useLanguage } from "../../context/Language"
import { PRIMARY_WHITE } from "../../settings/colors"
import { NO_MORE_ITEM_1, NO_MORE_ITEM_2, NO_MORE_ITEM_3, NO_MORE_ITEM_4, NO_MORE_ITEM_5 } from "../../settings/strings"
import SayNoMoreItem, { SayNoMoreItemProps } from "./SayNoMoreItem"
export default function SayNoMoreContainer() {


  
    const { lang } = useLanguage()
    const sayNoMoreItems: SayNoMoreItemProps[] = [
        { icon: 'no', content: NO_MORE_ITEM_1(lang) },
        { icon: 'no', content: NO_MORE_ITEM_2(lang) },
        { icon: 'no', content: NO_MORE_ITEM_3(lang) },
        { icon: 'no', content: NO_MORE_ITEM_4(lang) },
        { icon: 'no', content: NO_MORE_ITEM_5(lang) }
    ]

    function makeItem(props: SayNoMoreItemProps) {
        return <SayNoMoreItem key={props.content} icon={props.icon} content={props.content} />
    }

    return (
        <div id='say_no_more_container'>

            {sayNoMoreItems.map(makeItem)}

        </div>)
}