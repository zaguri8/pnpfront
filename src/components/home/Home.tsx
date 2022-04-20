import SayNoMoreContainer from "../saynomore/SayNoMoreContainer"
import SectionTitle from "../SectionTitle"
import { RideFormPreview } from "../ride/RideFormPreview"
import { Gallery } from "../gallery/Gallery"
import WhyUsContainer from "../whyus/WhyUsContainer"
import { useFirebase } from "../../context/Firebase"
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
import { ORANGE_GRADIENT_PRIMARY, PRIMARY_WHITE, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors"
import Spacer from "../utilities/Spacer"
import { getEventType, getEventTypeFromString } from "../../store/external/converters"
import { v4 } from "uuid"
export default function Home() {
    const { user, firebase } = useFirebase()
    const [pnpEvents, setPnpEvents] = useState<{ [type: string]: PNPEvent[] } | undefined>()

    useEffect(() => {
        const unsubEvents = firebase.realTime.addListenerToPublicEvents(setPnpEvents, false)
        return () => unsubEvents()
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
            style={{ border: '1px solid whitesmoke',borderRadius:'12px', cursor: 'pointer', zIndex: '10000', display: 'none', position: 'fixed', right: '8px', bottom: '50%' }}>
            <KeyboardArrowUpIcon style={{ width: '32px', height: '32px', color: 'whitesmoke' }} />
        </div>
    }
    const { lang } = useLanguage()

    return <div style={{ overscrollBehavior: 'auto', maxWidth: '100%', overflow: 'hidden' }}>
        <RideFormPreview />
        <ArrowScrollUp />
        {pnpEvents && Object.entries(pnpEvents).map((k) => <Gallery
            key={v4()}
            events={k[1]}
            header={lang === 'heb' ? getEventTypeFromString(k[0]) : k[0].slice(0, 1).toUpperCase() + k[0].substring(1)} />)}
        <Spacer offset={4} />
        <SectionTitle withBg style={{
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
        }} title={'We Say No More!'} />
        <br />
        <SayNoMoreContainer />

        <SectionTitle style={{ padding: '42px', margin: '0px' }} title={WHY_US_TITLE(lang)} />
        <WhyUsContainer />
        <SectionTitle style={{ paddingTop: '42px', margin: '0px' }} title={ABOUT(lang)} />
        <InnerPageHolder style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '16px', width: '50%', background: 'linear-gradient(15deg,#c31432,#240b36)' }}>


            <About />
        </InnerPageHolder>
        <Link style={{ paddingTop: '32px', paddingBottom: '24px', textDecoration: 'underline', color: SECONDARY_WHITE }} to={'/termsOfService'}>{TOS(lang)}</Link>

    </div>
}