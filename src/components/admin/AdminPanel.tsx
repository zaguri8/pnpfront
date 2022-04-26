import { Button } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { v4 } from "uuid"
import { useFirebase } from "../../context/Firebase"
import { useLoading } from "../../context/Loading"
import { PNPPage } from "../../cookies/types"
import { BLACK_ELEGANT, BLACK_ROYAL, DARKER_BLACK_SELECTED, RED_ROYAL, SECONDARY_WHITE } from "../../settings/colors"
import { getEventTypeFromString } from "../../store/external/converters"
import { PNPEvent } from "../../store/external/types"
import SectionTitle from "../SectionTitle"
import { InnerPageHolder, PageHolder } from "../utilities/Holders"
import PNPChart from "./PNPChart"


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

    return <PageHolder style={{ background: BLACK_ELEGANT,overflowX:'hidden'  }} >
        <SectionTitle title={'פאנל ניהול'} style={{ background: 'none' }} />
        <InnerPageHolder style={{ background: BLACK_ROYAL,overflowX:'hidden'  }} >


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
        <InnerPageHolder style={{ background: BLACK_ROYAL }}>
            <Button
                style={{ backgroundImage: RED_ROYAL , minWidth: '110px' }}
                onClick={() => { nav('/adminpanel/users') }}
                sx={{ ... { width: 'fit-content', fontSize: '14px', maxHeight: '40px', margin: '4px', padding: '12px', color: 'white', background: '#007AFF' } }}>
                {'עבור לניהול משתמשים'}
            </Button>
        </InnerPageHolder>

        <SectionTitle title={'נתוני כניסה'} style={{ background: 'none' }} />
        <InnerPageHolder style={{ background: BLACK_ROYAL,overflowX:'hidden'  }}>
            <label style={
                {
                    color: SECONDARY_WHITE
                }
            }>{'דף הרשמה'}</label>

            <PNPChart page={PNPPage.register} />
        </InnerPageHolder>
    </PageHolder>

}