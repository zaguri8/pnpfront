import { Typography, AccordionDetails, AccordionSummary, Stack, ListItemIcon, List, MenuItem, Accordion } from "@mui/material"
import { useEffect, useLayoutEffect, useState } from "react"
import { useParams } from "react-router"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import $ from 'jquery'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { useAuthState } from "../../context/Firebase"
import { ADDRESS, CURRENCY, STARTING_POINT, SHOW_RIDE_SELECT, HIDE_EXTRA_DETAILS, LOADING, ATTENTION, SHOW_EXTRA_DETAILS, START_DATE, CANT_SEE_YOUR_CITY, NO_DELAYS, BOTH_DIRECTIONS, TOTAL_COST, SIDE } from "../../settings/strings"
import { PNPEvent } from "../../store/external/types"

import { PageHolder } from "../auth/Register"
import { PNPRide } from "../../store/external/types"
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { useLanguage } from "../../context/Language";

export default function EventPage() {
    const [event, setEvent] = useState<PNPEvent | undefined | null>(undefined)
    const [error, setError] = useState<string | null>(null)


    const [eventRides, setEventRides] = useState<PNPRide[]>([])
    const { firebase } = useAuthState()
    const { id } = useParams()

    useEffect(() => {
        firebase.realTime.getEventById(id)
            .then((event: PNPEvent) => {
                setEvent(event)
            }).catch((err: any) => {
                setError(err)
            })

        firebase.realTime.getAllEventRidesById(id)
            .then((rides: PNPRide[]) => {
                if (rides === null || rides.length === 0)
                    return
                setEventRides(rides)
            })
    }, [])



    const [expanded, setExpanded] = useState<boolean>(false)
    const [expandedRides, setExpandedRides] = useState<boolean>(false)
    const [selectedEventRide, setSelectedEventRide] = useState<PNPRide | null>(null)

    const handleSelectEventRide = (eventRide: PNPRide) => {
        setSelectedEventRide(eventRide)
    }

    const handleSeeMoreToggle = () => {
        setExpanded(!expanded);
    };
    const handleSeeRidesToggle = () => {
        setExpandedRides(!expandedRides);
    };

    const { lang } = useLanguage()

    useLayoutEffect(() => {
        console.log('again')
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
    }, [window])

    return (error || event === null) ? <h1>There was an error loading requested page</h1> : (event !== undefined ? (
        <PageHolder >
            <List id='ride_start_point_list' style={{ alignItems: 'center', width: '95%' }}>
                <ListItemIcon style={{ width: '100%' }}>
                    <img alt={event.eventName} style={{ alignSelf: 'center', width: '100%' }} src={event.eventImageURL} />
                </ListItemIcon>

                <div style={{
                    fontFamily: 'Open Sans Hebrew',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

                        <p style={{
                            background: 'whitesmoke',
                            fontFamily: 'Open Sans Hebrew',
                            padding: '8px',
                            fontSize: '22px',
                            margin: '0px',
                            fontWeight: '100',
                            color: 'gray'
                        }}>
                            {`${TOTAL_COST(lang)}: ${selectedEventRide?.ridePrice ? selectedEventRide?.ridePrice : '0.00'} ${CURRENCY(lang)}`}
                        </p>
                        <Accordion style={{ background: 'whitesmoke', margin: '0px', borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }} expanded={expandedRides === true} onChange={() => handleSeeRidesToggle()}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <p style={{
                                    textAlign: 'right',
                                    color: 'rgb(0, 122, 255)',
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
                                <div style={{ color: 'black', padding: '8px' }}>{STARTING_POINT(lang)}</div>
                                {eventRides && <Stack
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
                                                <span>{ride.rideTime}</span>
                                                <span style={{ marginLeft: 'auto' }} dir={SIDE(lang)}>{ride.ridePrice + " " + CURRENCY(lang)}</span>

                                            </div>
                                        </MenuItem>
                                    })}

                                    <AddCircleOutlineIcon color="inherit" style={{ cursor: 'pointer', width: '50px', height: '50px', alignSelf: 'center' }} />
                                    <span style={{ color: 'black' }}>{CANT_SEE_YOUR_CITY(lang)}</span>

                                </Stack>}
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
                        <p style={{
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
        </PageHolder>
    ) : <h1 dir={SIDE(lang)}>{LOADING(lang)}</h1>)
}