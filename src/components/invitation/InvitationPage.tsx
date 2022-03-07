import '../../App.css'
import InvitationCard from './InvitationCard'
import { useEffect, useLayoutEffect } from 'react'
import $ from 'jquery'
import { useParams } from 'react-router'
const InvitationPage = () => {
    const { id } = useParams()
    useLayoutEffect(() => {
        $('.dim').css({ 'display': 'none' })
    }, [])
    return <div >
        <div className="App" style={{ background: 'orange' }}>
            {!id && <div>Invitation is not valid</div>}
            {id && <InvitationCard />}
        </div>
    </div>
}
export default InvitationPage