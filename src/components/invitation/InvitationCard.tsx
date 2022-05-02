import 'firebaseui/dist/firebaseui.css'
import { useEffect, useState } from 'react';
import 'firebase/compat/auth';

import $ from 'jquery'
import { List, Button, MenuItem, Stack, TextField } from '@mui/material';

import { useFirebase } from '../../context/Firebase';
import { PNPPrivateEvent, PNPRideConfirmation } from '../../store/external/types';
import { isValidPrivateEvent, isValidPublicRide, isValidRideConfirmation } from '../../store/validators';

import { PNPPublicRide } from '../../store/external/types';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useLoading } from '../../context/Loading';
import { BETA } from '../../settings/config';
import { DARK_BLACK, PRIMARY_BLACK, RED_ROYAL, SECONDARY_WHITE } from '../../settings/colors';
import { InnerPageHolder } from '../utilities/Holders';
import { CHOOSE_RIDE, CONFIRM_RIDE, FULL_NAME, PHONE_NUMBER, PICK_POINT, PULL_POINT, SIDE } from '../../settings/strings';
import { useLanguage } from '../../context/Language';
import { HtmlTooltip } from '../utilities/HtmlTooltip';
import { submitButton, textFieldStyle } from '../../settings/styles';
import { Unsubscribe } from 'firebase/database';
import { makeStyles } from '@mui/styles';
import Spacer from '../utilities/Spacer';
import { useCookies } from '../../context/CookieContext';
function InvitationCard() {
    const [confirmation, setConfirmation] = useState<PNPRideConfirmation | null>(null)
    const [newConfirmation, setNewConfirmation] = useState<PNPRideConfirmation>()
    const { doLoad, cancelLoad } = useLoading()
    const [event, setEvent] = useState<PNPPrivateEvent | null>(null)
    const [rides, setRides] = useState<PNPPublicRide[] | null>(null)
    const { firebase, appUser, user } = useFirebase()
    const { getInvitationConfirmation, saveInvitationConfirmation } = useCookies()
    const [exists, setExists] = useState(true)
    const { lang } = useLanguage()
    const useStyles = makeStyles(() => textFieldStyle(PRIMARY_BLACK, { background: SECONDARY_WHITE }))
    const classes = useStyles()
    const { id } = useParams()
    const [selectedEventRide, setSelectedEventRide] = useState<PNPPublicRide | null>(null)

    const handleSelectEventRide = (eventRide: PNPPublicRide) => {
        setSelectedEventRide(eventRide)
        setNewConfirmation({ ...newConfirmation!, directions: eventRide.rideStartingPoint + (lang === 'heb' ? " ל - " : ' to - ') + eventRide.rideDestination })
    }
    useEffect(() => {
        $('.dim').css('display', 'none')
        if (BETA) return
        doLoad()
        let secondUnsub: Unsubscribe | null | object = null
        const unsubscribe = firebase.realTime.getPrivateEventById(id!, (event) => {

            if (isValidPrivateEvent(event as PNPPrivateEvent)) {
                setEvent(event as PNPPrivateEvent)
                setNewConfirmation({
                    userId: 'guest',
                    eventId: event.eventId ?? '',
                    userName: 'null',
                    phoneNumber: 'null',
                    date: event?.eventDate ?? '',
                    confirmationTitle: event?.eventTitle ?? '',
                    rideId: 'null',
                    passengers: 'null',
                    directions: 'null',
                })
                getInvitationConfirmation(event.eventId).then(conf => {
                    if (conf) {
                        setConfirmation(conf)
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
        if (isValidPublicRide(selectedEventRide!) && isValidRideConfirmation(newConfirmation)) {
            await saveInvitationConfirmation(newConfirmation!)
                .then(() => {
                    firebase.realTime.addRideConfirmation(newConfirmation!)
                    alert(`תודה ${newConfirmation?.userName}, קיבלנו את אישורך `)
                    setConfirmation(newConfirmation!)
                    cancelLoad()
                })
        }
    }
    const updateConfirmationName = (name: string) => {
        setNewConfirmation({ ...newConfirmation!, userName: name })
    }
    const updateConfirmationGuests = (guests: string) => {
        setNewConfirmation({ ...newConfirmation!, passengers: guests })
    }
    const updateConfirmationPhone = (number: string) => {
        setNewConfirmation({ ...newConfirmation!, phoneNumber: number })
    }

    const EventImage = (props: { e: PNPPrivateEvent | null }) => {
        return props.e && props.e.eventImageURL ? <img alt='No image for this event'
            style={{ width: '100%', minWidth: '300px', height: '50%' }}
            src={props.e!.eventImageURL} /> : null
    }



    const eventDoesNotExist = !exists
    const eventIsValid = event != null
    if (confirmation) {
        return <InnerPageHolder style={{ marginLeft: 'auto', background: RED_ROYAL, marginRight: 'auto' }}

        >
            <EventImage e={event} />
            <div style={{ background: SECONDARY_WHITE, minWidth: '300px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>


                <div style={{ fontSize: '18px', color: PRIMARY_BLACK }}>
                    <br />
                    <span style={{ maxWidth: '300px', direction: SIDE(lang), padding: '8px' }}>
                        {`תודה, ${confirmation.userName} , קיבלנו את אישור הגעתך להסעה, נתראה ב ${confirmation.date}`} </span></div>
                <br />
                <Stack>


                    <span style={{ padding: '4px', color: PRIMARY_BLACK, fontSize: '16px', fontWeight: 'bold' }}>{lang === 'heb' ? confirmation.directions.replace(' to ', ' ל - ') : confirmation.directions}</span>

                    <span style={{ padding: '8px', color: PRIMARY_BLACK, fontSize: '16px', fontWeight: 'bold' }}>{(lang === 'heb' ? 'מספר אורחים: ' : 'Number of guests: ') + (confirmation.passengers ? confirmation.passengers : 1)}</span>
                </Stack>
            </div >
        </InnerPageHolder>

    } else if (eventDoesNotExist) {
        return <div style={{ padding: '32px' }}>Event Does not exist</div>
    } else if (eventIsValid) {
        return <List style={{ marginTop: '0px' }}>
            <EventImage e={event} />
            <div style={{ width: '100%', background: PRIMARY_BLACK }}>
                <List style={{ width: '85%', background: PRIMARY_BLACK, minWidth: 'fit-content', marginLeft: 'auto', marginRight: 'auto', padding: '16px' }}>
                    {rides && rides!.length > 0 && <span style={{ color: SECONDARY_WHITE, fontWeight: 'bold', fontFamily: 'Open Sans Hebrew' }}>
                        {lang === 'heb' ? ('כל ההסעות יוצאות מ ' + rides![0].rideStartingPoint + " בשעה " + rides![0].rideTime) : 'All the rides leave from ' + rides![0].rideStartingPoint + ' at ' + rides![0].rideStartingPoint}
                    </span>}
                    <br />
                    <span style={{
                        fontFamily: 'Open Sans Hebrew',
                        margin: '32px',
                        color: SECONDARY_WHITE
                    }}>
                        {CHOOSE_RIDE(lang)}
                    </span>
                    {rides ? <List style={{ width: '100%' }} dir={SIDE(lang)}>

                        {rides.find(ride => ride.extras.twoWay) ? <div style={{ width: '100%', display: 'flex', background: 'black', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                            <span style={{ padding: '8px', marginRight: '32px', fontSize: '14px', color: 'white', textAlign: 'center', width: '50%' }}>{PICK_POINT(lang)}</span>
                            <span style={{ marginLeft: '32px', padding: '8px', color: 'white', fontSize: '14px', textAlign: 'center', width: '50%' }}>{PULL_POINT(lang)}</span>
                        </div> : rides.find(ride => ride.extras.rideDirection === '2') ?
                            <div style={{ width: '75%', display: 'flex', background: 'black', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', alignSelf: 'center', justifyContent: 'center' }}>
                                <span style={{ padding: '8px', color: 'white', fontSize: '14px', textAlign: 'center', width: '50%' }}>{PULL_POINT(lang)}</span>
                            </div> : <div style={{ width: '75%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', background: 'black', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                                <span style={{ padding: '8px', color: 'white', fontSize: '14px', textAlign: 'center', width: '50%' }}>{PICK_POINT(lang)}</span>
                            </div>}
                        {rides!.map(ride => {
                            return <MenuItem onClick={() => {
                                handleSelectEventRide(ride)
                            }} style={{
                                background: selectedEventRide === ride ? DARK_BLACK : 'white',
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

                                    {
                                        ride.extras.twoWay ? <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>

                                            <br />
                                            <span style={{ padding: '4px', width: '50%', fontSize: '14px', fontFamily: 'Open Sans Hebrew' }}>{` ${ride.rideStartingPoint}`}</span>
                                            <br />
                                            <span style={{ fontFamily: 'Open Sans Hebrew', fontSize: '14px', padding: '4px', width: '50%', fontWeight: 'bold' }}>{` ${ride.rideDestination}`}</span>

                                        </div> : Number(ride.extras.rideDirection) === 2 ? <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                            <br />
                                            <span style={{ padding: '4px', width: '50%', fontSize: '14px', color: 'red', fontFamily: 'Open Sans Hebrew' }}>{lang === 'heb' ? 'הסעה בכיוון חזור בלבד' : 'Ride back only'}</span>
                                            <br />

                                            <span style={{ fontFamily: 'Open Sans Hebrew', fontSize: '14px', padding: '4px', width: '50%', fontWeight: 'bold' }}>{` ${ride.rideDestination}`}</span>
                                        </div> : <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>

                                            <br />
                                            <span style={{ padding: '4px', width: '50%', fontSize: '14px', fontFamily: 'Open Sans Hebrew' }}>{` ${ride.rideStartingPoint}`}</span>
                                            <br />
                                            <span style={{ fontFamily: 'Open Sans Hebrew', fontSize: '14px', color: 'red', padding: '4px', width: '50%', fontWeight: 'bold' }}>{lang === 'heb' ? 'הסעה בכיוון הלוך בלבד' : 'Ride to-event only'}</span>

                                        </div>}
                                </div>

                            </MenuItem>
                        })}
                        <Spacer offset={1} />
                        <Stack spacing={1} style={{ width: '300px', marginLeft: 'auto', marginRight: 'auto' }}>

                            <TextField classes={classes}
                                onChange={(e) => updateConfirmationName(e.target.value)}
                                name='fullname'
                                placeholder={FULL_NAME(lang)} />
                            <TextField classes={classes}
                                name='phone'
                                type='tel'
                                onChange={(e) => updateConfirmationPhone(e.target.value)}
                                placeholder={PHONE_NUMBER(lang)} />
                            <TextField classes={classes}
                                type='number'
                                onChange={(e) => updateConfirmationGuests(e.target.value)}
                                placeholder={lang === 'heb' ? 'מספר אורחים' : 'Number of guests'} />
                        </Stack>
                        <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} arrow title={selectedEventRide === null ? CHOOSE_RIDE(lang) : 'אשר הגעה'}>
                            <span>
                                <Button onClick={sendInvitation} sx={{ ...submitButton(false), ... { textTransform: 'none', margin: '16px', padding: '8px', minWidth: lang === 'heb' ? '200px' : '250px' } }} disabled={selectedEventRide === null}>{CONFIRM_RIDE(lang)}</Button>
                            </span>
                        </HtmlTooltip>
                    </List> : confirmation ? <div>{`תודה ${(confirmation as PNPRideConfirmation).userName}, קיבלנו את אישורך `}</div> : null}
                </List>
            </div>
        </List>
    } else return null
}

export default InvitationCard