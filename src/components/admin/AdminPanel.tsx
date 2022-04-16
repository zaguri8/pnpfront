import { Button } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { v4 } from "uuid"
import { useFirebase } from "../../context/Firebase"
import { useLoading } from "../../context/Loading"
import { PNPPage } from "../../cookies/types"
import { DARKER_BLACK_SELECTED, SECONDARY_WHITE } from "../../settings/colors"
import { getEventTypeFromString } from "../../store/external/converters"
import { PNPEvent } from "../../store/external/types"
import SectionTitle from "../SectionTitle"
import { InnerPageHolder, PageHolder } from "../utilities/Holders"

export default function AdminPanel() {
    const [publicEvents, setPublicEvents] = useState<{ [type: string]: { waiting: PNPEvent[], events: PNPEvent[] } }>()
    const [waitingEvents, setWaitingEvents] = useState<PNPEvent[]>()
    const { firebase } = useFirebase()
    const nav = useNavigate()
    const { doLoad, cancelLoad } = useLoading()
    useEffect(() => {
        doLoad()
        const unsub = firebase.realTime.addListenerToPublicEvents((publicEv) => {

            const newHash: { [type: string]: { waiting: PNPEvent[], events: PNPEvent[] } } = {}

            Object.entries(publicEv).forEach(entry => {
                if (entry[0] === 'waiting') {
                    entry[1].forEach(waitingEvent => {
                        if (!newHash[waitingEvent.eventType!]) {
                            newHash[waitingEvent.eventType!] = { waiting: [waitingEvent], events: [] }
                        } else {
                            newHash[waitingEvent.eventType!].waiting.push(waitingEvent)
                        }
                    })
                } else {
                    if (!newHash[entry[0]]) {
                        newHash[entry[0]] = { waiting: [], events: entry[1] }
                    } else {
                        newHash[entry[0]].events.push(...entry[1])
                    }
                }
            })
            setPublicEvents(newHash)
            cancelLoad()
        }, true)

        return () => unsub()
    }, [])

    return <PageHolder>
        <SectionTitle title={'פאנל ניהול'} style={{ background: 'none' }} />
        <InnerPageHolder >


            <table dir={'rtl'} >

                <thead>
                    <tr>
                        <th>
                            <div style={{ color: SECONDARY_WHITE }}>{`קטגורייה`}</div>
                        </th>
                        <th>
                            <div style={{ color: SECONDARY_WHITE }}>{'פעולות'}</div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {publicEvents && Object.entries(publicEvents).map(entry => <tr key={v4()} style={{ margin: '8px' }}>
                        <th style={{ width: '50%' }}>  <div style={{ fontSize: '12px', margin: '4px', color: SECONDARY_WHITE }}>{getEventTypeFromString(entry[0])}</div></th>
                        <th style={{ width: '50%' }}><Button
                            style={{ backgroundImage: DARKER_BLACK_SELECTED, minWidth: '110px' }}
                            onClick={() => { nav('/adminpanel/specificevent', { state: { waitingEvents: entry[1].waiting, events: entry[1].events } }) }}
                            sx={{ ... { width: 'fit-content', fontSize: '14px', margin: '4px', padding: '4px', color: 'white', background: '#007AFF' } }}>
                            {'ניהול אירועים'}
                        </Button></th>
                    </tr>)}
                </tbody>
            </table>

        </InnerPageHolder>
        <SectionTitle title={'ניהול משתמשים'} style={{ background: 'none' }} />
        <InnerPageHolder>
            <Button
                style={{ backgroundImage: DARKER_BLACK_SELECTED, minWidth: '110px' }}
                onClick={() => { nav('/adminpanel/users') }}
                sx={{ ... { width: 'fit-content', fontSize: '14px', margin: '4px', padding: '12px', color: 'white', background: '#007AFF' } }}>
                {'עבור לניהול משתמשים'}
            </Button>
        </InnerPageHolder>

        <SectionTitle title={'נתוני כניסה'} style={{ background: 'none' }} />
        <InnerPageHolder>
            <Button
                style={{ background: '#bd3333', minWidth: '110px' }}
                onClick={() => { nav('/adminpanel/pagestats', { state: { page: PNPPage.register } }) }}
                sx={{ ... { width: 'fit-content', fontSize: '14px', margin: '4px', padding: '12px', color: 'white', background: '#007AFF' } }}>
                {'דף הרשמה'}
            </Button>
        </InnerPageHolder>
    </PageHolder>

}