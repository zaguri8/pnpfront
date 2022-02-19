import WhyUsItem, { WhyUsItemProps } from "./WhyUsItem"
import money from '../../assets/images/whyus/money.png'
import headache from '../../assets/images/whyus/headache.png'
import alcohol from '../../assets/images/whyus/alcohol.png'
import handshake from '../../assets/images/whyus/handshake.png'
import spoil from '../../assets/images/whyus/spoil.png' 
import time from '../../assets/images/whyus/time.png'
import { PRIMARY_WHITE } from "../../colors"
import { v4 } from "uuid"
export default function WhyUsContainer() {

    const sayNoMoreItems: WhyUsItemProps[] = [
        { icon: money, title: 'חוסכים לך כסף', content: 'השירות שאנו מספקים הוא זול ומתאים לכל כיס.' },
        { icon: headache, title: 'חוסכים לך כאב ראש', content: 'לא עוד חיפוש חנייה, לא דוחות ולא נהג תורן.' },
        { icon: time, title: 'חוסכים לך זמן', content: 'לא תצטרכו להמתין בעשרות נקודות עצירה.' },
        { icon: spoil, title: 'מפנקים אותך', content: 'Pick N Pull מעניקה לך שלל הטבות, מבצעים וקופונים.' },
        { icon: alcohol, title: '!don’t drink and drive', content: 'אנחנו מאמינים שצריך להנות מבלי לקחת סיכונים מיותרים, החיים יקרים!' },
        { icon: handshake, title: 'מערכת יחסים ארוכה', content: 'בכל נסיעה תצברו נקודה, ולאחר 5 נקודות תוכלו לממש אותן ולקבל נסיעה חינם!' }
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
            background:PRIMARY_WHITE,
            justifyContent: 'center'
        }}>

            {sayNoMoreItems.map(makeItem)}

        </div>
    </div>)
}