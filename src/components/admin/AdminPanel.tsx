import { useEffect, useState } from "react"
import { useFirebase } from "../../context/Firebase"
import { useLoading } from "../../context/Loading"
import { PNPEvent } from "../../store/external/types"
import { Button } from '@mui/material'
import { SECONDARY_WHITE, DARKER_BLACK_SELECTED } from "../../settings/colors"
import { useNavigate } from "react-router"
import { v4 } from 'uuid'
import SectionTitle from '../SectionTitle'
import { PageHolder, InnerPageHolder } from '../utilities/Holders'
const AdminPanel = () => {

    const [publicEvents, setPublicEvents] = useState<PNPEvent[]>()
    const [waitingEvents, setWaitingEvents] = useState<PNPEvent[]>()
    const { firebase } = useFirebase()
    const nav = useNavigate()
    const { doLoad, cancelLoad } = useLoading()
    useEffect(() => {
        doLoad()
        const unsub = firebase.realTime.addListenerToPublicAndWaitingEvents((publicEv) => {
            setPublicEvents(publicEv)
            cancelLoad()
        }, (waitingEv) => {
            setWaitingEvents(waitingEv)
            cancelLoad()
        })

        return () => unsub()
    }, [])

    return <PageHolder>
        <SectionTitle title={'ניהול אירועים'} style={{ background: 'none' }} />
        <InnerPageHolder>

            <table dir={'rtl'}>

                <thead>
                    <tr>
                        <th>
                            <div style={{ color: SECONDARY_WHITE }}>{`שם האירוע`}</div>
                        </th>
                        <th>
                            <div style={{ color: SECONDARY_WHITE }}>{'פעולות'}</div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {publicEvents && publicEvents.map(event => <tr key={v4()} style={{ margin: '8px' }}>
                        <th style={{ width: '50%' }}>  <div style={{ fontSize: '12px', margin: '4px', color: SECONDARY_WHITE }}>{event.eventName}</div></th>
                        <th style={{ width: '50%' }}><Button
                            style={{ backgroundImage: DARKER_BLACK_SELECTED }}
                            onClick={() => { nav('/adminpanel/eventstatistics', { state: event }) }}
                            sx={{ ... { width: 'fit-content', fontSize: '14px', margin: '4px', padding: '4px', color: 'white', background: '#007AFF' } }}>
                            {'עבור לניהול אירוע'}
                        </Button></th>
                    </tr>)}
                </tbody>
            </table>
        </InnerPageHolder>

        <SectionTitle title={'אירועים ממתינים'} style={{ background: 'none' }} />
        <InnerPageHolder>

            {waitingEvents && waitingEvents.length > 0 ? <table dir={'rtl'}>

                <thead>
                    <tr>
                        <th>
                            <div style={{ color: SECONDARY_WHITE }}>{`שם האירוע`}</div>
                        </th>
                        <th>
                            <div style={{ color: SECONDARY_WHITE }}>{'פעולות'}</div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {waitingEvents && waitingEvents.map(event => <tr key={v4()} style={{ margin: '8px' }}>
                        <th style={{ width: '50%' }}>  <div style={{ fontSize: '12px', margin: '4px', color: SECONDARY_WHITE }}>{event.eventName}</div></th>
                        <th style={{ width: '50%' }}><Button
                            style={{ background: '#228B22' }}
                            onClick={() => {
                                doLoad()
                                firebase.realTime.approveEvent(event.eventId)
                                    .then(() => {
                                        alert('אירוע אושר בהצלחה')
                                        cancelLoad()
                                    }).catch(() => {
                                        alert('קרתה שגיאה בעת אישור האירוע, אנא פנא אל מתכנת האתר')
                                        cancelLoad()
                                    })
                            }}
                            sx={{ ... { width: 'fit-content', fontSize: '14px', margin: '4px', padding: '4px', color: 'white', background: '#007AFF' } }}>
                            {'אשר אירוע'}
                        </Button></th>
                    </tr>)}
                </tbody>
            </table> : <span style={{ color: SECONDARY_WHITE }}>{'אין אירועים ממתינים'}</span>}
        </InnerPageHolder>
    </PageHolder>
}
export default AdminPanel