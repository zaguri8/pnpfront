import logo_white from '../../assets/images/logo_white.png'
import '../../App.css'
import InvitationCard from './InvitationCard.js'
import { useEffect } from 'react'
const InvitationPage = (props) => {

    useEffect(() => document.title = props.eventName, [])

    return <div >
        <div className="App" style={{ background: 'orange' }}>
            <div className='App-header' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                <img alt='לא נמצאה התמונה המתאימה' src={logo_white} style={{ height: '100px', padding: '8px' }} />
            </div>

            <InvitationCard eventName={props.eventName} eventTime={props.eventTime} startPoint={props.startPoint} />
        </div>
    </div>
}
export default InvitationPage