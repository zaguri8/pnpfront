import SayNoMoreItem, { SayNoMoreItemProps } from "./SayNoMoreItem"
import alcohol from '../../assets/images/saynomore/alcohol.png'
import cab from '../../assets/images/saynomore/cab.png'
import driver from '../../assets/images/saynomore/driver.png'
import happy from '../../assets/images/saynomore/happy.png'
import parking from '../../assets/images/saynomore/parking.png'
import weekend from '../../assets/images/saynomore/weekend.png'
export default function SayNoMoreContainer() {

    const sayNoMoreItems: SayNoMoreItemProps[] = [
        { icon: happy, content: 'חיפוש חניה מתיש' },
        { icon: weekend, content: 'מחסור בדרכי הגעה בלילות וסופי שבוע' },
        { icon: cab, content: 'מוניות יקרות' },
        { icon: alcohol, content: 'drink & drive' },
        { icon: parking, content: 'חניונים במחירים מטורפים' },
        { icon: driver, content: 'נהג תורן' }
    ]

    function makeItem(props: SayNoMoreItemProps) {
        return <SayNoMoreItem icon={props.icon} content={props.content} />
    }

    return (<div style={{
        background: 'white',
        color:'white',
        rowGap: '16px',
        display: 'flex',
        flexDirection: 'column'
    }}>
        <h1>We say no more!</h1>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            overflow: 'scroll',
            columnGap: '16px',
            justifyContent: 'center'
        }}>

            {sayNoMoreItems.map(makeItem)}

        </div>
    </div>)
}