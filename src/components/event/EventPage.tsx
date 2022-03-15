import { Typography, AccordionDetails, AccordionSummary, Stack, ListItemIcon, List, MenuItem, Accordion, Button, Tooltip } from "@mui/material"
import { useEffect, useLayoutEffect, useState } from "react"
import { useParams } from "react-router"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import $ from 'jquery'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { InnerPageHolder, PageHolder } from "../utilities/Holders";
import { useFirebase } from "../../context/Firebase"
import { ADDRESS, CURRENCY, STARTING_POINT, SHOW_RIDE_SELECT, HIDE_EXTRA_DETAILS, LOADING, ATTENTION, SHOW_EXTRA_DETAILS, START_DATE, CANT_SEE_YOUR_CITY, NO_DELAYS, BOTH_DIRECTIONS, TOTAL_COST, SIDE, NO_RIDES, ORDER, PICK_START_POINT_REQUEST, CONTINUE_TO_SECURE_PAYMENT } from "../../settings/strings"
import { PNPEvent } from "../../store/external/types"
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { PaymentForm } from "../payment/Payment";
import { useLanguage } from "../../context/Language";
import { useLoading } from "../../context/Loading";
import { submitButton } from '../../settings/styles'
import { ORANGE_GRADIENT_PRIMARY } from "../../settings/colors";
import { HtmlTooltip } from "../utilities/HtmlTooltip";
import { useNavigate, useLocation } from 'react-router'
import { PNPPublicRide } from "../../store/external/types";
import RideRequestForm from "../ride/RideRequestForm";
import { Unsubscribe } from "firebase/database";
export default function EventPage() {
    const [event, setEvent] = useState<PNPEvent | undefined | null>(undefined)
    const [expanded, setExpanded] = useState<boolean>(false)
    const [expandedRides, setExpandedRides] = useState<boolean>(true)
    const [selectedEventRide, setSelectedEventRide] = useState<PNPPublicRide | null>(null)
    const { isLoading, doLoad, cancelLoad, openDialog } = useLoading()
    const { lang } = useLanguage()
    const location = useLocation()
    const [eventRides, setEventRides] = useState<PNPPublicRide[]>([])
    const { firebase, appUser } = useFirebase()
    const { id } = useParams()

    const nav = useNavigate()
    const openRequestPaymentDialog = () => {
        if (!firebase.auth.currentUser || !appUser) {
            nav('/login', { state: { cachedLocation: location.pathname } })
            return
        }
        openDialog({ content: <div style={{ padding: '32px', }}><PaymentForm product={{ name: event ? `הסעה לאירוע ${event!.eventName} מ - ${selectedEventRide?.rideStartingPoint} ל - ${selectedEventRide?.rideDestination}` : '', desc: event?.eventDetails, image: null, price: selectedEventRide?.ridePrice }} /></div> })
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
        $(window).resize(() => { resize() })
        resize()
    }, [])


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

                        <Accordion style={{ background: 'whitesmoke', margin: '0px', borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }} expanded={true}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <p style={{
                                    textAlign: 'center',
                                    width: '100%',
                                    color: 'black',
                                    margin: '0px'
                                }}>
                                    {SHOW_RIDE_SELECT(lang)}</p>
                            </AccordionSummary>
                            <AccordionDetails>

                                <div dir={SIDE(lang)} style={{ padding: '8px', borderRadius: '4px', background: 'white', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>

                                    <InfoRoundedIcon color="inherit" style={{ padding: '8px', cursor: 'pointer', width: '25px', height: '25px', alignSelf: 'center' }} />
                                    <span style={{ padding: '8px', fontWeight: 'bold', color: 'black', alignSelf: 'center' }}>{ATTENTION(lang)}</span>
                                    <div dir={SIDE(lang)} style={{ display: 'flex', flexDirection: 'row' }}>

                                        <span style={{ maxWidth: '200px', fontSize: '16px', padding: '8px', width: '50%', color: 'black', float: 'left' }}>{BOTH_DIRECTIONS(lang)}</span>
                                        <span style={{ maxWidth: '200px', fontSize: '16px', padding: '8px', width: '50%', color: 'black', float: 'right' }}>{NO_DELAYS(lang)}</span>
                                    </div>
                                </div>
                                <div style={{ color: 'black', padding: '8px', width: '100%' }}>{STARTING_POINT(lang)}</div>
                                {!isLoading && eventRides.length > 0 ? <Stack
                                    style={{ width: '100%', rowGap: '8px' }}>
                                    {eventRides.map(ride => {
                                        return <MenuItem onClick={() => {
                                            handleSelectEventRide(ride)
                                        }} style={{
                                            background: selectedEventRide === ride ? 'orange' : 'white',
                                            width: '100%',
                                            color: selectedEventRide === ride ? 'white' : 'black',
                                            border: '.1px solid gray',
                                            borderRadius: '4px',
                                            padding: '8px',
                                            display: 'flex',
                                        }} key={ride.rideId + ride.rideStartingPoint} value={ride.rideId}>
                                            <div style={{
                                                display: 'flex',
                                                width: '100%',
                                                columnGap: '8px'
                                            }}>
                                                <DirectionsBusIcon /> <span style={{ fontWeight: 'bold', fontFamily: 'Open Sans Hebrew' }}>{ride.rideStartingPoint}</span>

                                            </div>
                                            <span>{ride.rideTime}</span>
                                        </MenuItem>
                                    })}
                                    <div style={{
                                        display: event.eventCanAddRides ? 'flex' : 'none',
                                        rowGap: '8px',
                                        flexDirection: 'column'
                                    }}> <AddCircleOutlineIcon
                                            onClick={() => openDialog({ title: `ביקוש להסעה לאירוע ${event.eventName}`, content: <RideRequestForm event={event} /> })}
                                            color="inherit" style={{
                                                cursor: 'pointer',
                                                width: '50px',
                                                height: '50px',
                                                alignSelf: 'center'
                                            }} />
                                        <span style={{ color: 'black' }}>{CANT_SEE_YOUR_CITY(lang)}</span></div>

                                </Stack> : <Button
                                    onClick={() => openDialog({ title: `ביקוש להסעה לאירוע ${event.eventName}`, content: <RideRequestForm event={event} /> })}
                                    style={{
                                        cursor: 'pointer',
                                        background: 'none',
                                        textAlign: 'center',
                                        fontFamily: 'Open Sans Hebrew',
                                        width: '100%',
                                        alignSelf: 'center'
                                    }}>{NO_RIDES(lang)}</Button>}
                                <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={selectedEventRide === null ? PICK_START_POINT_REQUEST(lang) : CONTINUE_TO_SECURE_PAYMENT(lang)} arrow>
                                    <span>
                                        <Button onClick={openRequestPaymentDialog} id="request_event_order" aria-haspopup disabled={selectedEventRide === null} sx={{ ...submitButton(true), ...{ maxWidth: '250px' } }}> {ORDER(lang)}</Button>
                                    </span>
                                </HtmlTooltip>
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
                                color: 'black',
                                background: 'whitesmoke'
                            }}>{event.eventName}</p></div>
                        <p style={{
                            padding: '8px',
                            marginTop: '0px',
                            marginBottom: '0px',
                            background: 'whitesmoke',
                            textAlign: 'right'
                        }}>{START_DATE(lang)}<span>{event.eventDate + " " + event.eventHours.startHour}</span></p>
                        <p dir={SIDE(lang)} style={{
                            background: 'whitesmoke',
                            padding: '8px',

                            marginTop: '0px',
                            marginBottom: '0px',
                            textAlign: 'right'
                        }}>{ADDRESS(lang)}<span>{event.eventLocation}</span></p>
                        <Accordion style={{ background: 'whitesmoke', margin: '0px' }} expanded={expanded === true} onChange={() => handleSeeMoreToggle()}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <p style={{
                                    textAlign: 'right',
                                    color: 'rgb(0, 122, 255)',
                                    margin: '0px'
                                }}>
                                    {expanded ? HIDE_EXTRA_DETAILS(lang) : SHOW_EXTRA_DETAILS(lang)}</p>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{event.eventDetails}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>


                    </div>
                </div>
            </List>
        </PageHolder >
    ) : null)
}