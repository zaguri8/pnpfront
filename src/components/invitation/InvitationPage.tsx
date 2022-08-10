import '../../App.css'
import InvitationCard from './InvitationCard'
import { useEffect, useLayoutEffect } from 'react'
import $ from 'jquery'
import { useParams } from 'react-router'
import { DARK_BLACK, RED_ROYAL, SECONDARY_WHITE } from '../../settings/colors'
import { useHeaderBackgroundExtension } from '../../context/HeaderContext'
const InvitationPage = () => {
    const { id } = useParams()
    useLayoutEffect(() => {
        $('.dim').css({ 'display': 'none' })
    }, [])
    const {hideHeader,showHeader} = useHeaderBackgroundExtension()
    useEffect(() => {
        hideHeader()
        return () => showHeader()
    },[])
    return <div >
        <div className="App" style={{ background: 'none' }}>
            {!id && <div>Invitation is not valid</div>}
            {id && <InvitationCard />}
        </div>
    </div>
}
export default InvitationPage