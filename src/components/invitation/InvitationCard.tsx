import 'firebaseui/dist/firebaseui.css'
import React, { useEffect, useState } from 'react';
import 'firebase/compat/auth';

import $ from 'jquery'
import { RegistrationForm } from '../auth/Register';
import { List, Button, MenuItem, Stack, TextField, Typography, Checkbox } from '@mui/material';

import { useUser } from '../../context/Firebase';
import { PNPPrivateEvent, PNPRideConfirmation, PNPRideDirectionNumber, PNPUser } from '../../store/external/types';
import { isValidPrivateEvent, isValidPublicRide, isValidRideConfirmation, isValidSingleRideConfirmation } from '../../store/validators';

import { PNPPublicRide } from '../../store/external/types';
import { useNavigate, useParams } from 'react-router';
import { useLoading } from '../../context/Loading';
import { BETA } from '../../settings/config';
import { DARK_BLACK, PRIMARY_BLACK, SECONDARY_WHITE } from '../../settings/colors';
import { InnerPageHolder, PageHolder } from '../utilityComponents/Holders';
import { CHOOSE_RIDE, CONFIRM_EVENT_ARRIVAL, CONFIRM_RIDE, FULL_NAME, PHONE_NUMBER, SIDE } from '../../settings/strings';
import { useLanguage } from '../../context/Language';
import { HtmlTooltip } from '../utilityComponents/HtmlTooltip';
import { elegantShadow, submitButton, textFieldStyle } from '../../settings/styles';
import { Unsubscribe } from 'firebase/database';
import { makeStyles } from '@mui/styles';
import Spacer from '../utilityComponents/Spacer';
import { useCookies } from '../../context/CookieContext';
import { getDefaultConfirmation } from '../../store/external/helpers';
import { User } from 'firebase/auth';
import { Hooks } from '../generics/types';
import { CommonHooks, withHookGroup } from '../generics/withHooks';
import { StoreSingleton } from '../../store/external';
function InvitationCard(props: Hooks) {
    const [confirmation, setConfirmation] = useState<PNPRideConfirmation | null>(null)
    const [newConfirmation, setNewConfirmation] = useState<PNPRideConfirmation>()
    const [event, setEvent] = useState<PNPPrivateEvent | null>(null)
    const [rides, setRides] = useState<PNPPublicRide[] | null>(null)
    const [exists, setExists] = useState(true)
    const useStyles = makeStyles(() => textFieldStyle(PRIMARY_BLACK, { background: SECONDARY_WHITE }))
    const classes = useStyles()
    const { id } = useParams()
    const [selectedEventRide, setSelectedEventRide] = useState<{ ride: PNPPublicRide | null, direction: number } | null>(null)

    const handleSelectEventRide = (eventRide: PNPPublicRide, direction: number) => {
        setSelectedEventRide({ ride: eventRide, direction: direction })
        setNewConfirmation({
            ...newConfirmation!,
            directionType: direction + "",
            rideId: eventRide.rideId,
            directions: eventRide.rideStartingPoint + (" ל - ") + eventRide.rideDestination
        })
    }
    useEffect(() => {
        $('.dim').css('display', 'none')
        if (BETA) return
        props.loading.doLoad()
        let secondUnsub: Unsubscribe | null | object = null
        const unsubscribe = StoreSingleton.get().realTime.getPrivateEventById(id!, (event) => {

            if (isValidPrivateEvent(event as PNPPrivateEvent)) {
                setEvent(event as PNPPrivateEvent)
                setNewConfirmation(getDefaultConfirmation(event))
                props.cookies.getInvitationConfirmation(event.eventId).then(conf => {
                    if (conf) {
                        setConfirmation(conf)
                        props.loading.cancelLoad()
                    } else {
                        secondUnsub = StoreSingleton.get().realTime.getPrivateEventRidesById(id!, (rides) => {
                            if (rides as PNPPublicRide[]) {
                                setRides(rides as PNPPublicRide[])
                            }
                            props.loading.cancelLoad()
                        })
                    }
                })
            } else {
                props.loading.cancelLoad()
                setEvent(null)
                setExists(false)
            }
        })

        return () => {
            unsubscribe()
            secondUnsub && (secondUnsub as Unsubscribe) && (secondUnsub as Unsubscribe)()
        }
    }, [])


    const typographyStyle = {
        fontFamily: 'Open Sans Hebrew',
        color: SECONDARY_WHITE,
        fontWeight: 'bold',
        fontSize: '20px'
    }
    const spanStyle = {
        fontFamily: 'Open Sans Hebrew'
    }
    const nav = useNavigate()
    async function sendInvitation(userId?: string, u?: PNPUser) {

        if (!event || !rides || (rides.length > 1 && !selectedEventRide && newConfirmation?.rideArrival)) {

            return
        }

        let actualConfirmation = event.registrationRequired ? {
            ...newConfirmation,
            userName: u?.name ?? props.user.appUser!.name,
            userId: userId ?? props.user.user!.uid,
            phoneNumber: u?.phone ?? props.user.appUser!.phone
        } as PNPRideConfirmation : newConfirmation

        if (actualConfirmation && event.eventWithPassengers && event.eventWithGuests && actualConfirmation.rideArrival) {
            if (Math.abs(Number(actualConfirmation.passengers) - Number(actualConfirmation.guests)) !== 0) {
                actualConfirmation.splitGuestPassengers = true
                if (Number(actualConfirmation.passengers) > Number(actualConfirmation.guests)) {
                    alert('כמות האורחים צריכה להיות לפחות כמו כמות הנוסעים')
                    return
                }
            }
        }
        if (actualConfirmation && !newConfirmation?.rideArrival) {
            actualConfirmation.directionType = '0'
            actualConfirmation.directions = '0'
        }
        if (actualConfirmation && !actualConfirmation.guests
            || actualConfirmation?.guests === 'null' && !event.eventWithGuests) {
            actualConfirmation.guests = '1'
        }
        if (actualConfirmation && !actualConfirmation?.passengers
            || actualConfirmation?.passengers === 'null' && !event.eventWithPassengers) {
            actualConfirmation.passengers = '1'
        }
        if (event.eventWithPassengers && !event.eventWithGuests
            && !actualConfirmation?.rideArrival) {
            alert('כדי לאשר הגעה יש לסמן הגעה בהסעות ולבחור הסעה')
            return
        }


        if ((!rides || rides.length < 1)) {
            if (!isValidSingleRideConfirmation(actualConfirmation)) {
                alert('אנא מלא/י את כל פרטייך ')
                return
            }
        } else if (!isValidRideConfirmation(actualConfirmation)) {
            alert('אנא מלא/י את פרטייך ובחר הסעה')
            return
        }
        props.loading.doLoad()
        if (!actualConfirmation?.rideArrival || (rides && rides.length < 1 && event.eventWithPassengers) || (isValidPublicRide(selectedEventRide!.ride!))) {
            await props.cookies.saveInvitationConfirmation(actualConfirmation!)
                .then(() => {
                    StoreSingleton.get().realTime.addRideConfirmation(actualConfirmation!)
                    setConfirmation(actualConfirmation!)
                    props.loading.cancelLoad()
                    alert(`תודה ${actualConfirmation?.userName}, קיבלנו את אישורך `)
                })
        }
    }
    const updateConfirmationName = (name: string) => {
        setNewConfirmation({ ...newConfirmation!, userName: name })
    }
    const updateConfirmationGuests = (guests: string) => {
        setNewConfirmation({ ...newConfirmation!, guests: guests })
    }

    const updateConfirmationRidePassengers = (passengers: string) => {
        setNewConfirmation({ ...newConfirmation!, passengers: passengers })
    }
    const updateConfirmationPhone = (number: string) => {
        setNewConfirmation({ ...newConfirmation!, phoneNumber: number })
    }


    function getMenuItems(ride: PNPPublicRide) {

        return <Stack alignSelf={'center'} spacing={1} style={{
            maxWidth: '600px',
            width: '100%'
        }}>
            {

                ride.extras.twoWay ? (
                    <React.Fragment
                        key={ride.rideId + ride.rideStartingPoint + Math.random() * Number.MAX_VALUE}>
                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                            {!ride.extras.twoWayOnly && <span
                                style={{ fontSize: '18px', textAlign: 'center', color: SECONDARY_WHITE }}
                            >{props.language.lang === 'heb' ? 'בחר הסעה: הלוך/חזור/הלוך וחזור' : 'Choose directions'}</span>}
                            <span
                                style={{ color: SECONDARY_WHITE, fontSize: '12px', marginTop: '48px' }}
                            >{props.language.lang === 'heb' ? 'שעת יציאה,שעת חזרה' : 'Ride time,Back time'}</span>
                        </Stack>
                        {!ride.extras.twoWayOnly && <MenuItem
                            onClick={() => {
                                handleSelectEventRide(ride, 1)
                            }} style={{
                                background: (selectedEventRide?.ride === ride && selectedEventRide.direction === 1) ? DARK_BLACK : 'white',
                                alignSelf: 'center',
                                justifyContent: 'space-between',
                                textAlign: 'center',
                                width: '100%',
                                flexDirection: 'row',
                                color: (selectedEventRide?.ride === ride && selectedEventRide.direction === 1) ? 'white' : 'black',
                                border: '.1px solid gray',
                                borderRadius: '4px',
                                marginTop: '8px',
                                marginBottom: '8px',
                                display: 'flex',
                            }} value={ride.rideId}>
                            <span style={spanStyle}>{props.language.lang === 'heb' ? 'הסעה הלוך' : 'Ride to event'}</span>
                            <span style={{ ...spanStyle, ...{ fontSize: '14px' } }}>{ride.rideTime}</span>
                        </MenuItem>}
                        {!ride.extras.twoWayOnly && <MenuItem onClick={() => {
                            handleSelectEventRide(ride, 2)
                        }} style={{
                            background: (selectedEventRide?.ride === ride && selectedEventRide.direction === 2) ? DARK_BLACK : 'white',
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            textAlign: 'center',
                            width: '100%',
                            flexDirection: 'row',
                            color: (selectedEventRide?.ride === ride && selectedEventRide.direction === 2) ? 'white' : 'black',
                            border: '.1px solid gray',
                            borderRadius: '4px',
                            marginTop: '8px',
                            marginBottom: '8px',
                            display: 'flex',
                        }} value={ride.rideId}>

                            <span style={spanStyle}>{props.language.lang === 'heb' ? 'הסעה חזור' : 'Ride Back'}</span>
                            <span style={{ ...spanStyle, ...{ fontSize: '14px' } }}>{ride.backTime}</span>
                        </MenuItem>}
                        <MenuItem onClick={() => {
                            handleSelectEventRide(ride, 3)
                        }} style={{
                            background: (selectedEventRide?.ride === ride && selectedEventRide.direction === 3) ? DARK_BLACK : 'white',
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            textAlign: 'center',
                            width: '100%',
                            flexDirection: 'row',
                            color: (selectedEventRide?.ride === ride && selectedEventRide.direction === 3) ? 'white' : 'black',
                            border: '.1px solid gray',
                            borderRadius: '4px',
                            marginTop: '8px',
                            marginBottom: '8px',
                            display: 'flex',
                        }} value={ride.rideId}>
                            <span style={spanStyle}>{props.language.lang === 'heb' ? 'הסעה דו כיוונית (הלוך וחזור) ' : 'Two directions ride'}</span>
                            <span style={{ ...spanStyle, ...{ fontSize: '14px' } }}>{ride.rideTime + ", " + ride.backTime}</span>
                        </MenuItem>
                    </React.Fragment>) : Number(ride.extras.rideDirection) === 1 ? (
                        <React.Fragment>
                            <MenuItem
                                key={ride.rideId + ride.rideStartingPoint + Math.random() * Number.MAX_VALUE}

                                onClick={() => {
                                    handleSelectEventRide(ride, 2)
                                }} style={{
                                    background: selectedEventRide?.ride === ride ? DARK_BLACK : 'white',
                                    alignSelf: 'center',
                                    justifyContent: 'space-between',
                                    textAlign: 'center',
                                    width: '100%',
                                    flexDirection: 'row',
                                    color: selectedEventRide?.ride === ride ? 'white' : 'black',
                                    border: '.1px solid gray',
                                    borderRadius: '4px',
                                    marginTop: '8px',
                                    marginBottom: '8px',
                                    display: 'flex',
                                }} value={ride.rideId}>

                                <span style={spanStyle}>{props.language.lang === 'heb' ? 'הסעה חזור' : 'Ride Back'}</span>
                                <span style={{ ...spanStyle, ...{ fontSize: '14px' } }}>{ride.backTime}</span>
                            </MenuItem>
                        </React.Fragment>) : (<React.Fragment>
                            <MenuItem
                                key={ride.rideId + ride.rideStartingPoint + Math.random() * Number.MAX_VALUE}

                                onClick={() => {
                                    handleSelectEventRide(ride, 1)
                                }} style={{
                                    background: selectedEventRide?.ride === ride ? DARK_BLACK : 'white',
                                    alignSelf: 'center',
                                    justifyContent: 'space-between',
                                    textAlign: 'center',
                                    width: '100%',
                                    flexDirection: 'row',
                                    color: selectedEventRide?.ride === ride ? 'white' : 'black',
                                    border: '.1px solid gray',
                                    borderRadius: '4px',
                                    marginTop: '8px',
                                    marginBottom: '8px',
                                    display: 'flex',
                                }} value={ride.rideId}>
                                <span style={spanStyle}>{props.language.lang === 'heb' ? 'הסעה הלוך' : 'Ride to event'}</span>
                                <span style={{ ...spanStyle, ...{ fontSize: '14px' } }}>{ride.rideTime}</span>
                            </MenuItem>
                        </React.Fragment>)
            }
        </Stack >
    }

    const eventDoesNotExist = !exists
    const eventIsValid = event != null
    if (confirmation) {
        return <InnerPageHolder style={{ padding: '0px', maxWidth: '360px', marginLeft: 'auto', border: 'none', background: PRIMARY_BLACK, marginRight: 'auto' }}

        >
            {event && event.eventImageURL ? <img alt='No image for this event'
                style={{ width: '100%', maxHeight: '720px', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', minWidth: '360px', height: '50%' }}
                src={event!.eventImageURL} /> : null}
            <div style={{ background: SECONDARY_WHITE, minWidth: '100%', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>


                <div style={{ fontSize: '18px', minWidth: '360px', width: '100%', color: PRIMARY_BLACK }}>
                    <br />
                    <span dir={SIDE(props.language.lang)} style={{ maxWidth: '360px', padding: '8px' }}>
                        {props.language.lang === 'heb' ? `תודה ${confirmation.userName}, קיבלנו את אישור הגעתך.` : `Thank you ${confirmation.userName}, we got your ride arrival confirmation.`}
                    </span>
                    <br />
                    <span dir={SIDE(props.language.lang)} style={{ maxWidth: '360px', padding: '8px' }}>
                        {props.language.lang === 'heb' ? `נתראה ב ${confirmation.date}` : `See you at ${confirmation.date}`}
                    </span>

                </div>
                <span dir={SIDE(props.language.lang)} style={{ display: 'inline-block', padding: '8px', color: PRIMARY_BLACK, fontSize: '16px', fontWeight: 'bold' }}>{(props.language.lang === 'heb' ? 'מספר אורחים: ' : 'Number of guests: ') + (confirmation.guests ? confirmation.guests : 1)}</span>

                <br />
                {confirmation.rideArrival && <Stack>
                    <span dir={'rtl'} style={{ padding: '4px', color: PRIMARY_BLACK, fontSize: '16px', fontWeight: 'bold' }}>{confirmation.directions !== 'null' ? (props.language.lang === 'heb' ? confirmation.directions.replace(' to ', ' ל - ') : confirmation.directions) : confirmation.confirmationTitle}</span>
                    <span dir={SIDE(props.language.lang)} style={{ padding: '8px', color: PRIMARY_BLACK, fontSize: '16px', fontWeight: 'bold' }}>{(props.language.lang === 'heb' ? 'מספר נוסעים בהסעות: ' : 'Number of ride passengers: ') + (confirmation.passengers && confirmation.passengers !== 'unset' ? confirmation.passengers : 1)}</span>
                </Stack>}
            </div >
        </InnerPageHolder>

    } else if (eventDoesNotExist) {
        return <div style={{ padding: '32px' }}>Event Does not exist</div>
    } else if (eventIsValid) {
        return <PageHolder style={{ direction: SIDE(props.language.lang), marginTop: '0px' }}>

            {event && event.eventImageURL ? <img alt='No image for this event'
                style={{ width: '100%', minWidth: '300px', height: '50%' }}
                src={event!.eventImageURL} /> : null}

            <span style={{ ...spanStyle, fontWeight: 'bold', paddingTop: '8px', color: SECONDARY_WHITE, fontSize: '20px' }}>{event.eventTitle}</span>

            <span style={{ ...spanStyle, padding: '2px', color: SECONDARY_WHITE, fontSize: '16px' }}>{event.eventLocation}</span>
            <span style={{ ...spanStyle, fontWeight: '100', padding: '2px', color: SECONDARY_WHITE, fontSize: '14px' }}>{event.eventDate}</span>

            <div style={{ width: '100%', background: PRIMARY_BLACK }}>
                <List style={{ width: '85%', background: PRIMARY_BLACK, minWidth: 'fit-content', marginLeft: 'auto', marginRight: 'auto', padding: '16px' }}>
                    {/* Arriving to rides Check box */}
                    {event.eventWithPassengers && newConfirmation && !newConfirmation.rideArrival && <Stack
                        alignItems={'center'}
                        justifyContent={'center'}
                        direction={'row'}
                        padding={'8px'}>
                        <label style={{ color: SECONDARY_WHITE }}>{'אני מגיע/ה בהסעות'}</label>

                        {newConfirmation && <Checkbox
                            style={{ color: SECONDARY_WHITE }}
                            value={newConfirmation.rideArrival}
                            onChange={(e) => {
                                let checked = e.target.checked
                                setNewConfirmation({
                                    ...newConfirmation,
                                    rideArrival: checked
                                })
                            }} />}

                    </Stack>}
                    {(rides && rides.length > 0 && newConfirmation?.rideArrival) ? <List style={{ width: '100%' }} dir={SIDE(props.language.lang)}>

                        <Typography
                            style={{ ...typographyStyle, ...{ fontSize: '24px' } }} >
                            {props.language.lang === 'heb' ? 'נקודת אסיפה/הורדה' : 'Start Point/Destination'}
                        </Typography>
                        <br />
                        {rides!.map(ride => {
                            return <Stack key={ride.rideId + ride.eventId}>

                                <Typography
                                    style={typographyStyle} >
                                    {ride.rideStartingPoint}
                                </Typography>
                                {getMenuItems(ride)}
                            </Stack>

                        })}
                        <Spacer offset={1} />

                    </List> : confirmation ? <div>{`תודה ${(confirmation as PNPRideConfirmation).userName}, קיבלנו את אישורך `}</div> : null}
                    <Stack spacing={1}
                        style={{ width: '300px', marginLeft: 'auto', marginRight: 'auto' }}>

                        {!event.registrationRequired && <TextField classes={classes}
                            onChange={(e) => updateConfirmationName(e.target.value)}
                            name='fullname'
                            placeholder={FULL_NAME(props.language.lang)} />}
                        {!event.registrationRequired && <TextField classes={classes}
                            name='phone'
                            type='tel'
                            onChange={(e) => updateConfirmationPhone(e.target.value)}
                            placeholder={PHONE_NUMBER(props.language.lang)} />}


                        {function guestsField() {
                            if (event.eventWithGuests) {
                                return (<TextField classes={classes}
                                    type='number'
                                    name='number'
                                    onChange={(e) => updateConfirmationGuests(e.target.value)}
                                    placeholder={props.language.lang === 'heb' ? 'מספר אורחים' : 'Number of guests'} />)
                            }
                        }()}

                        {function passengersField() {
                            if (newConfirmation?.rideArrival && event.eventWithPassengers) {
                                return (<TextField classes={classes}
                                    type='number'
                                    name='number'
                                    onChange={(e) => updateConfirmationRidePassengers(e.target.value)}
                                    placeholder={props.language.lang === 'heb' ? 'מספר נוסעים בהסעה' : 'Number of Passengers'} />)
                            }
                        }()}
                    </Stack>


                    {event.registrationRequired && !props.user.appUser
                        ? <RegistrationForm
                            externalRegistration
                            registerButtonText={CONFIRM_EVENT_ARRIVAL(props.language.lang)}
                            style={{
                                width: 'fit-content',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }} registrationSuccessAction={(user: User) => {
                                props.loading.doLoad()
                                let unsub: Unsubscribe | undefined;
                                unsub = StoreSingleton.get().realTime.getUserById(user.uid, ((u: PNPUser) => {
                                    if (u && u.name) {
                                        props.loading.cancelLoad()
                                        sendInvitation(user.uid, u)
                                        unsub && (unsub as Unsubscribe) && unsub()
                                    }
                                }))
                            }} /> : <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} arrow title={selectedEventRide === null ? CHOOSE_RIDE(props.language.lang) : 'אשר הגעה'}>
                            <span>
                                <Button onClick={() => sendInvitation()}
                                    sx={{
                                        ...submitButton(false),
                                        ... { textTransform: 'none', margin: '16px', padding: '8px', minWidth: props.language.lang === 'heb' ? '200px' : '250px' }
                                    }}
                                    disabled={newConfirmation?.rideArrival && rides !== null && rides.length > 0 && selectedEventRide === null}>
                                    {CONFIRM_EVENT_ARRIVAL(props.language.lang)}
                                </Button>
                            </span>
                        </HtmlTooltip>}
                </List>
            </div>
        </PageHolder >
    } else return null
}

export default withHookGroup(InvitationCard, [...CommonHooks, 'cookies'])