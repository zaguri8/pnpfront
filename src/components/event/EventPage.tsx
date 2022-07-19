import { AccordionDetails, AccordionSummary, Stack, ListItemIcon, List, MenuItem, Accordion, Button } from "@mui/material"
import React, { CSSProperties, useEffect, useLayoutEffect, useState } from "react"
import { useParams } from "react-router"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import $ from 'jquery'
import './EventPage.css'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import sold_out from '../../assets/images/sold_out.png'
import { PageHolder } from "../utilities/Holders";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useFirebase } from "../../context/Firebase"
import { ADDRESS, STARTING_POINT, SHOW_RIDE_SELECT, HIDE_EXTRA_DETAILS, ATTENTION, SHOW_EXTRA_DETAILS, START_DATE, CANT_SEE_YOUR_CITY, NO_DELAYS, BOTH_DIRECTIONS, SIDE, NO_RIDES, ORDER, PICK_START_POINT_REQUEST, CONTINUE_TO_SECURE_PAYMENT, EVENT_DETAILS } from "../../settings/strings"
import { PNPEvent } from "../../store/external/types"
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { PaymentForm } from "../payment/Payment";
import { useLanguage } from "../../context/Language";
import { useLoading } from "../../context/Loading";
import { submitButton } from '../../settings/styles'
import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, SECONDARY_BLACK, PRIMARY_WHITE, SECONDARY_WHITE, DARKER_BLACK_SELECTED, RED_ROYAL, PRIMARY_ORANGE, PRIMARY_PINK } from "../../settings/colors";
import { HtmlTooltip } from "../utilities/HtmlTooltip";
import { useNavigate, useLocation } from 'react-router'
import { PNPPublicRide } from "../../store/external/types";
import RideRequestForm from "../ride/RideRequestForm";
import { Unsubscribe } from "firebase/database";
import HTMLFromText from "../utilities/HtmlFromText";
import { useHeaderBackgroundExtension } from "../../context/HeaderContext";
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

    const openRequestPaymentDialog = (ride?: PNPPublicRide) => {
        if (event) {
            openDialog({
                content: <div style={{ padding: '32px', }}>
                    <PaymentForm
                        product={{
                            name: `${event.eventName}`,
                            desc: event.eventDetails,
                            ticketsLeft: ride && ride.extras.rideMaxPassengers ? (Number(ride.extras.rideMaxPassengers) - Number(ride.passengers)) : (selectedEventRide && selectedEventRide.extras.rideMaxPassengers) ? (Number(selectedEventRide.extras.rideMaxPassengers) - Number(selectedEventRide.passengers)) : 1000,
                            soldOut: ride ? ride.extras.rideStatus === 'sold-out' : selectedEventRide ? selectedEventRide.extras.rideStatus === 'sold-out' : false,
                            startPoint: ride ? ride.rideStartingPoint : selectedEventRide ? selectedEventRide.rideStartingPoint : '',
                            rideTime: ride ? ride.rideTime : selectedEventRide ? selectedEventRide.rideTime : '',
                            backTime: ride ? ride.backTime : selectedEventRide ? selectedEventRide.backTime : '',
                            exactStartPoint: ride && ride.extras.exactStartPoint ? ride.extras.exactStartPoint : selectedEventRide && selectedEventRide.extras.exactStartPoint ? selectedEventRide?.extras.exactStartPoint : null,
                            exactBackPoint: ride && ride.extras.exactBackPoint ? ride.extras.exactBackPoint : selectedEventRide && selectedEventRide.extras.exactBackPoint ? selectedEventRide?.extras.exactBackPoint : null,
                            direction: ride ? ride.extras.rideDirection : selectedEventRide?.extras.rideDirection, // 2 - first way , 1 second way
                            twoWay: ride ? ride?.extras.twoWay : selectedEventRide ? selectedEventRide.extras.twoWay : '',
                            price: ride ? ride.ridePrice : selectedEventRide ? selectedEventRide?.ridePrice : '0',
                            eventId: event.eventId,
                            eventDate: event.eventDate,
                            rideId: ride ? ride.rideId : selectedEventRide ? selectedEventRide.rideId : ''
                        }} /></div>
            })
        }
    }


    const { setHeaderBackground } = useHeaderBackgroundExtension()
    useEffect(() => {
        doLoad()




        const resize = () => {
            if (window.innerWidth > 1100) {
                $('.ride_item_button').css('width', '50%')
            }
            else if (window.innerWidth > 900) {
                $('.ride_item_button').css('width', '60%')
            }
            else if (window.innerWidth > 700) {
                $('.ride_item_button').css('width', '80%')
            } else if (window.innerWidth < 600) {
                $('.ride_item_button').css('width', '100%')
            }
        }
        let u1: Unsubscribe | null = null
        let u2: Unsubscribe | null = null
        if (id) {
            u1 = firebase.realTime.getPublicEventById(id, (event) => {
                setEvent(event as PNPEvent)
                setHeaderBackground(`url('${event?.eventImageURL}') no-repeat center`)
                cancelLoad()
                resize()
            })

            u2 = firebase.realTime.getPublicRidesByEventId(id, (rides) => {
                setEventRides(rides as PNPPublicRide[])
            })
        }
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize);
            u1 && (u1 as Unsubscribe) && (u1 as Unsubscribe)()
            u2 && (u2 as Unsubscribe) && (u2 as Unsubscribe)()
            setHeaderBackground('none');
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

    const ridesLeft = (ride: PNPPublicRide) => {
        return Number(ride.extras.rideMaxPassengers) - Number(ride.passengers)
    }

    const SoldOutLabel = ({ ride }: { ride: PNPPublicRide }) => {
        const left = ridesLeft(ride)
        const showLeft = ride.extras.rideStatus === 'running-out'
        const soldOut = left === 0
        const labelText = soldOut ? (lang === 'heb' ? 'כרטיסים אזלו' : 'Sold out') : (showLeft ? left + (lang === 'heb' ? (' כרטיסים' + (left <= 10 ? ' אחרונים' : ' זמינים')) : ' Tickets Available') : (lang === 'heb' ? 'כרטיסים זמינים' : 'Tickets Available'))
        return (<div className={'sold_out_item_label'}
            style={{
                direction: 'rtl',
                textAlign: 'center',
                color: (showLeft && !soldOut) ? '#EE1229' : soldOut ? 'gray' : (selectedEventRide === ride ? PRIMARY_WHITE : PRIMARY_BLACK),
                display: 'flex',
                background: selectedEventRide === ride ? 'rgba(0,0,0,0.8)' : ride.extras.rideStatus === 'sold-out' ? `url(${sold_out})` : 'none',

                alignItems: 'center',
                justifyContent: 'center',
                borderTopLeftRadius: '8px',
                borderBottomLeftRadius: '8px',
                border: '.1px solid lightgray',
                fontSize: '12px'
            }}>{labelText}</div>)
    }


    const RideRow = ({ ride }: { ride: PNPPublicRide }) => {
        return (<MenuItem
            dir='rtl'
            onClick={() => {
                handleSelectEventRide(ride)
            }} style={{
                backgroundColor: (selectedEventRide !== ride) ? 'white' : ride.extras.rideStatus === 'sold-out' ? 'orange' : ' none',
                width: '100%',
                backgroundPosition: ride.extras.rideStatus === 'sold-out' && selectedEventRide !== ride ? '50% center' : 'center center',
                backgroundRepeat: 'no-repeat',
                background: selectedEventRide === ride ? 'rgba(0,0,0,0.8)' : ride.extras.rideStatus === 'sold-out' ? `url(${sold_out})` : 'none',
                backgroundSize: (ride.extras.rideStatus === 'sold-out' && (selectedEventRide !== ride)) ? '125px 50px' : '100%',
                color: (selectedEventRide === ride ? 'white' : 'black'),
                border: '.1px solid lightgray',
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px',
                marginLeft: 'auto',
                marginRight: 'auto',
                padding: '8px',
                display: 'flex',
            }} value={ride.rideId}>
            <div style={{
                display: 'flex',
                width: '100%',
                columnGap: '8px'
            }}>
                <DirectionsBusIcon style={{ color: PRIMARY_ORANGE }} />
                <span className={selectedEventRide === ride ? 'eventTimeSelected_ePage' : 'eventTime_ePage'}>{ride.extras.twoWay ? ride.rideTime : ride.extras.rideDirection === '1' ? ride.backTime : ride.rideTime}</span>
                <span className='eventRideRowName_ePage'>{ride.rideStartingPoint}</span>

            </div>

        </MenuItem>)
    }

    const RidesList = () => {
        return <React.Fragment>
            {(eventRides.map(ride => {
                return <Stack style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }} direction={'row'} key={ride.rideId + ride.rideStartingPoint}>
                    <SoldOutLabel ride={ride} />
                    <RideRow ride={ride} />
                </Stack>
            }))}
        </React.Fragment>
    }

    const noRidesStyle = {
        direction: SIDE(lang),
        background: 'none',
        textAlign: 'center',
        fontSize: '12px',
        color: PRIMARY_BLACK,
        fontFamily: 'Open Sans Hebrew',
        width: '100%',
        alignSelf: 'center'
    } as CSSProperties

    const noRidesStyle2 = {
        paddingLeft: lang === 'heb' ? '4px' : '0px',
        paddingRight: lang === 'heb' ? '0px' : '4px',
        textDecoration: 'underline',
        textUnderlinePosition: 'under',
        cursor: 'pointer'
    } as CSSProperties






    return (event === null) ? <h1>There was an error loading requested page</h1> : (event !== undefined ? (
        <React.Fragment><PageHolder style={{
            background: 'white',
            transform: 'translateY(-24px)',
            borderTopLeftRadius: '32px',
            borderTopRightRadius: '32px'
        }}  >
            <List id='ride_start_point_list' style={{
                margin: '0px',
                borderTopLeftRadius: '32px',
                borderTopRightRadius: '32px',
                padding: '0px',
                alignItems: 'center',
                width: '100%'
            }}>

                <div className="eventRideListContainerWrapper_ePage">
                    <div className="ride_item_button">
                        <Stack style={{ background: 'white', padding: '8px', paddingTop: '12px', borderTopLeftRadius: '32px', borderTopRightRadius: '32px' }}
                            alignItems='center'
                            dir='rtl' direction="row">
                            <div className="c_square_b" />
                            <p className='eventName_ePage'>{event.eventName}</p>
                        </Stack>
                        <p className='eventDateLocation_ePage'>
                            <CalendarTodayIcon style={{ width: '12px', height: '12px', color: PRIMARY_ORANGE }} /> <span>
                                {event.eventDate + " " + event.eventHours.startHour}
                            </span>
                            <LocationOnIcon style={{ width: '12px', height: '12px', color: PRIMARY_ORANGE }} /> <span>{event.eventLocation}</span>
                        </p>
                        <div className='eventRideListContainer_ePage'>
                            <div style={{ margin: '0px', padding: '0px' }}>
                                <hr className="light_hline" />
                                <div dir={SIDE(lang)} className="attention_container">
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '2px' }}>
                                        <span className='attention_ePage'>
                                            {ATTENTION(lang)}</span>
                                        <span >
                                            {event.eventAttention?.eventAttention1 === 'unset' ? BOTH_DIRECTIONS(lang) : event.eventAttention?.eventAttention1}
                                        </span>
                                    </div>
                                    {eventRides.find(e => e.extras.isRidePassengersLimited) &&
                                        <span dir={SIDE(lang)}>
                                            {'מספר המקומות מוגבל ל-50 הרוכשים הראשונים בכל הסעה'}
                                        </span>}
                                </div>
                                {!isLoading && eventRides.length > 0 ?
                                    <Stack
                                        style={{ width: '100%', rowGap: '8px' }}>
                                        <RidesList />
                                    </Stack> : event.eventCanAddRides &&
                                    <div style={noRidesStyle}>{lang === 'heb' ? `לאירוע זה טרם קיימות הסעות, לחץ` : 'This event has no rides, click'}
                                        <b onClick={() => user ? openDialog({ title: `ביקוש להסעה לאירוע ${event.eventName}`, content: <RideRequestForm event={event} /> }) : nav('/login', { state: { cachedLocation: location.pathname } })}
                                            style={noRidesStyle2}> {lang === 'heb' ? `כאן` : 'Here'}
                                        </b >
                                        {lang === 'heb' ? `על מנת ליצור ביקוש להסעה` : ' In order to make a ride request'}</div>}
                                <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={selectedEventRide === null ? PICK_START_POINT_REQUEST(lang) : (lang === 'heb' ? 'המשך להזמנת כרטיסים' : 'Continue to order page')} arrow>
                                    <span>
                                        <Button onClick={() => openRequestPaymentDialog()}
                                            id="request_event_order"
                                            aria-haspopup disabled={selectedEventRide === null}
                                            style={{
                                                ...submitButton(true), ...{
                                                    maxWidth: '250px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'none'
                                                }
                                            }}> {ORDER(lang)}</Button>
                                    </span>

                                </HtmlTooltip>

                            </div>
                            <span style={{ fontSize: '10px' }}>
                                {NO_DELAYS(lang)}
                            </span>
                        </div>
                    </div>

                </div>
                <div className="ride_item_button" style={{
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }} >
                    <div style={{
                        padding: '8px'
                    }}>

                        <hr className="light_hline" />
                        <div style={{
                            display: event.eventCanAddRides ? 'flex' : 'none',
                            rowGap: '8px',
                            padding: '8px',
                            flexDirection: 'column'
                        }}> <AddCircleOutlineIcon
                                onClick={() => user ? openDialog({ title: `ביקוש להסעה לאירוע ${event.eventName}`, content: <RideRequestForm event={event} /> }) : nav('/login', { state: { cachedLocation: location.pathname } })}
                                style={{
                                    cursor: 'pointer',
                                    width: '50px',
                                    color: 'white',
                                    borderRadius: '32px',
                                    background: PRIMARY_PINK,
                                    height: '50px',
                                    alignSelf: 'center'
                                }} />
                            <span className='cantSeeCity_ePage'>
                                {CANT_SEE_YOUR_CITY(lang)}
                            </span>
                        </div>
                        <hr className="light_hline" />
                        <div className='eventDetailsContainer_ePage'>
                            <label>{EVENT_DETAILS(lang)}</label>
                            <div>
                                <HTMLFromText
                                    style={{ direction: 'rtl', color: PRIMARY_WHITE, padding: '16px' }}
                                    text={event.eventDetails} />
                            </div>
                        </div>


                    </div>
                </div>
            </List>
        </PageHolder >
            <div className='hide_bg_ePage'/>
        </React.Fragment>
    ) : null)
}