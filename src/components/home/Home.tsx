import SayNoMoreContainer from "../saynomore/SayNoMoreContainer"
import SectionTitle from "../SectionTitle"
import { RideFormPreview } from "../ride/RideFormPreview"
import { Gallery } from "../gallery/Gallery"
import WhyUsContainer from "../whyus/WhyUsContainer"
import './Home.css'
import { useFirebase } from "../../context/Firebase"
import SimpleImageSlider from "react-simple-image-slider";
import { useEffect, useRef } from "react"
import React from 'react'
import { useState } from "react"

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { PNPEvent } from "../../store/external/types"
import { ABOUT, CLUBS, CULTURE, SCHEDULED_EVENTS, TOS, WHY_US_TITLE } from "../../settings/strings"
import { useLanguage } from "../../context/Language"
import About from "../About"
import { InnerPageHolder } from "../utilities/Holders"
import { Link } from "react-router-dom"
import { BLACK_ROYAL, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_WHITE, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors"
import Spacer from "../utilities/Spacer"
import { getEventType, getEventTypeFromString, getEventTypePriority } from "../../store/external/converters"
import { v4 } from "uuid"
import { dateStringFromDate } from "../utilities/functions"
import { useCookies } from "../../context/CookieContext"
import { PNPPage } from "../../cookies/types"
import ImageSlider from "../imageslider/ImageSlider"
import logo from '../../assets/images/header.jpeg'
import Footer from "../footer/Footer"
import { useHeaderBackgroundExtension, useHeaderContext } from "../../context/HeaderContext"
export default function Home() {
    const { user, firebase } = useFirebase()
    const [pnpEvents, setPnpEvents] = useState<{ [type: string]: PNPEvent[] } | undefined>()
    const { isCacheValid, cacheDone } = useCookies()
    const [selectedEventsForSlider, setSelectedEventsForSlider] = useState<PNPEvent[] | undefined>()

    const {setIsShowingAbout} = useHeaderContext()
    const { setHeaderBackground } = useHeaderBackgroundExtension()
    useEffect(() => {

        setHeaderBackground(`url('${logo}')`)
        setIsShowingAbout(true);
        const unsubEvents = firebase.realTime.addListenerToPublicEvents((events) => {
            const ev = Object.values(events)
            let filtered: PNPEvent[] = []
            for (let events of ev)
                filtered.push(...events.filter(item => item.eventShowsInGallery))

            setSelectedEventsForSlider(filtered)
            setPnpEvents(events)
        }, false)
        let validToCache = isCacheValid(PNPPage.home)
        if (validToCache instanceof Promise) {
            (validToCache as Promise<boolean>).then((valid) => {
                if (valid) {
                    firebase.realTime.addUserStatistic(PNPPage.home)
                    cacheDone(PNPPage.home)
                }
            })
        }

        return () =>  { 
            unsubEvents()
            setHeaderBackground(PRIMARY_BLACK)
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
    function getEventsGallery() {
        if (pnpEvents) {
            let allEvents = Object.entries(pnpEvents)
            allEvents.sort((x, y) => getEventTypePriority(x[0]) - getEventTypePriority(y[0]))
            let output = allEvents.reduce((prev, nextEntry) => prev.concat(...nextEntry[1]), [] as PNPEvent[])
            let outputEvents = output.filter(event => event.eventType !== 'private events' && event.eventType !== 'weddings') 
            let outputPrivateEvents = output.filter(event => event.eventType === 'private events' || event.eventType === 'weddings')
            return <Gallery
                key={v4()}
                events={outputEvents}
                privateEvents={outputPrivateEvents}
                header={lang ==='heb' ?  "אירועים אחרונים" : 'Latest Events'} />
        } else {
            return null;
        }
    }

    return <div style={{ overscrollBehavior: 'auto', maxWidth: '100%', overflow: 'hidden' }}>
        {/* <RideFormPreview /> */}
        {/*{selectedEventsForSlider && <ImageSlider events={selectedEventsForSlider} />}*/}
        <ArrowScrollUp />
        {getEventsGallery()}
        {/* <SectionTitle withBg style={{
            padding: '32px',
            fontWeight: 'bold',
            marginTop: '0px',
            fontStyle: 'italic',
            color: PRIMARY_WHITE,
            width: '80%',
            paddingRight: '45px',
            background: 'none',
            alignSelf: 'center',
            fontSize: '38px'
        }} title={'We Say No More!'} /> */}
      
        <SayNoMoreContainer />
        {/* <SectionTitle style={{ padding: '42px', margin: '0px' }} title={WHY_US_TITLE(lang)} /> */}
        {/*<WhyUsContainer />*/}
        {/*<SectionTitle style={{ paddingTop: '42px', margin: '0px' }} title={ABOUT(lang)} />
        <InnerPageHolder style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '16px',
            width: '50%',
            background: BLACK_ROYAL
        }}>


        <About />
        </InnerPageHolder>*/}
        {/* <Link
            state={{ returnPage: '/' }}
            style={{ paddingTop: '32px', paddingBottom: '24px', textDecoration: 'underline', color: SECONDARY_WHITE }}
            to={'/termsOfService'}>{TOS(lang)}</Link> */}

    </div>
}