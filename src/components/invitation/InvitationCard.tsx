import 'firebaseui/dist/firebaseui.css'
import { FormEvent, useEffect, useState } from 'react';
import Auth from '../auth/Auth';
import 'firebase/compat/auth';

import $ from 'jquery'
import { FormControlLabel, ImageListItem, List, ListItemText, Radio, Button, RadioGroup, MenuItem, ListItem } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

import { useFirebase } from '../../context/Firebase';
import { PNPPrivateEvent, PNPEvent, PNPRideConfirmation } from '../../store/external/types';
import { isValidPrivateEvent, isValidPublicRide, isValidRideConfirmation } from '../../store/validators';

import { PNPPublicRide } from '../../store/external/types';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useLoading } from '../../context/Loading';
import { BETA } from '../../settings/config';
import { ORANGE_GRADIENT_PRIMARY } from '../../settings/colors';
import { InnerPageHolder } from '../utilities/Holders';
import { ADDRESS, CHOOSE_RIDE, CONFIRM_RIDE, CURRENCY, DEST, DESTINATION_POINT, PICK_POINT, PULL_POINT, SIDE, STARTING_POINT_SINGLE } from '../../settings/strings';
import { useLanguage } from '../../context/Language';
import { HtmlTooltip } from '../utilities/HtmlTooltip';
import { submitButton } from '../../settings/styles';
import { v4 } from 'uuid';
import { Unsubscribe } from 'firebase/database';
function InvitationCard() {
    const [confirmation, setConfirmation] = useState<PNPRideConfirmation | null>(null)
    const { doLoad, cancelLoad } = useLoading()
    const [event, setEvent] = useState<PNPPrivateEvent | null>(null)
    const [rides, setRides] = useState<PNPPublicRide[] | null>(null)
    const { isAuthenticated, firebase, appUser } = useFirebase()
    const [exists, setExists] = useState(true)


    const { user } = useFirebase()
    const { lang } = useLanguage()
    const { id } = useParams()
    const [selectedEventRide, setSelectedEventRide] = useState<PNPPublicRide | null>(null)

    const handleSelectEventRide = (eventRide: PNPPublicRide) => {
        setSelectedEventRide(eventRide)
    }
    useEffect(() => {
        $('.dim').css('display', 'none')
        if (BETA) return
        doLoad()
        var secondUnsub: Unsubscribe | null | object = null
        const unsubscribe = firebase.realTime.getPrivateEventById(id!, (event) => {
            if (isValidPrivateEvent(event as PNPPrivateEvent)) {
                setEvent(event as PNPPrivateEvent)
                if (user) {
                    secondUnsub = firebase.realTime.getRideConfirmationByEventId(id!, user.uid, (confirmation) => {
                        if (confirmation as PNPRideConfirmation && isValidRideConfirmation(confirmation as PNPRideConfirmation)) {
                            setConfirmation(confirmation as PNPRideConfirmation)
                            cancelLoad()
                        } else {
                            firebase.realTime.getPrivateEventRidesById(id!, (rides) => {
                                if (rides as PNPPublicRide[]) {
                                    setRides(rides as PNPPublicRide[])
                                }
                                cancelLoad()
                            })
                        }
                    })
                } else {
                    firebase.realTime.getPrivateEventRidesById(id!, (rides) => {
                        if (rides as PNPPublicRide[]) {
                            setRides(rides as PNPPublicRide[])
                        }
                        cancelLoad()
                    })
                }
            } else {
                cancelLoad()
                setEvent(null)
                setExists(false)
            }
        })

        return () => {
            unsubscribe()
            secondUnsub && (secondUnsub as Unsubscribe) && (secondUnsub as Unsubscribe)()
        }
    }, [])

    function validateForm(direction: string, phone: string) {
        if (direction.length < 1) {
            doLoad()
            alert('יש לבחור כיוון נסיעה')
            return false
        }

        if (phone.length < 10) {
            alert('יש להכניס מספר נייד תקין')
            cancelLoad()
            return false
        }
        return true
    }
    const nav = useNavigate()
    const location = useLocation()
    async function sendInvitation() {
        if (!event || !rides || !selectedEventRide)
            return

        if (appUser === null) {
            nav('/login', { state: { cachedLocation: location.pathname } })
            return
        }
        doLoad()
        if (isValidPublicRide(selectedEventRide!)) {
            const confirmation: PNPRideConfirmation = {
                userId: firebase.auth.currentUser?.uid ?? '',
                rideId: selectedEventRide.rideId,
                confirmationTitle: event.eventTitle,
                eventId: id!!,
                directions: selectedEventRide.rideStartingPoint + " to " + selectedEventRide.rideDestination,
                date: event!.eventDate,
                passengers: '1',
            }
            await firebase.realTime.addRideConfirmation(confirmation)
                .then(() => {
                    alert(`תודה ${appUser?.name}, קיבלנו את אישורך `)
                    setConfirmation(confirmation)
                    cancelLoad()
                })
        }
    }

    function render() {
        if (BETA) return <EventInvitation />
        const isEventConfirmationValid = confirmation != null
        const eventDoesNotExist = !exists
        const eventIsValid = event != null
        if (isEventConfirmationValid) {
            return <InnerPageHolder style={{ marginLeft: 'auto', marginRight: 'auto' }}

            >
                <EventImage e={event} />
                <div style={{ background: 'white', padding: '16px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>


                    <div style={{ fontSize: '22px', margin: '8px' }}>{`תודה ${appUser?.name}, קיבלנו את אישורך להסעה `}</div>
                    <br />
                    <span style={{ padding: '16px', fontSize: '16px', fontWeight: 'bold' }}>{lang === 'heb' ? confirmation.directions.replace(' to ', ' ל ') : confirmation.directions}</span>  </div ></InnerPageHolder>

        } else if (eventDoesNotExist) {
            return <div style={{ padding: '32px' }}>Event Does not exist</div>
        } else if (eventIsValid) {
            return <EventInvitation />
        } else return null
    }

    const EventImage = (props: { e: PNPPrivateEvent | null }) => {
        return <img alt='No image for this event'
            style={{ width: '100%', height: '50%' }}
            src={props.e!.eventImageURL} />
    }

    const EventInvitation = () => {
        const validEvent = BETA ? null : event!
        return <List style={{ marginTop: '0px' }}>
            <EventImage e={validEvent} />
            <div style={{ width: '100%', background: 'whitesmoke', marginTop: '-8px' }}>
                <List style={{ width: '85%', background: 'whitesmoke', minWidth: 'fit-content', marginLeft: 'auto', marginRight: 'auto', padding: '16px' }}>
                    {rides && rides!.length > 0 && <span style={{ fontFamily: 'Open Sans Hebrew' }}>
                        {lang === 'heb' ? ('כל ההסעות יוצאות מ ' + rides![0].rideStartingPoint + " בשעה " + rides![0].rideTime) : 'All the rides leave from ' + rides![0].rideStartingPoint + ' at ' + rides![0].rideStartingPoint}
                    </span>}
                    <br />
                    <span style={{ fontFamily: 'Open Sans Hebrew', margin: '32px' }}>
                        {CHOOSE_RIDE(lang)}
                    </span>
                    {rides ? <List style={{ width: '100%' }}>

                        <div style={{ width: '100%', display: 'flex', background: 'black', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                            <span style={{ padding: '8px', marginRight: '32px', fontSize: '14px', color: 'white', textAlign: 'center', width: '50%' }}>{PICK_POINT(lang)}</span>
                            <span style={{ marginLeft: '32px', padding: '8px', color: 'white', fontSize: '14px', textAlign: 'center', width: '50%' }}>{PULL_POINT(lang)}</span>
                        </div>
                        {rides!.map(ride => {
                            return <MenuItem onClick={() => {
                                handleSelectEventRide(ride)
                            }} style={{
                                background: selectedEventRide === ride ? 'orange' : 'white',
                                alignSelf: 'center',
                                justifyContent: 'space-between',
                                textAlign: 'center',
                                flexDirection: 'row',
                                color: selectedEventRide === ride ? 'white' : 'black',
                                border: '.1px solid gray',
                                borderRadius: '4px',
                                marginTop: '8px',
                                marginBottom: '8px',
                                display: 'flex',
                            }} key={ride.rideId + ride.rideStartingPoint + Math.random() * Number.MAX_VALUE} value={ride.rideId}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <br />
                                    <span style={{ padding: '4px', width: '50%', fontSize: '14px', fontFamily: 'Open Sans Hebrew' }}>{` ${ride.rideStartingPoint}`}</span>
                                    <br />
                                    <span style={{ fontFamily: 'Open Sans Hebrew', fontSize: '14px', padding: '4px', width: '50%', fontWeight: 'bold' }}>{` ${ride.rideDestination}`}</span>
                                </div>

                            </MenuItem>
                        })}
                        <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} arrow title={selectedEventRide === null ? CHOOSE_RIDE(lang) : 'אשר הסעה'}>
                            <span>
                                <Button onClick={sendInvitation} sx={{ ...submitButton(false), ... { margin: '16px', padding: '8px', minWidth: '200px' } }} disabled={selectedEventRide === null}>{CONFIRM_RIDE(lang)}</Button>
                            </span>
                        </HtmlTooltip>
                    </List> : confirmation ? <div>{`תודה ${appUser?.name}, קיבלנו את אישורך `}</div> : null}
                </List>
            </div>
        </List>
    }
    return (
        <div dir='rtl' style={{ marginTop: '-8px', background: 'orange', display: 'flex', flexDirection: 'column' }}>
            {render()}
        </div>
    );
}

export default InvitationCard