import 'firebaseui/dist/firebaseui.css'
import React, { CSSProperties, useEffect, useState } from 'react';
import 'firebase/compat/auth';
import sold_out from '../../assets/images/sold_out.png'
import $ from 'jquery'
import { RegistrationForm } from '../auth/Register';
import { List, Button, MenuItem, Stack, TextField, Typography, Checkbox } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { PNPPrivateEvent, PNPRideConfirmation, PNPUser } from '../../store/external/types';
import { isValidPrivateEvent, isValidPublicRide, isValidRideConfirmation, isValidSingleRideConfirmation } from '../../store/validators';
import '../event/EventPage.css'
import { PNPPublicRide } from '../../store/external/types';
import { useNavigate, useParams } from 'react-router';
import { BETA } from '../../settings/config';
import { DARK_BLACK, PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_PINK, SECONDARY_WHITE } from '../../settings/colors';
import { InnerPageHolder, PageHolder } from '../utilityComponents/Holders';
import { CHOOSE_RIDE, CONFIRM_EVENT_ARRIVAL, FULL_NAME, PHONE_NUMBER, SIDE } from '../../settings/strings';
import { HtmlTooltip } from '../utilityComponents/HtmlTooltip';
import { submitButton, textFieldStyle } from '../../settings/styles';
import { Unsubscribe } from 'firebase/database';
import { makeStyles } from '@mui/styles';
import Spacer from '../utilityComponents/Spacer';
import { getDefaultConfirmation } from '../../store/external/helpers';
import { Hooks } from '../generics/types';
import { CommonHooks, withHookGroup } from '../generics/withHooks';
import { StoreSingleton } from '../../store/external';
import { User } from 'firebase/auth';
import { locationPinIconStyle, paragraphStyle, todayIconStyle } from '../gallery/Gallery';

export const rideTitleStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
}
// this page was written bad when i just started front-end development, but im too lazy to update it

export const nameforDir = (dir: number) => dir === 1 ? 'הלוך' : dir === 2 ? 'חזור' : 'הסעה דו כיוונית (הלוך חזור)'

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
        color: PRIMARY_PINK,
        fontSize: '18px'
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


    const RidesCardStyle = {
        background: 'white',
        borderRadius: '12px',
        padding: '8px',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        marginBlock: '8px',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    } as CSSProperties

    function getMenuItems(ride: PNPPublicRide) {
        const styleForRide = (dir: number) => ({
            backgroundColor: (selectedEventRide?.ride === ride && selectedEventRide.direction === dir) ? 'none' : ride.extras.rideStatus === 'sold-out' ? 'orange' : ' white',
            width: '100%',
            background: selectedEventRide?.ride === ride && selectedEventRide.direction === dir ? 'rgba(0,0,0,0.8)' : ride.extras.rideStatus === 'sold-out' ? `url(${sold_out})` : 'none',
            backgroundSize: (ride.extras.rideStatus === 'sold-out' && (selectedEventRide?.ride !== ride)) ? '125px 50px' : '100%',
            color: (selectedEventRide?.ride === ride && selectedEventRide.direction === dir ? 'white' : 'black'),
            border: '.1px solid lightgray',
            borderRadius: '8px',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: ride.extras.rideStatus === 'sold-out' && selectedEventRide?.ride !== ride ? '50% center' : 'center center',
            padding: '8px',
            display: 'flex',
        })
  
        const RideRow = ({ ride, dir }: { ride: PNPPublicRide, dir: number }) => {
            return (<MenuItem
                dir='rtl'
                onClick={() => {
                    handleSelectEventRide(ride, dir)
                }} style={styleForRide(dir)} value={ride.rideId}>
                <div style={rideTitleStyle}>
                    <Stack direction={'row'} alignItems={'center'} style={{ columnGap: '8px' }}>
                        <DirectionsBusIcon style={{ color: PRIMARY_ORANGE }} />
                        <span className='eventRideRowName_ePage'>{nameforDir(dir)}</span>
                    </Stack>
                    <span className={selectedEventRide?.ride === ride && selectedEventRide.direction === dir ? 'eventTimeSelected_ePage' : 'eventTime_ePage'}>{ride.extras.twoWay ? ride.rideTime : ride.extras.rideDirection === '1' ? ride.backTime : ride.rideTime}</span>
                </div>
            </MenuItem>)
        }



        return <Stack alignSelf={'center'} spacing={1} style={{
            maxWidth: '600px',
            width: '100%',
            ...RidesCardStyle
        }}>


            {ride.extras.twoWay ? (
                <React.Fragment
                    key={ride.rideId + ride.rideStartingPoint + Math.random() * Number.MAX_VALUE}>
                    <Stack>

                        <Typography
                            style={typographyStyle} >
                            {ride.rideStartingPoint}
                        </Typography>
                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>

                            {!ride.extras.twoWayOnly && <span
                                style={{ fontSize: '14px', textAlign: 'center', color: PRIMARY_BLACK }}
                            >{props.language.lang === 'heb' ? 'בחר הסעה: הלוך/חזור/הלוך וחזור' : 'Choose directions'}</span>}
                        </Stack>
                    </Stack>
                    {!ride.extras.twoWayOnly && <RideRow dir={1} ride={ride} />}
                    {!ride.extras.twoWayOnly && <RideRow dir={2} ride={ride} />}
                    <RideRow dir={3} ride={ride} />
                </React.Fragment>) : Number(ride.extras.rideDirection) === 1 ? (
                    <React.Fragment>
                        {!ride.extras.twoWayOnly && <RideRow dir={2} ride={ride} />}
                    </React.Fragment>) : (<React.Fragment>
                        {!ride.extras.twoWayOnly && <RideRow dir={1} ride={ride} />}
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
            <Stack spacing={1}>
                <span style={{ ...spanStyle, fontWeight: 'bold', paddingTop: '8px', color: PRIMARY_PINK, fontSize: '20px' }}>{event.eventTitle}</span>
                <Stack direction={'row'} columnGap={2}>
                    <p style={{ ...paragraphStyle, color: SECONDARY_WHITE, fontSize: '16px' }}><LocationOnIcon className="img_pin_location" style={locationPinIconStyle} />{event.eventLocation}</p>
                    <p style={{ ...paragraphStyle, color: SECONDARY_WHITE, fontSize: '16px' }}><CalendarTodayIcon style={todayIconStyle} />{event.eventDate} </p>
                </Stack>
            </Stack>
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
                        {props.user.appUser && <Typography
                            style={{ ...{ fontSize: '24px', color: SECONDARY_WHITE, fontFamily: 'Open Sans Hebrew' } }} >
                            {props.language.lang === 'heb' ? `שלום, ${props.user.appUser.name}` : `Hello, ${props.user.appUser.name}`}
                        </Typography>}
                        <Typography
                            style={{ ...{ fontSize: '24px', color: SECONDARY_WHITE, fontFamily: 'Open Sans Hebrew' } }} >
                            {props.language.lang === 'heb' ? 'בחר/י נקודת אסיפה/הורדה' : 'Start Point/Destination'}
                        </Typography>
                        <br />
                        {rides!.map(ride => {
                            return <React.Fragment key={ride.rideId + ride.eventId}>
                                {getMenuItems(ride)}
                            </React.Fragment>

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