import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useLoading } from "../../context/Loading";
import { BLACK_ROYAL, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, ORANGE_RED_GRADIENT_BUTTON, PRIMARY_BLACK, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import { PNPPrivateEvent, PNPPublicRide, PNPRideConfirmation } from "../../store/external/types";
import EditIcon from '@mui/icons-material/Edit';
import { InnerPageHolder, PageHolder } from "../utilities/Holders";
import AddUpdateEventInvitation from "./AddUpdateEventInvitation";
import { Button, List, Stack, Table, TableBody, TableRow } from "@mui/material";
import SectionTitle from "../SectionTitle";
import Spacer from "../utilities/Spacer";
import AddUpdatePrivateEventRide from "./AddUpdatePrivateEventRide";
import { useFirebase } from "../../context/Firebase";
import { Unsubscribe } from "firebase/database";
import { v4 } from "uuid";



export default function InvitationStatistics() {



    const location = useLocation()

    const { openDialog, openDialogWithTitle, closeDialog } = useLoading()
    const { firebase } = useFirebase()

    const [confirmations, setConfirmations] = useState<PNPRideConfirmation[] | null>(null)
    const [rides, setRides] = useState<PNPPublicRide[] | null>(null)
    const buttonStyle = {
        textDecoration: 'none',
        borderRadius: '16px',
        fontFamily: 'Open Sans Hebrew',
        background: DARK_BLACK,
        color: SECONDARY_WHITE
    }
    const privateEvent = location.state as PNPPrivateEvent ? location.state as PNPPrivateEvent : undefined
    useEffect(() => {

        let unsub: Unsubscribe | undefined
        let unsub2: Unsubscribe | undefined
        if (privateEvent) {
            unsub = firebase.realTime.getAllRideConfirmationByEventId(privateEvent.eventId, setConfirmations)
            unsub2 = firebase.realTime.getPrivateEventRidesById(privateEvent.eventId, setRides)
        }
        return () => { unsub && (unsub as Unsubscribe)(); unsub2 && (unsub2 as Unsubscribe)(); }
    }, [])

    const spanStyle = {
        color: SECONDARY_WHITE
    }

    const link = privateEvent ? ('https://pick-n-pull.co.il/#/invitation/' + privateEvent.eventId) : ''



    const PrivateRides = (props: { rides: PNPPublicRide[], event: PNPPrivateEvent }) => {
        return (<List>
            <h1 style={{ color: SECONDARY_WHITE }}>{'ניהול נסיעות'}</h1>
            {props.rides.length > 0 ? <table dir={'rtl'} style={{ width: '100%' }}  >

                <thead>
                    <tr style={{ background: 'black', color: SECONDARY_WHITE }}>
                        <th>
                            <span style={{ color: SECONDARY_WHITE }}>{`שם הסעה`}</span>
                        </th>
                        <th>
                            <span style={{ color: SECONDARY_WHITE }}>{'פעולות'}</span>
                        </th>
                    </tr>
                </thead>

                <tbody >
                    {props.rides.map((ride, index) =>
                        <tr key={v4()} style={{ background: PRIMARY_BLACK }}>
                            <th style={{ width: '50%', padding: '8px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: SECONDARY_WHITE }}>{'נקודת יציאה'}</div>
                                <div style={{ fontSize: '10px', fontWeight: '100', color: SECONDARY_WHITE }}>{ride.rideStartingPoint}</div>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: SECONDARY_WHITE }}>{'שעת יציאה'}</div>
                                <div style={{ fontSize: '10px', fontWeight: '100', color: SECONDARY_WHITE }}>{ride.rideTime}</div>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: SECONDARY_WHITE }}>{'מחיר'}</div>
                                <div style={{ fontSize: '10px', fontWeight: '100', color: SECONDARY_WHITE }}>{ride.ridePrice}</div>
                            </th>
                            <th style={{ width: '50%', padding: '8px' }}>

                                {<Button
                                    onClick={() => {
                                        openDialogWithTitle(<div style={{ background: ORANGE_GRADIENT_PRIMARY }}><h3 style={
                                            {
                                                fontWeight: '14px',
                                                textAlign: 'center'
                                            }
                                        }>{`עריכת הסעה לאירוע: ${props.event.eventTitle}`}</h3>
                                            <h4 style={
                                                {
                                                    fontWeight: '12px',
                                                    textAlign: 'center'
                                                }
                                            }>{`נקודת יציאה : ${ride.rideStartingPoint}`}</h4></div>)
                                        openDialog({ content: <AddUpdatePrivateEventRide event={props.event} ride={ride} />, title: `עריכת הסעה לאירוע` })
                                    }}
                                    style={{ color: SECONDARY_WHITE, border: '.1px solid black', background: DARK_BLACK }}>
                                    {`ערוך`}
                                </Button>}

                                {<Button key={v4()}
                                    onClick={() => {
                                        openDialogWithTitle(<div><h3 style={
                                            {
                                                fontWeight: '14px',
                                                textAlign: 'center',
                                                padding: '8px',
                                            }
                                        }>{`מחיקת הסעה לאירוע ${props.event.eventTitle}`}</h3>
                                            <h4 style={
                                                {
                                                    fontWeight: '12px',
                                                    textAlign: 'center',
                                                    padding: '8px',
                                                }
                                            }>{`נקודת יציאה ${ride.rideStartingPoint}`}</h4></div>)
                                        openDialog({
                                            content: <div style={{ padding: '4px' }}><button
                                                onClick={() => { firebase.realTime.removePrivateRide(props.event.eventId, ride.rideId).then(() => { closeDialog() }).catch(() => { closeDialog() }) }}
                                                style={{
                                                    padding: '4px',
                                                    margin: '16px',
                                                    minWidth: '100px',
                                                    fontSize: '18px',
                                                    background: ORANGE_RED_GRADIENT_BUTTON,
                                                    color: SECONDARY_WHITE
                                                }}>{'מחק'}</button></div>, title: `מחיקת הסעה לאירוע`
                                        })
                                    }}
                                    style={{ color: SECONDARY_WHITE, margin: '4px', border: '1px solid black', background: '#bd3333' }}>
                                    {`מחק`}
                                </Button>}
                            </th>
                        </tr>)}
                </tbody>
            </table> : <h4>{'אין נסיעות לאירוע זה'}</h4>}


        </List>)
    }
    return <PageHolder>
        {privateEvent && <SectionTitle style={{}} title={privateEvent.eventTitle} />}
        {privateEvent ? <InnerPageHolder style={{ direction: 'rtl', background: BLACK_ROYAL }}>

            <Stack spacing={2}>

                <div><span style={spanStyle} >{'קישור לדף הזמנה : '}</span>
                    <a style={spanStyle} href={link}>לחץ כאן</a></div>
                <Button
                    onClick={() => {
                        openDialog({ content: <AddUpdateEventInvitation event={privateEvent} /> })
                    }}
                    style={{ ...buttonStyle, ...{ background: 'linear-gradient(#282c34,black)', fontWeight: 'bold' } }}>
                    {'עריכת אירוע'}
                    <EditIcon style={{ marginLeft: '4px', width: '20px', height: '20px' }} />
                </Button>

                <Button
                    dir={'rtl'}
                    style={buttonStyle}

                    onClick={() => {

                        privateEvent && openDialog({
                            content: <div style={{ padding: '16px' }}>
                                <h3 style={{
                                    fontWeight: '14px',
                                    background: PRIMARY_BLACK,
                                    color: SECONDARY_WHITE,
                                    padding: '4px',
                                    textAlign: 'center'
                                }}>{`הוסף הסעה ל ${privateEvent.eventTitle}`}</h3>
                                <AddUpdatePrivateEventRide event={privateEvent} />
                            </div>
                        })
                    }}>

                    {privateEvent ? `הוסף הסעה` : ''}
                </Button>
                {confirmations && <Stack>
                    <span style={spanStyle}>{'מספר אישורי הגעה: '}</span>
                    <span style={spanStyle}>{confirmations.reduce((prev, next) => prev
                        + (next.passengers ? Number(next.passengers) : 1), 0)}</span>
                </Stack>}


                {rides && <PrivateRides event={privateEvent} rides={rides} />}
            </Stack>


        </InnerPageHolder> : <h3 style={{ color: SECONDARY_BLACK }}>אירוע פרטי לא נמצא</h3>}
    </PageHolder>
}