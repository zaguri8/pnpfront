import SayNoMoreContainer from "../saynomore/SayNoMoreContainer"
import Gallery from "../gallery/Gallery"
import './Home.css'
import { useUser } from "../../context/Firebase"
import { useEffect } from "react"
import React from 'react'
import { useState } from "react"

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { PNPEvent } from "../../store/external/types"
import { useLanguage } from "../../context/Language"
import { PRIMARY_BLACK} from "../../settings/colors"
import { getEventTypePriority } from "../../store/external/converters"
import { v4 } from "uuid"
import { useCookies } from "../../context/CookieContext"
import { PNPPage } from "../../cookies/types"
import logo from '../../assets/images/header.jpeg'
import { useHeaderBackgroundExtension, useHeaderContext } from "../../context/HeaderContext"
import { Hooks } from "../generics/types"
import { withHookGroup } from "../generics/withHooks"
import { StoreSingleton } from "../../store/external"
export function Home(props:Hooks) {
    const [pnpEvents, setPnpEvents] = useState<{ [type: string]: PNPEvent[] } | undefined>()
    const { isCacheValid, cacheDone } = useCookies()
    const { setIsShowingAbout } = useHeaderContext()
    useEffect(() => {
        props.headerExt.setHeaderBackground(`url('${logo}')`)
        setIsShowingAbout(true);
        const unsubEvents = StoreSingleton.get().realTime.addListenerToPublicEvents((events) => {
            const ev = Object.values(events)
            let filtered: PNPEvent[] = []
            for (let events of ev)
                filtered.push(...events.filter(item => item.eventShowsInGallery))
            setPnpEvents(events)
        }, false)
        let validToCache = isCacheValid(PNPPage.home)
        if (validToCache instanceof Promise) {
            (validToCache as Promise<boolean>).then((valid) => {
                if (valid) {
                    StoreSingleton.get().realTime.addUserStatistic(PNPPage.home)
                    cacheDone(PNPPage.home)
                }
            })
        }

        return () => {
            unsubEvents()
            props.headerExt.setHeaderBackground(PRIMARY_BLACK)
            setIsShowingAbout(false)
        }
    }, [])


    function ArrowScrollUp() {

        return <div
            id='arrow_scroll_up'
            onClick={(e) => {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth"
                })
            }}
            style={{ border: '1px solid whitesmoke', borderRadius: '12px', cursor: 'pointer', zIndex: '10000', display: 'none', position: 'fixed', right: '8px', bottom: '50%' }}>
            <KeyboardArrowUpIcon style={{ width: '32px', height: '32px', color: 'whitesmoke' }} />
        </div>
    }
    const { lang } = useLanguage()


    const getEvents = React.useMemo(() => {
        let events: { outputEvents: PNPEvent[], outputPrivateEvents: PNPEvent[] } = { outputEvents: [], outputPrivateEvents: [] }
        if (pnpEvents) {
            let allEvents = Object.entries(pnpEvents)
            allEvents.sort((x, y) => getEventTypePriority(x[0]) - getEventTypePriority(y[0]))
            let output = allEvents.reduce((prev, nextEntry) => prev.concat(...nextEntry[1]), [] as PNPEvent[])
            let outputEvents = output.filter(event => event.eventType !== 'private events' && event.eventType !== 'weddings')
            let outputPrivateEvents = output.filter(event => event.eventType === 'private events' || event.eventType === 'weddings')
            outputEvents.forEach((e, i) => (outputEvents[i] as any).imageId = outputEvents[i].eventId.replaceAll(' ', '').replaceAll('-', '').replaceAll('_', ''))
            outputPrivateEvents.forEach((e, i) => (outputPrivateEvents[i] as any).imageId = outputPrivateEvents[i].eventId.replaceAll(' ', '').replaceAll('-', '').replaceAll('_', ''))
            events = { outputEvents, outputPrivateEvents }
        }
        return events
    }, [pnpEvents])

    const EventGallery = () => {
        let ev = getEvents
        if (!ev) return null
        return <Gallery
            key={v4()}
            events={(ev as any).outputEvents}
            privateEvents={(ev as any).outputPrivateEvents}
            header={lang === 'heb' ? "אירועים אחרונים" : 'Latest Events'} />
    }

    return <div style={{ overscrollBehavior: 'auto', maxWidth: '100%', overflow: 'hidden' }}>
        <ArrowScrollUp />
        {pnpEvents && <EventGallery />}
        <SayNoMoreContainer />
    </div>
}
export default withHookGroup(Home,['headerExt','user'])