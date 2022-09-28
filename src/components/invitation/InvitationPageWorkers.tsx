import '../../App.css'
import { useEffect, useLayoutEffect } from 'react'
import $ from 'jquery'
import { useParams } from 'react-router'
import { withHook } from '../generics/withHooks'
import { Hooks } from '../generics/types'
import InvitationCardWorkers from './InvitationCardWorkers'
const InvitationPageWorkers = (props: Hooks) => {
    const { id } = useParams()
    useLayoutEffect(() => {
        $('.dim').css({ 'display': 'none' })
    }, [])
    useEffect(() => {
        props.headerExt.hideHeader()
        return () => props.headerExt.showHeader()
    }, [])
    return <div >
        <div className="App" style={{ background: 'none' }}>
            {!id && <div>Invitation is not valid</div>}
            {id && <InvitationCardWorkers />}
        </div>
    </div>
}
export default withHook(InvitationPageWorkers, 'headerExt')