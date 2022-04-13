import { AccordionDetails, AccordionSummary, Stack, ListItemIcon, List, MenuItem, Accordion, Button } from "@mui/material"
import { useEffect, useLayoutEffect, useState } from "react"
import { useParams } from "react-router"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import $ from 'jquery'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { PageHolder } from "../utilities/Holders";
import { useFirebase } from "../../context/Firebase"
import { ADDRESS, STARTING_POINT, SHOW_RIDE_SELECT, HIDE_EXTRA_DETAILS, ATTENTION, SHOW_EXTRA_DETAILS, START_DATE, CANT_SEE_YOUR_CITY, NO_DELAYS, BOTH_DIRECTIONS, SIDE, NO_RIDES, ORDER, PICK_START_POINT_REQUEST, CONTINUE_TO_SECURE_PAYMENT } from "../../settings/strings"
import { PNPEvent } from "../../store/external/types"
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { PaymentForm } from "../payment/Payment";
import { useLanguage } from "../../context/Language";
import { useLoading } from "../../context/Loading";
import { submitButton } from '../../settings/styles'
import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, SECONDARY_BLACK, PRIMARY_WHITE, SECONDARY_WHITE, DARKER_BLACK_SELECTED } from "../../settings/colors";
import { HtmlTooltip } from "../utilities/HtmlTooltip";
import { useNavigate, useLocation } from 'react-router'
import { PNPPublicRide } from "../../store/external/types";
import RideRequestForm from "../ride/RideRequestForm";
import { Unsubscribe } from "firebase/database";
import HTMLFromText from "../utilities/HtmlFromText";
export default function EventPage() {
    const [event, setEvent] = useState<PNPEvent | undefined | null>(undefined)
    const [expanded, setExpanded] = useState<boolean>(false)
    const [expandedRides, setExpandedRides] = useState<boolean>(true)
    const [selectedEventRide, setSelectedEventRide] = useState<PNPPublicRide | null>(null)
    const { isLoading, doLoad, cancelLoad, openDialog, closeDialog } = useLoading()
    const { lang } = useLanguage()
    const location = useLocation()
    const [eventRides, setEventRides] = useState<PNPPublicRide[]>([])
    const { firebase, appUser, user } = useFirebase()
    const { id } = useParams()

    const nav = useNavigate()


    const buildName = (e: PNPEvent, r?: PNPPublicRide, s?: PNPPublicRide | null) => {
        const f1 = `הסעה לאירוע ${e.eventName}`
        const f2 = (r?.extras.exactStartPoint || s?.extras.exactStartPoint) ? `${' יציאה מ-' + (r && r.extras.exactStartPoint ? r.extras.exactStartPoint : s && s.extras.exactStartPoint ? s.extras.exactStartPoint : '')}` : ''
        const f3 = (r?.extras.exactBackPoint || s?.extras.exactBackPoint) ? `${' חזרה מ-' + (r && r?.extras.exactBackPoint ? r?.extras.exactBackPoint : s && s.extras.exactBackPoint ? s.extras.exactBackPoint : '')}` : ''
        return `${f1} ${f2} ${f3}`
    }

    const openRequestPaymentDialog = (ride?: PNPPublicRide) => {
        if (!user || !appUser) {
            nav('/login', { state: { cachedLocation: location.pathname } })
            return
        }

        if (event) {
            openDialog({
                content: <div style={{ padding: '32px', }}><PaymentForm
                    product={{
                        name: `${event.eventName}`,
                        desc: event.eventDetails,
                        soldOut: ride ? soldOut(ride) : selectedEventRide ? soldOut(selectedEventRide) : false,
                        startPoint: ride ? ride.rideStartingPoint : selectedEventRide ? selectedEventRide.rideStartingPoint : '',
                        rideTime: ride ? ride.rideTime : selectedEventRide ? selectedEventRide.rideTime : '',
                        backTime: ride ? ride.backTime : selectedEventRide ? selectedEventRide.backTime : '',
                        exactStartPoint: ride && ride.extras.exactStartPoint ? ride.extras.exactStartPoint : selectedEventRide && selectedEventRide.extras.exactStartPoint ? selectedEventRide?.extras.exactStartPoint : null,
                        exactBackPoint: ride && ride.extras.exactBackPoint ? ride.extras.exactBackPoint : selectedEventRide && selectedEventRide.extras.exactBackPoint ? selectedEventRide?.extras.exactBackPoint : null,
                        direction: ride ? ride.extras.rideDirection : selectedEventRide?.extras.rideDirection, // 2 - first way , 1 second way
                        twoWay: ride ? ride?.extras.twoWay : selectedEventRide ? selectedEventRide.extras.twoWay : '',
                        price: ride ? ride.ridePrice : selectedEventRide ? selectedEventRide?.ridePrice : '0',
                        eventId: event.eventId,
                        rideId: ride ? ride.rideId : selectedEventRide ? selectedEventRide.rideId : ''
                    }} /></div>
            })
        }
    }

    useEffect(() => {
        doLoad()
        const resize = () => {
            const width = window.outerWidth
            if (width < 720) {
                $('#ride_start_point_list').css({ width: '95%' })
            } else if (width < 1020) {
                $('#ride_start_point_list').css({ width: '80%' })
            }
            else if (width > 1000) {
                $('#ride_start_point_list').css({ width: '70%' })
            }
        }

        let u1: Unsubscribe | null = null
        let u2: Unsubscribe | null = null
        if (id) {
            u1 = firebase.realTime.getPublicEventById(id, (event) => {
                setEvent(event as PNPEvent)
                cancelLoad()
                resize()
            })

            u2 = firebase.realTime.getPublicRidesByEventId(id, (rides) => {
                setEventRides(rides as PNPPublicRide[])
            })

        }
        return () => {
            u1 && (u1 as Unsubscribe) && (u1 as Unsubscribe)()
            u2 && (u2 as Unsubscribe) && (u2 as Unsubscribe)()
        }
    }, [])

    useEffect(() => {
        if (location.state) {
            if (event && location.state && location.state as PNPPublicRide) {
                openRequestPaymentDialog(location.state as PNPPublicRide)
                location.state = null
            }

        }
    }, [location.state, event, selectedEventRide])
    const handleSelectEventRide = (eventRide: PNPPublicRide) => {
        setSelectedEventRide(eventRide)
    }

    const handleSeeMoreToggle = () => {
        setExpanded(!expanded);
    };
    const handleSeeRidesToggle = () => {
        setExpandedRides(!expandedRides);
    };


    useLayoutEffect(() => {
        const resize = () => {

            const width = window.outerWidth
            if (width < 720) {
                $('#ride_start_point_list').css({ width: '95%' })
            } else if (width < 1020) {
                $('#ride_start_point_list').css({ width: '80%' })
            }
            else if (width > 1000) {
                $('#ride_start_point_list').css({ width: '70%' })
            }

        }
        window.addEventListener('resize', resize)
        resize()

        return () => { window.removeEventListener('resize', resize) }
    }, [])


    const soldOut = (ride: PNPPublicRide) => {
        return ride.extras
            && ride.extras.isRidePassengersLimited
            && Number(ride.passengers) >= Number(ride.extras.rideMaxPassengers)
    }
    const ridesLeft = (ride: PNPPublicRide) => {
        return Number(ride.extras.rideMaxPassengers) - Number(ride.passengers)
    }

    const soldOutLabel = (ride: PNPPublicRide) => {
        const left = ridesLeft(ride)
        const showLeft = ride.extras.isRidePassengersLimited && left <= 15
        const soldOut = left === 0
        const labelText = soldOut ? (lang === 'heb' ? 'כרטיסים אזלו' : 'Sold out') : (showLeft ? left + (lang === 'heb' ? ' מקומות נותרים' : ' Tickets Available') : (lang === 'heb' ? 'כרטיסים זמינים' : 'Tickets Available'))
        return (<div style={{
            direction: 'rtl',
            textAlign: 'end',
            color: soldOut ? 'red' : SECONDARY_WHITE,
            marginLeft: '2px',
            fontWeight: 'bold',
            padding: '2px',
            fontSize: '12px'
        }}>{labelText}</div>)
    }


    return (event === null) ? <h1>There was an error loading requested page</h1> : (event !== undefined ? (
        <PageHolder >
            <List id='ride_start_point_list' style={{ alignItems: 'center', width: '95%' }}>
                <ListItemIcon style={{ width: '100%' }}>
                    {event.eventImageURL.length > 0 && <img id='event_image_eventpage' alt={event.eventName} style={{ alignSelf: 'center', width: '100%' }} src={event.eventImageURL} />}
                </ListItemIcon>

                <div style={{
                    fontFamily: 'Open Sans Hebrew',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

                        <Accordion style={{ background: PRIMARY_BLACK, margin: '0px', borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }} expanded={true}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <p style={{
                                    textAlign: 'center',
                                    width: '100%',
                                    color: PRIMARY_WHITE,
                                    margin: '0px'
                                }}>
                                    {SHOW_RIDE_SELECT(lang)}</p>
                            </AccordionSummary>
                            <AccordionDetails>

                                <div dir={SIDE(lang)} style={{ border: '.1px solid whitesmoke', padding: '8px', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', backgroundImage: 'linear-gradient(15deg,#c31432,#240b36)', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>

                                    <InfoRoundedIcon style={{ padding: '8px', cursor: 'pointer', width: '25px', height: '25px', alignSelf: 'center', color: 'white' }} />
                                    <span style={{ padding: '8px', fontWeight: 'bold', color: PRIMARY_WHITE, alignSelf: 'center' }}>{ATTENTION(lang)}</span>
                                    <div dir={SIDE(lang)} style={{ display: 'flex', flexDirection: 'row' }}>

                                        <span style={{
                                            maxWidth: '200px',
                                            fontSize: '15.2px',
                                            padding: '8px',
                                            width: '50%',
                                            color: PRIMARY_WHITE,
                                            float: 'left'
                                        }}>
                                            {event.eventAttention ? event.eventAttention.eventAttention1 : BOTH_DIRECTIONS(lang)}
                                        </span>
                                        <span style={{
                                            maxWidth: '200px',
                                            fontSize: '15.2px',
                                            padding: '8px',
                                            width: '50%',
                                            color: PRIMARY_WHITE,
                                            float: 'right'
                                        }}>{
                                                event.eventAttention ? event.eventAttention.eventAttention2 : NO_DELAYS(lang)}
                                        </span>
                                    </div>
                                </div>

                                {eventRides.find(e => e.extras.isRidePassengersLimited) && <Stack>
                                   
                                    <label dir={SIDE(lang)} style={{ border: '.1px solid whitesmoke', borderBottomLeftRadius: '4px', fontWeight: 'bold', borderBottomRightRadius: '4px', fontSize: '14px', background: `none`, padding: '16px', color: SECONDARY_WHITE, textAlign: 'center' }}>{lang === 'heb' ? 'מספר המקומות מוגבל ל50 הרוכשים הראשונים בכל הסעה' : 'Places are limited to the first 50 buyers from each city'}</label>

                                </Stack>}
                                
                                <div style={{ color: PRIMARY_WHITE, padding: '8px' }}>{STARTING_POINT(lang)}</div>
                                {!isLoading && eventRides.length > 0 ? <Stack
                                    style={{ width: '100%', rowGap: '8px' }}>
                                    {eventRides.map(ride => {
                                        return <div key={ride.rideId + ride.rideStartingPoint}><MenuItem
                                            onClick={() => {
                                                handleSelectEventRide(ride)
                                            }} style={{
                                                background: (selectedEventRide === ride ? DARK_BLACK : 'white'),
                                                width: '100%',
                                                color: (selectedEventRide === ride ? 'white' : 'black'),
                                                border: '.1px solid gray',
                                                borderRadius: '4px',
                                                padding: '8px',
                                                display: 'flex',
                                            }} value={ride.rideId}>
                                            <div style={{
                                                display: 'flex',
                                                width: '100%',
                                                columnGap: '8px'
                                            }}>
                                                <DirectionsBusIcon /> <span style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'Open Sans Hebrew' }}>{ride.rideStartingPoint}</span>

                                            </div>
                                            <span>{ride.extras.twoWay ? ride.rideTime : ride.extras.rideDirection === '1' ? ride.backTime : ride.rideTime}</span>
                                        </MenuItem> {soldOutLabel(ride)}</div>
                                    })}
                                    <div style={{
                                        display: event.eventCanAddRides ? 'flex' : 'none',
                                        rowGap: '8px',
                                        flexDirection: 'column'
                                    }}> <AddCircleOutlineIcon
                                            onClick={() => user ? openDialog({ title: `ביקוש להסעה לאירוע ${event.eventName}`, content: <RideRequestForm event={event} /> }) : nav('/login', { state: { cachedLocation: location.pathname } })}
                                            color={'inherit'} style={{
                                                cursor: 'pointer',
                                                width: '50px',
                                                color: SECONDARY_WHITE,
                                                height: '50px',
                                                alignSelf: 'center'
                                            }} />
                                        <span style={{ color: PRIMARY_WHITE }}>{CANT_SEE_YOUR_CITY(lang)}</span></div>

                                </Stack> : event.eventCanAddRides && <Button
                                    onClick={() => user ? openDialog({ title: `ביקוש להסעה לאירוע ${event.eventName}`, content: <RideRequestForm event={event} /> }) : nav('/login', { state: { cachedLocation: location.pathname } })}
                                    style={{
                                        cursor: 'pointer',
                                        background: 'none',
                                        textAlign: 'center',
                                        color: SECONDARY_WHITE,
                                        fontFamily: 'Open Sans Hebrew',
                                        width: '100%',
                                        alignSelf: 'center'
                                    }}>{NO_RIDES(lang)}</Button>}
                                <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={selectedEventRide === null ? PICK_START_POINT_REQUEST(lang) : (lang === 'heb' ? 'המשך להזמנת כרטיסים' : 'Continue to order page')} arrow>
                                    <span>
                                        <Button onClick={() => openRequestPaymentDialog()}
                                            id="request_event_order"
                                            aria-haspopup disabled={selectedEventRide === null}
                                            sx={{ ...submitButton(true), ...{ maxWidth: '250px', textTransform: 'none' } }}> {ORDER(lang)}</Button>
                                    </span>
                                </HtmlTooltip>

                                <p style={{ padding: '0px', margin: '0px', fontSize: '12px', color: SECONDARY_WHITE }}>{lang === 'heb' ? 'בחר נקודת יציאה ולחץ על הכפתור למעבר למסך הזמנה' : 'Pick your desired start destination and click the button the continue'}</p>
                            </AccordionDetails>
                        </Accordion>
                    </div>

                </div>
                <br />
                <div >
                    <div style={{ padding: '8px' }}>



                        <div style={{ background: 'whitesmoke' }}>

                            <p style={{
                                fontSize: '32px',
                                marginBottom: '0px',
                                textAlign: 'right',
                                padding: '16px',
                                color: PRIMARY_WHITE,
                                background: PRIMARY_BLACK
                            }}>{event.eventName}</p></div>
                        <p style={{
                            padding: '8px',
                            marginTop: '0px',
                            color: SECONDARY_WHITE,
                            marginBottom: '0px',
                            background: PRIMARY_BLACK,
                            textAlign: 'right'
                        }}>{START_DATE(lang)}<span>{event.eventDate + " " + event.eventHours.startHour}</span></p>
                        <p dir={SIDE(lang)} style={{
                            background: PRIMARY_BLACK,
                            padding: '8px',
                            color: SECONDARY_WHITE,
                            marginTop: '0px',
                            marginBottom: '0px',
                            textAlign: 'right'
                        }}>{ADDRESS(lang)}<span>{event.eventLocation}</span></p>
                        <div style={{ display: 'flex', borderRadius: '16px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundImage: 'linear-gradient(15deg,#c31432,#240b36)', margin: '0px' }}>
                            <div aria-controls="panel1d-content" id="panel1d-header">
                                <p style={{
                                    alignSelf: 'center',
                                    textAlign: 'right',
                                    fontWeight: 'bold',
                                    padding: '16px',
                                    fontSize: '22px',
                                    color: PRIMARY_WHITE,
                                    margin: '0px'
                                }}>
                                    {lang === 'heb' ? 'פרטי אירוע' : 'Event Details'}</p>
                            </div>
                            <div>
                                <HTMLFromText
                                    style={{direction:'rtl', color: PRIMARY_WHITE, padding: '16px' }}
                                    text={event.eventDetails} />
                            </div>
                        </div>


                    </div>
                </div>
            </List>
        </PageHolder >
    ) : null)
}