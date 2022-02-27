import { Typography, AccordionDetails, AccordionSummary, Stack, ListItemIcon, TableRow, TableCell, List, MenuItem, Accordion } from "@mui/material"
import { useEffect, useLayoutEffect, useState } from "react"
import { useParams } from "react-router"
import { tableCellClasses } from "@mui/material"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import $ from 'jquery'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { useAuthState } from "../../context/Firebase"
import { ADDRESS, CURRENCY, STARTING_POINT, SHOW_RIDE_SELECT, HIDE_EXTRA_DETAILS, LOADING,ATTENTION, SHOW_EXTRA_DETAILS, START_DATE, CANT_SEE_YOUR_CITY, NO_DELAYS, BOTH_DIRECTIONS } from "../../settings/strings"
import { PNPEvent } from "../../store/external/types"
import { PageHolder } from "../auth/Register"
import { styled } from '@mui/material/styles';
import { PNPRide } from "../../store/external/types"
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

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
                console.log(rides)
                setEventRides(rides)
            })
    }, [])

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            fontFamily: 'Open Sans Hebrew',
            fontSize: 18,
            padding: '12px',
            width: '25%',
            backgroundColor: theme.palette.common.white,
            color: theme.palette.common.black,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const [expanded, setExpanded] = useState<boolean>(false)
    const [expandedRides, setExpandedRides] = useState<boolean>(false)
    const [selectedEventRide, setSelectedEventRide] = useState<PNPRide | null>(null)

    const handleSelectEventRide = (eventRide: PNPRide) => {
        setSelectedEventRide(eventRide)
    }
    const getSingleCityItem = () => {
        return (eventRides && selectedEventRide && <div>
            <span style={{ maxWidth: '100px' }}>
                {eventRides.find((ride) => {
                    return ride.rideId + ride.rideStartingPoint == selectedEventRide?.rideId + selectedEventRide?.rideStartingPoint
                })?.rideStartingPoint}
            </span>
        </div>)
    }
    const handleSeeMoreToggle = () => {
        setExpanded(!expanded);
    };
    const handleSeeRidesToggle = () => {
        setExpandedRides(!expandedRides);
    };



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
    })


    return (error || event === null) ? <h1>There was an error loading requested page</h1> : (event !== undefined ? (
        <PageHolder >

            <List id='ride_start_point_list' style={{ alignItems: 'center', width: '95%' }}>
                <ListItemIcon style={{ width: '100%' }}>
                    <img style={{ alignSelf: 'center', width: '100%' }} src={event.eventImageURL} />
                </ListItemIcon>

                {/* <Table dir='rtl'>

                    <TableHead  >
                        <TableRow>
                            <StyledTableCell align="center" style={{ color: 'white', background: 'orange' }}>
                                כיוון הסעה
                            </StyledTableCell>
                            <StyledTableCell align="center" style={{ color: 'white', background: 'orange' }}>
                                סוג כרטיס
                            </StyledTableCell>
                            <StyledTableCell align="center" style={{ color: 'white', background: 'orange' }}>
                                מחיר עכשיו
                            </StyledTableCell>
                            <StyledTableCell align="center" style={{ color: 'white', background: 'orange' }}>
                                מחיר מלא
                            </StyledTableCell>
                        </TableRow>

                        {eventRides && selectedEventRide && <StyledTableRow >
                            <StyledTableCell align="center">
                                <Select style={{ fontFamily: 'Open Sans Hebrew' }} value={selectedEventRide?.rideStartingPoint}>
                                    <MenuItem style={{ fontFamily: 'Open Sans Hebrew' }} value={selectedEventRide?.rideStartingPoint}>
                                        {getSingleCityItem()}
                                    </MenuItem> 
                                </Select>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                {event.eventName}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                {selectedEventRide.ridePrice}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                {selectedEventRide.ridePrice}
                            </StyledTableCell>
                        </StyledTableRow>}
                    </TableHead>
                        </Table>*/}
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
                            {` סה"כ לתשלום: ${selectedEventRide?.ridePrice ? selectedEventRide?.ridePrice : '0.00'} ${CURRENCY('heb')}`}
                        </p>
                        <Accordion style={{ background: 'whitesmoke', margin: '0px', borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }} expanded={expandedRides === true} onChange={() => handleSeeRidesToggle()}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <p style={{
                                    textAlign: 'right',
                                    color: 'rgb(0, 122, 255)',
                                    margin: '0px'
                                }}>
                                    {SHOW_RIDE_SELECT('heb')}</p>
                            </AccordionSummary>
                            <AccordionDetails>

                                <div dir="rtl" style={{padding:'8px',borderRadius:'4px', background:'white', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>

                                    <InfoRoundedIcon color="inherit" style={{ padding: '8px', cursor: 'pointer', width: '25px', height: '25px', alignSelf: 'center' }} />
                                    <span style={{ padding: '8px', fontWeight:'bold',color: 'black', alignSelf: 'center' }}>{ATTENTION('heb')}</span>
                                    <div dir="rtl" style={{ display: 'flex', flexDirection: 'row'}}>

                                        <span style={{maxWidth:'200px',fontSize:'16px', padding: '8px',width:'50%', color: 'black', float: 'left' }}>{BOTH_DIRECTIONS('heb')}</span>
                                        <span style={{maxWidth:'200px', fontSize:'16px',padding: '8px',width:'50%', color: 'black', float: 'right' }}>{NO_DELAYS('heb')}</span>
                                    </div>
                                </div>
                                <div style={{ color: 'black', padding: '8px' }}>{STARTING_POINT('heb')}</div>
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
                                                <span style={{ marginLeft: 'auto' }} dir='rtl'>{ride.ridePrice + " " + CURRENCY('heb')}</span>

                                            </div>
                                        </MenuItem>
                                    })}

                                    <AddCircleOutlineIcon color="inherit" style={{ cursor: 'pointer', width: '50px', height: '50px', alignSelf: 'center' }} />
                                    <span style={{ color: 'black' }}>{CANT_SEE_YOUR_CITY('heb')}</span>

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
                        }}>{START_DATE('heb')}<span>{event.eventDate + " " + event.eventHours.startHour}</span></p>
                        <p style={{
                            background: 'whitesmoke',
                            padding: '8px',

                            marginTop: '0px',
                            marginBottom: '0px',
                            textAlign: 'right'
                        }}>{ADDRESS('heb')}<span>{event.eventLocation}</span></p>
                        <Accordion style={{ background: 'whitesmoke', margin: '0px' }} expanded={expanded === true} onChange={() => handleSeeMoreToggle()}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <p style={{
                                    textAlign: 'right',
                                    color: 'rgb(0, 122, 255)',
                                    margin: '0px'
                                }}>
                                    {expanded ? HIDE_EXTRA_DETAILS('heb') : SHOW_EXTRA_DETAILS('heb')}</p>
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
    ) : <h1 dir='rtl'>{LOADING('heb')}</h1>)
}