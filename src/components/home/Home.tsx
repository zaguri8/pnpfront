import SayNoMoreContainer from "../saynomore/SayNoMoreContainer"
import SectionTitle from "../SectionTitle"
import { RideFormPreview } from "../ride/RideFormPreview"
import { Gallery } from "../Gallery"
import WhyUsContainer from "../whyus/WhyUsContainer"
import WhatsApp from "../WhatsApp"
import { useFirebase } from "../../context/Firebase"
import { useEffect, useRef } from "react"
import React from 'react'
import { Realtime } from "../../store/external"
import QRCode from 'react-qr-code'
import { useState } from "react"
import { PNPEvent } from "../../store/external/types"
import { ABOUT, CLUBS, CULTURE, SCHEDULED_EVENTS, TOS, WHY_US_TITLE } from "../../settings/strings"
import { useLanguage } from "../../context/Language"
import About from "../About"
import { InnerPageHolder } from "../utilities/Holders"
import { Link } from "react-router-dom"
import { ORANGE_GRADIENT_PRIMARY } from "../../settings/colors"
export default function Home() {

    const { user, firebase } = useFirebase()
    const [pnpCultureEvents, setPNPCultureEvents] = useState<PNPEvent[]>([])
    const [pnpClubEvents, setPNPClubEvents] = useState<PNPEvent[]>([])
    const realTime = firebase.realTime
    const [data, setdata] = useState<string>()

    const qr = useRef<HTMLDivElement | null>(null)
    useEffect(() => {

        const unsubscribeCulture = realTime.addListenerToCultureEvents(events => {
            setPNPCultureEvents(events)
        })
        const unsubscribeClubs = realTime.addListenerToClubEvents(events => {
            setPNPClubEvents(events)
        })
        return () => {
            unsubscribeCulture()
            unsubscribeClubs()
        }
    }, [])
    const { lang } = useLanguage()

    return <div>
        <RideFormPreview />
        {/*TODO : Custom QR Code  <QRCode value="https://www.nadavsolutions.com/pnp/#/home" />  */}

        <img src={data} />
        <SectionTitle style={{
            padding: '32px',
            fontWeight: '100',
            color: 'white',
            border: '.1px solid gray',
            width:'80%',
            alignSelf: 'center',
            backgroundImage:ORANGE_GRADIENT_PRIMARY,
            fontSize: '38px',
            borderRadius: '8px'
        }} title={'We Say No more !'} />
        <br/>
        <SayNoMoreContainer />
        <SectionTitle style={{ paddingBottom: '0px' }} title={SCHEDULED_EVENTS(lang)} />
        <Gallery header={CULTURE(lang)} events={pnpCultureEvents} />
        <Gallery header={CLUBS(lang)} events={pnpClubEvents} />
        <SectionTitle style={{ padding: '42px', margin: '0px' }} title={WHY_US_TITLE(lang)} />
        <WhyUsContainer />
        <SectionTitle style={{ paddingTop: '42px', margin: '0px' }} title={ABOUT(lang)} />
        <InnerPageHolder style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '16px', width: '50%' }}>


            <About />
        </InnerPageHolder>
        <Link style={{ paddingTop: '32px', paddingBottom: '24px' }} to={'/termsOfService'}>{TOS(lang)}</Link>
        <WhatsApp />
    </div>
}