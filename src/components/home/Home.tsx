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
import { CLUBS, CULTURE, SCHEDULED_EVENTS, WHY_US_TITLE } from "../../settings/strings"
import { useLanguage } from "../../context/Language"
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
            fontStyle: 'italic',
            fontWeight: '100',
            fontSize: '42px',
            borderRadius: '2px'
        }} title={'We Say No more !'} />
        <SayNoMoreContainer />
        <SectionTitle style={{ paddingBottom: '0px' }} title={SCHEDULED_EVENTS(lang)} />
        <Gallery header={CULTURE(lang)} events={pnpCultureEvents} />
        <Gallery header={CLUBS(lang)} events={pnpClubEvents} />
        <SectionTitle style={{ padding: '42px', margin: '0px' }} title={WHY_US_TITLE(lang)} />
        <WhyUsContainer />
        <WhatsApp />
    </div>
}