import '../../App.css'
import InvitationCard from './InvitationCard'
import { useLayoutEffect } from 'react'
import $ from 'jquery'
import { useParams } from 'react-router'
import { DARK_BLACK } from '../../settings/colors'
const InvitationPage = () => {
    const { id } = useParams()
    useLayoutEffect(() => {
        $('.dim').css({ 'display': 'none' })
    }, [])
    return <div >
        <div className="App" style={{ background: DARK_BLACK }}>
            {!id && <div>Invitation is not valid</div>}
            {id && <InvitationCard />}
        </div>
    </div>
}
export default InvitationPage