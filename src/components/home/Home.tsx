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
import { PRIMARY_WHITE, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors"
import Spacer from "../utilities/Spacer"
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
        <SectionTitle style={{ paddingBottom: '0px' }} title={SCHEDULED_EVENTS(lang)} />
        <Gallery header={CULTURE(lang)} events={pnpCultureEvents} />
        <Gallery header={CLUBS(lang)} events={pnpClubEvents} />
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
            background: SECONDARY_BLACK,
            alignSelf: 'center',
            fontSize: '38px'
        }} title={'We Say No More!'} />
        <br />
        <SayNoMoreContainer />

        <SectionTitle style={{ padding: '42px', margin: '0px' }} title={WHY_US_TITLE(lang)} />
        <WhyUsContainer />
        <SectionTitle style={{ paddingTop: '42px', margin: '0px' }} title={ABOUT(lang)} />
        <InnerPageHolder style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '16px', width: '50%' }}>


            <About />
        </InnerPageHolder>
        <Link style={{ paddingTop: '32px', paddingBottom: '24px', textDecoration: 'underline', color: SECONDARY_WHITE }} to={'/termsOfService'}>{TOS(lang)}</Link>

    </div>
}