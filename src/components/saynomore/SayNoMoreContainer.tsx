import SayNoMoreItem, { SayNoMoreItemProps } from "./SayNoMoreItem"
export default function SayNoMoreContainer() {

    const sayNoMoreItems: SayNoMoreItemProps[] = [
        { icon: 'no', content: 'חיפוש חניה מתיש' },
        { icon: 'no', content: 'מחסור בדרכי הגעה בלילות וסופי שבוע' },
        { icon: 'no', content: 'מוניות יקרות' },
        { icon: 'no', content: 'drink & drive' },
        { icon: 'no', content: 'חניונים במחירים מטורפים' },
        { icon: 'no', content: 'נהג תורן' }
    ]

    function makeItem(props: SayNoMoreItemProps) {
        return <SayNoMoreItem key={props.content} icon={props.icon} content={props.content} />
    }

    return (<div style={{
        background: 'white',
        display: 'flex',
        flexDirection: 'column'
    }}>
       
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            overflow: 'scroll',
            justifyContent: 'center'
        }}>

            {sayNoMoreItems.map(makeItem)}

        </div>
    </div>)
}