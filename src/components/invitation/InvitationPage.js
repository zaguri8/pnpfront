import '../../App.css'
import InvitationCard from './InvitationCard.js'
import { useEffect, useLayoutEffect } from 'react'
import $ from 'jquery'
const InvitationPage = (props) => {

    useEffect(() => document.title = props.eventName, [])
    useLayoutEffect(() => {
        $('.dim').css({ 'display': 'none' })
    }, [])
    return <div >
        <div className="App" style={{ background: 'orange' }}>

            <InvitationCard eventName={props.eventName} eventTime={props.eventTime} startPoint={props.startPoint} />
        </div>
    </div>
}
export default InvitationPage