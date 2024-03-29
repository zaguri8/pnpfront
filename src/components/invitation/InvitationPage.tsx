import '../../App.css'
import InvitationCard from './InvitationCard'
import { useEffect, useLayoutEffect } from 'react'
import $ from 'jquery'
import { useParams } from 'react-router'
import { withHook } from '../generics/withHooks'
import { Hooks } from '../generics/types'

const InvitationPage = (props: Hooks) => {
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
            {id && <InvitationCard />}
        </div>
    </div>
}
export default withHook(InvitationPage, 'headerExt')