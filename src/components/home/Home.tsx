import SayNoMoreContainer from "../saynomore/SayNoMoreContainer"
import SectionTitle from "../SectionTitle"
import { RideFormPreview } from "../ride/RideFormPreview"
import { Gallery } from "../Gallery"
import WhyUsContainer from "../whyus/WhyUsContainer"
import { useFirebase } from "../../context/Firebase"
import { useEffect, useRef } from "react"
import React from 'react'
import { useState } from "react"
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
    const { lang } = useLanguage()

    return <div style={{ overscrollBehavior: 'auto', maxWidth: '100%', overflow: 'hidden' }}>
        <RideFormPreview />
        {/*TODO : Custom QR Code  <QRCode value="https://www.nadavsolutions.com/pnp/#/home" />  */}


        <SectionTitle style={{ paddingBottom: '0px' }} title={SCHEDULED_EVENTS(lang)} />
        {pnpEvents && Object.entries(pnpEvents).map((k) => <Gallery
            key={v4()}
            events={k[1]}
            header={lang === 'heb' ? getEventTypeFromString(k[0]) : k[0].slice(0, 1).toUpperCase() + k[0].substring(1)} />)}
        <Spacer offset={4} />
        <SectionTitle withBg style={{
            padding: '32px',
            fontWeight: '100',
            marginTop: '0px',
            fontStyle: 'italic',
            border: '.1px solid gray',
            color: PRIMARY_WHITE,
            width: '80%',
            borderRadius: '16px',
            paddingRight: '45px',
            background: ORANGE_GRADIENT_PRIMARY,
            alignSelf: 'center',
            fontSize: '38px'
        }} title={'We Say No More!'} />
        <br />
        <SayNoMoreContainer />

        <SectionTitle style={{ padding: '42px', margin: '0px' }} title={WHY_US_TITLE(lang)} />
        <WhyUsContainer />
        <SectionTitle style={{ paddingTop: '42px', margin: '0px' }} title={ABOUT(lang)} />
        <InnerPageHolder style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '16px', width: '50%', background: ORANGE_GRADIENT_PRIMARY }}>


            <About />
        </InnerPageHolder>
        <Link style={{ paddingTop: '32px', paddingBottom: '24px', textDecoration: 'underline', color: SECONDARY_WHITE }} to={'/termsOfService'}>{TOS(lang)}</Link>

    </div>
}