import './SayNoMoreItem.css'
import $ from 'jquery'
import { useLanguage } from "../../context/Language"
import { NO_MORE_ITEM_1, NO_MORE_ITEM_2, NO_MORE_ITEM_3, NO_MORE_ITEM_4, NO_MORE_ITEM_5 } from "../../settings/strings"
import { SayNoMoreItemProps } from "./SayNoMoreItem"
import { useEffect, useState } from 'react'
let t_done = false
export default function SayNoMoreContainer() {

    const { lang } = useLanguage()
    const sayNoMoreItems: SayNoMoreItemProps[] = [
        { icon: 'no', content: NO_MORE_ITEM_1(lang) },
        { icon: 'no', content: NO_MORE_ITEM_2(lang) },
        { icon: 'no', content: NO_MORE_ITEM_3(lang) },
        { icon: 'no', content: NO_MORE_ITEM_4(lang) },
        { icon: 'no', content: NO_MORE_ITEM_5(lang) }
    ]
    const [pos, setPos] = useState(sayNoMoreItems.length - 1);
    let pPos = 0;
    useEffect(() => {
        let exTimer = setInterval(() => {
            if (t_done) return
            $('#exchanging_text_wsnm').css('opacity', '0')
            setTimeout(() => {
                if (t_done) return
                setPos((pPos++) % sayNoMoreItems.length);
                $('#exchanging_text_wsnm').css('opacity', '1')
            }, 500)
        }, 4000)
        return () => {
            clearInterval(exTimer);
            t_done = true;
        }
    }, [])
    return (
        <div id='say_no_more_container'>
            <p>We say no more!</p>
            <span id="exchanging_text_wsnm">
                {sayNoMoreItems[pos].content}
            </span>
        </div>)
}