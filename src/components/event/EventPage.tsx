import { Stack, List, MenuItem, Button } from "@mui/material"
import React, { CSSProperties, useEffect, useState } from "react"
import { useParams } from "react-router"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import $ from 'jquery'
import './EventPage.css'
import sold_out from '../../assets/images/sold_out.png'
import { PageHolder } from "../utilityComponents/Holders";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { ATTENTION, CANT_SEE_YOUR_CITY, NO_DELAYS, BOTH_DIRECTIONS, SIDE, ORDER, PICK_START_POINT_REQUEST, EVENT_DETAILS } from "../../settings/strings"
import { PNPEvent } from "../../store/external/types"
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

import { submitButton } from '../../settings/styles'
import { PRIMARY_BLACK, PRIMARY_WHITE, PRIMARY_ORANGE, PRIMARY_PINK } from "../../settings/colors";
import { HtmlTooltip } from "../utilityComponents/HtmlTooltip";
import { useLocation } from 'react-router'
import { PNPPublicRide } from "../../store/external/types";
import RideRequestForm from "../ride/RideRequestForm";
import { Unsubscribe } from "firebase/database";
import HTMLFromText from "../utilityComponents/HtmlFromText";
import { useHeaderBackgroundExtension } from "../../context/HeaderContext";
import { getValidImageUrl } from "../../utilities";
import { Hooks } from "../generics/types";
import { CommonHooks, withHookGroup } from "../generics/withHooks";
import { StoreSingleton } from "../../store/external";
function EventPage(props: Hooks) {
    const [event, setEvent] = useState<PNPEvent | undefined | null>(undefined)
    const [selectedEventRide, setSelectedEventRide] = useState<PNPPublicRide | null>(null)
    const location = useLocation()
    const [eventRides, setEventRides] = useState<PNPPublicRide[]>([])
    const { id } = useParams()
    const openRequestPaymentDialog = (ride?: PNPPublicRide) => {
        if (event) {
            props.nav('/event/payment', { state: { ride: ride ?? selectedEventRide, event: event } })
        }
    }


    const { setHeaderBackground } = useHeaderBackgroundExtension()


    useEffect(() => {
        props.loading.doLoad()
        const resize = (e?: PNPEvent) => {
            let c: any = e;
            if (!c) {
                c = event;
            }
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
            if (window.innerWidth > 900 && $('.App-header').css('background-size') !== "contain") {
                $('.App-header').css('background', "linear-gradient(rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.1))," + `url('${getValidImageUrl(c)}') no-repeat center`)
                $('.App-header').css('background-size', 'contain')
                $('.App-header').css('height', '80vh')
            } else if ($('.App-header').css('background-size') !== 'cover') {
                $('.App-header').css('background', "linear-gradient(rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.1))," + `url('${getValidImageUrl(c)}') no-repeat center`)
                $('.App-header').css('background-size', 'cover')
                $('.App-header').css('height', '70vh')
            }
        }

        let u1: Unsubscribe | null = null
        let u2: Unsubscribe | null = null
        let removeResize: any;
        if (id) {
            u1 = StoreSingleton.getTools().realTime.getPublicEventById(id, (event) => {
                setEvent(event as PNPEvent)
                props.loading.cancelLoad()
                removeResize = () => resize(event as PNPEvent)
                window.addEventListener('resize', removeResize);
                resize(event as PNPEvent)
            })

            u2 = StoreSingleton.getTools().realTime.getPublicRidesByEventId(id, (rides) => {
                setEventRides(rides as PNPPublicRide[])
            })
        }
        return () => {
            if (removeResize)
                window.removeEventListener('resize', removeResize)
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
        const labelText = soldOut ? (props.language.lang === 'heb' ? 'כרטיסים אזלו' : 'Sold out') : (showLeft ? left + (props.language.lang === 'heb' ? (' כרטיסים' + (left <= 10 ? ' אחרונים' : ' זמינים')) : ' Tickets Available') : (props.language.lang === 'heb' ? 'כרטיסים זמינים' : 'Tickets Available'))
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
                background: selectedEventRide === ride ? 'rgba(0,0,0,0.8)' : ride.extras.rideStatus === 'sold-out' ? `url(${sold_out})` : 'none',
                backgroundSize: (ride.extras.rideStatus === 'sold-out' && (selectedEventRide !== ride)) ? '125px 50px' : '100%',
                color: (selectedEventRide === ride ? 'white' : 'black'),
                border: '.1px solid lightgray',
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: ride.extras.rideStatus === 'sold-out' && selectedEventRide !== ride ? '50% center' : 'center center',

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
        direction: SIDE(props.language.lang),
        background: 'none',
        textAlign: 'center',
        fontSize: '12px',
        color: PRIMARY_BLACK,
        fontFamily: 'Open Sans Hebrew',
        width: '100%',
        alignSelf: 'center'
    } as CSSProperties

    const noRidesStyle2 = {
        paddingLeft: props.language.lang === 'heb' ? '4px' : '0px',
        paddingRight: props.language.lang === 'heb' ? '0px' : '4px',
        textDecoration: 'underline',
        textUnderlinePosition: 'under',
        cursor: 'pointer'
    } as CSSProperties






    return (event === null) ? <h1>There was an error loading requested page</h1> : (event !== undefined ? (
        <React.Fragment>
            <PageHolder
                transformUp
                style={{
                    background: 'white',
                    transform: 'translateY(-42px)',
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
                                    <div dir={SIDE(props.language.lang)} className="attention_container">
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '2px' }}>
                                            <span className='attention_ePage'>
                                                {ATTENTION(props.language.lang)}</span>
                                            <span >
                                                {event.eventAttention?.eventAttention1 === 'unset' ? BOTH_DIRECTIONS(props.language.lang) : event.eventAttention?.eventAttention1}
                                            </span>
                                        </div>
                                        {eventRides.find(e => e.extras.isRidePassengersLimited) &&
                                            <span dir={SIDE(props.language.lang)}>
                                                {'מספר המקומות מוגבל ל-50 הרוכשים הראשונים בכל הסעה'}
                                            </span>}
                                    </div>
                                    {!props.loading.isLoading && eventRides.length > 0 ?
                                        <Stack
                                            style={{ width: '100%', rowGap: '8px' }}>
                                            <RidesList />
                                        </Stack> : event.eventCanAddRides &&
                                        <div style={noRidesStyle}>{props.language.lang === 'heb' ? `לאירוע זה טרם קיימות הסעות, לחץ` : 'This event has no rides, click'}
                                            <b onClick={() => props.user.user ? props.loading.openDialog({ title: `ביקוש להסעה לאירוע ${event.eventName}`, content: <RideRequestForm event={event} /> }) : props.nav('/login', { state: { cachedLocation: location.pathname } })}
                                                style={noRidesStyle2}> {props.language.lang === 'heb' ? `כאן` : 'Here'}
                                            </b >
                                            {props.language.lang === 'heb' ? `על מנת ליצור ביקוש להסעה` : ' In order to make a ride request'}</div>}
                                    <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={selectedEventRide === null ? PICK_START_POINT_REQUEST(props.language.lang) : (props.language.lang === 'heb' ? 'המשך להזמנת כרטיסים' : 'Continue to order page')} arrow>
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
                                                }}> {ORDER(props.language.lang)}</Button>
                                        </span>

                                    </HtmlTooltip>

                                </div>
                                <span style={{ fontSize: '10px' }}>
                                    {NO_DELAYS(props.language.lang)}
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
                                    onClick={() => props.user.user ? props.loading.openDialog({ title: `ביקוש להסעה לאירוע ${event.eventName}`, content: <RideRequestForm event={event} /> }) : props.nav('/login', { state: { cachedLocation: location.pathname } })}
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
                                    {CANT_SEE_YOUR_CITY(props.language.lang)}
                                </span>
                            </div>
                            <hr className="light_hline" />
                            <div className='eventDetailsContainer_ePage'>
                                <label>{EVENT_DETAILS(props.language.lang)}</label>
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
        </React.Fragment>
    ) : null)
}
export default withHookGroup(EventPage, CommonHooks)