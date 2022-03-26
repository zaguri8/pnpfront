import WhyUsItem, { WhyUsItemProps } from "./WhyUsItem"
import money from '../../assets/images/whyus/money.png'
import headache from '../../assets/images/whyus/headache.png'
import alcohol from '../../assets/images/whyus/alcohol.png'
import handshake from '../../assets/images/whyus/handshake.png'
import spoil from '../../assets/images/whyus/spoil.png'
import time from '../../assets/images/whyus/time.png'
import { PRIMARY_BLACK } from "../../settings/colors"
import {
    WHY_US_ITEM_1_TITLE,
    WHY_US_ITEM_1_CONTENT,
    WHY_US_ITEM_2_TITLE,
    WHY_US_ITEM_2_CONTENT,

    WHY_US_ITEM_3_TITLE,
    WHY_US_ITEM_3_CONTENT,
    WHY_US_ITEM_4_TITLE,
    WHY_US_ITEM_4_CONTENT,

    WHY_US_ITEM_5_TITLE,
    WHY_US_ITEM_5_CONTENT,
    WHY_US_ITEM_6_TITLE,
    WHY_US_ITEM_6_CONTENT
} from '../../settings/strings'
import { v4 } from "uuid"
import { useLanguage } from "../../context/Language"
export default function WhyUsContainer() {

    const { lang } = useLanguage()

    const sayNoMoreItems: WhyUsItemProps[] = [
        { icon: money, title: WHY_US_ITEM_1_TITLE(lang), content: WHY_US_ITEM_1_CONTENT(lang) },
        { icon: headache, title: WHY_US_ITEM_2_TITLE(lang), content: WHY_US_ITEM_2_CONTENT(lang) },
        { icon: time, title: WHY_US_ITEM_3_TITLE(lang), content: WHY_US_ITEM_3_CONTENT(lang) },
        { icon: spoil, title: WHY_US_ITEM_4_TITLE(lang), content: WHY_US_ITEM_4_CONTENT(lang) },
        { icon: alcohol, title: WHY_US_ITEM_5_TITLE(lang), content: WHY_US_ITEM_5_CONTENT(lang) },
        { icon: handshake, title: WHY_US_ITEM_6_TITLE(lang), content: WHY_US_ITEM_6_CONTENT(lang) }
    ]

    function makeItem(props: WhyUsItemProps) {
        return <WhyUsItem key={v4()} icon={props.icon} title={props.title} content={props.content} />
    }

    return (<div dir="rtl" style={{
        color: 'white',
        rowGap: '16px',
        display: 'flex',
        flexDirection: 'column'
    }}>

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'scroll',
            columnGap: '16px',
            background: PRIMARY_BLACK,
            justifyContent: 'center'
        }}>

            {sayNoMoreItems.map(makeItem)}

        </div>
    </div>)
}