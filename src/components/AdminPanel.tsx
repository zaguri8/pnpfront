import { Button, List, ListItem, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useFirebase } from "../context/Firebase";
import { useLanguage } from "../context/Language";
import { SIDE } from "../settings/strings";
import { PNPEvent, PNPPrivateEvent, PNPPrivateRide, PNPPublicRide } from "../store/external/types";
import { InnerPageHolder, PageHolder } from "./utilities/Holders";

import '../settings/mainstyles.css'
import { Unsubscribe } from "firebase/auth";


export default function AdminPanel() {



    useEffect(() => {

        const unsub1 = firebase.realTime.getAllPublicEvents(setPublicEvents)
        const unsub2 = firebase.realTime.getAllPrivateEvents(setPrivateEvents)
        return () => { unsub1(); unsub2(); publicRidesSub && publicRidesSub(); privateRidesSub && privateRidesSub(); }
    }, [])
    const PublicEvents = () => {
        return (publicEvents ? <List className='list_events_admin'>
            {publicEvents.map(event => <Button

                onClick={() => {
                    if (currentViewingPublicRides) return
                    setPublicRidesSub(firebase.realTime.getPublicRidesByEventId(event.eventId, (e) => { setCurrentViewingPublicRides(e) }))
                }}
                sx={{ color: 'white', border: '1px solid black' }}
            >
                {event.eventName}
            </Button>)}
        </List> : null)
    }

    const [privateRidesSub, setPrivateRidesSub] = useState<Unsubscribe | null>()
    const [publicRidesSub, setPublicRidesSub] = useState<Unsubscribe | null>()
    const PrivateEvents = () => {
        return (privateEvents ? <List className='list_events_admin'>
            {privateEvents.map(event => <Button
                onClick={() => {
                    if (currentViewingPrivateRides) return
                    setPrivateRidesSub(firebase.realTime.getPrivateEventRidesById(event.eventId, setCurrentViewingPrivateRides))
                }}
                sx={{ color: 'white', border: '1px solid black' }}
            >
                {event.eventName}
            </Button>)}
        </List> : null)
    }
    const { user, appUser, firebase } = useFirebase()

    const [currentViewingPublicRides, setCurrentViewingPublicRides] = useState<PNPPublicRide[] | undefined>()
    const [currentViewingPrivateRides, setCurrentViewingPrivateRides] = useState<PNPPublicRide[] | undefined>()
    const { lang } = useLanguage()
    const [privateEvents, setPrivateEvents] = useState<PNPEvent[] | undefined>()
    const [publicEvents, setPublicEvents] = useState<PNPEvent[] | undefined>()

    const ActionCard = () => {
        return <Stack spacing={3} dir={SIDE(lang)}>
            <Button style={{ background: 'whitesmoke', color: '#6495ED', textTransform: 'none' }}>Show Public Events</Button>
            <Button style={{ background: 'whitesmoke', color: '#6495ED', textTransform: 'none' }}>Show Private Events</Button>
        </Stack>
    }

    const ContentCard = () => {
        return <div style={
            { padding: '16px', background: 'gray', color: 'white' }
        }><PublicEvents /></div>
    }


    return (<PageHolder>
        <InnerPageHolder>
            <ActionCard />
            <ContentCard />
            {currentViewingPrivateRides ? currentViewingPrivateRides.map(e => <ListItem>
                <List>
                    <ListItem>
                        <span>{"start point " + e.rideStartingPoint}</span>
                        <span>{"destination point " + e.rideDestination}</span>
                        <span> {"hour " + e.rideTime}</span>
                    </ListItem>
                </List>
            </ListItem>)
                : currentViewingPublicRides ? currentViewingPublicRides.map(e => <ListItem>
                    <List>
                        <ListItem>
                            <span>{"start point " + e.rideStartingPoint}</span>
                            <span>{"destination point " + e.rideDestination}</span>
                            <span> {"hour " + e.rideTime}</span>
                        </ListItem>
                    </List>
                </ListItem>) : null}

        </InnerPageHolder>
    </PageHolder>)

}