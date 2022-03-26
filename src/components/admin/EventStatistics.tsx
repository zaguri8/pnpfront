import { Accordion, TextField, AccordionDetails, AccordionSummary, Button, List, Stack } from "@mui/material";
import { useEffect, useState } from "react";

import { useFirebase } from "../../context/Firebase";
import { useLanguage } from "../../context/Language";
import $ from 'jquery'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { SIDE } from "../../settings/strings";
import { PNPEvent, PNPPublicRide, PNPRideRequest, PNPUser } from "../../store/external/types";
import { InnerPageHolder, PageHolder } from "../utilities/Holders";

import '../../settings/mainstyles.css'
import axios from "axios";
import { useLoading } from "../../context/Loading";
import { v4 } from "uuid";
import { isValidPublicRide } from "../../store/validators";
import { submitButton } from "../../settings/styles";
import { useLocation } from "react-router";
import SectionTitle from "../SectionTitle";
import { DARKER_BLACK_SELECTED, DARK_BLACK, PRIMARY_BLACK, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";



const Rides = (props: { rides: PNPPublicRide[], event: PNPEvent }) => {
    const { openDialog, openDialogWithTitle, closeDialog } = useLoading()

    const { firebase } = useFirebase()
    return (<List>
        <h1 style = {{color:SECONDARY_WHITE}}>{'ניהול נסיעות'}</h1>
        {props.rides.length > 0 ? <table dir={'rtl'} style={{ width: '100%' }}  >

            <thead>
                <tr style={{ background: 'black', color: 'white' }}>
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
                    <tr key={v4()} style={{ background: index % 2 === 0 ? PRIMARY_BLACK : SECONDARY_BLACK}}>
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
                                    openDialogWithTitle(<div><h3 style={
                                        {
                                            fontWeight: '14px',
                                            textAlign: 'center'
                                        }
                                    }>{`עריכת הסעה לאירוע ${props.event.eventName}`}</h3>
                                        <h4 style={
                                            {
                                                fontWeight: '12px',
                                                textAlign: 'center'
                                            }
                                        }>{`נקודת יציאה : ${ride.rideStartingPoint}`}</h4></div>)
                                    openDialog({ content: <AddUpdateEventRide event={props.event} ride={ride} />, title: `עריכת הסעה לאירוע` })
                                }}
                                style={{ color: 'white', border: '.1px solid black', background: DARK_BLACK }}>
                                {`ערוך הסעה`}
                            </Button>}

                            {<Button key={v4()}
                                onClick={() => {
                                    openDialogWithTitle(<div><h3 style={
                                        {
                                            fontWeight: '14px',
                                            textAlign: 'center',
                                            padding: '8px',
                                        }
                                    }>{`מחיקת הסעה לאירוע ${props.event.eventName}`}</h3>
                                        <h4 style={
                                            {
                                                fontWeight: '12px',
                                                textAlign: 'center',
                                                padding: '8px',
                                            }
                                        }>{`נקודת יציאה ${ride.rideStartingPoint}`}</h4></div>)
                                    openDialog({
                                        content: <div style={{ padding: '4px' }}><button
                                            onClick={() => { firebase.realTime.removePublicRide(props.event.eventId, ride.rideId).then(() => { closeDialog() }).catch(() => { closeDialog() }) }}
                                            style={{
                                                padding: '4px',
                                                margin: '16px',
                                                minWidth: '100px',
                                                fontSize: '18px',
                                                background: '#bd3333',
                                                color: 'white'
                                            }}>{'מחק'}</button></div>, title: `מחיקת הסעה לאירוע`
                                    })
                                }}
                                style={{ color: 'white', margin: '4px', border: '1px solid black', background: '#bd3333' }}>
                                {`מחק הסעה`}
                            </Button>}
                        </th>
                    </tr>)}
            </tbody>
        </table> : <h4>{'אין נסיעות לאירוע זה'}</h4>}


    </List>)
}
const AddUpdateEventRide = (props: { ride?: PNPPublicRide, event: PNPEvent }) => {

    const { cancelLoad, doLoad, closeDialog } = useLoading()
    const { firebase } = useFirebase()
    const [ride, setRide] = useState<PNPPublicRide>(props.ride ? props.ride : {
        rideId: "null",
        eventId: props.event.eventId,
        rideDestination: props.event.eventName,
        rideStartingPoint: "null",
        rideTime: "00:00",
        ridePrice: "null",
        backTime: "04:00",
        passengers: "",
        date: props.event.eventDate
    })

    const changeRideStartingPoint = (newStartPoint: string) => {
        setRide({
            ...ride,
            rideStartingPoint: newStartPoint
        })
    }

    const changeRidePrice = (newPrice: string) => {
        setRide({
            ...ride,
            ridePrice: newPrice
        })
    }
    const changeRideTime = (newTime: string) => {
        setRide({
            ...ride,
            rideTime: newTime
        })
    }

    const createNewRide = () => {
        if (isValidPublicRide(ride)) {
            doLoad()

            if (props.ride) {
                firebase.realTime.updatePublicRide(props.event.eventId, ride.rideId, ride)
                    .then(() => {
                        cancelLoad()
                        closeDialog()
                        alert(`ערכת נסיעה בהצלחה : \n נסיעה מ ${ride.rideStartingPoint} ל ${ride.rideDestination} \n בשעה : ${ride.rideTime}`)
                    }).catch((e) => {
                        cancelLoad()
                        closeDialog()
                        alert('אירעתה שגיאה בעריכת ההסעה, אנא יידע את המתכנת')
                    })
            } else {

                firebase.realTime.addPublicRide(ride.eventId, ride)
                    .then(() => {
                        cancelLoad()
                        closeDialog()
                        alert(`הוספת נסיעה נוספת בהצלחה : \n נסיעה מ ${ride.rideStartingPoint} ל ${ride.rideDestination} \n בשעה : ${ride.rideTime}`)
                    }).catch(() => {
                        cancelLoad()
                        closeDialog()
                        alert('אירעתה שגיאה בהוספת ההסעה, אנא יידע את המתכנת')
                    })
            }

        } else {
            alert('אנא וודא שמילאת נכון את כל השדות הדרושים')
        }

    }
    return <Stack spacing={2} sx={{ padding: '4px' }}>
        <label style={{ color: SECONDARY_WHITE }}>{'הכנס נקודת יציאה'}</label>
        <TextField
            autoComplete=""
            required
            InputLabelProps={{
                style: { color: SECONDARY_WHITE },
            }}
            style={{ color: SECONDARY_WHITE }}
            placeholder={props.ride ? props.ride.rideStartingPoint : 'נקודת יציאה'}
            onChange={(e) => changeRideStartingPoint(e.target.value)}
        />
        <label style={{ color: SECONDARY_WHITE }}>{'הכנס מחיר'}</label>
        <TextField
            required
            InputLabelProps={{

                style: { color: SECONDARY_WHITE },
            }}
            placeholder={props.ride ? props.ride.ridePrice : 'מחיר'}
            name='price'
            style={{ color: SECONDARY_WHITE }}
            inputProps={{ inputMode: 'decimal', max: 500, min: 1 }}
            type='number'
            onChange={(e) => changeRidePrice(e.target.value)}
        />
        <label style={{ color: SECONDARY_WHITE }}> {'הכנס שעה'}</label>
        <TextField
            InputLabelProps={{
                style: { color: SECONDARY_WHITE },
            }}
            required
            style={{ color: SECONDARY_WHITE }}

            placeholder={props.ride ? props.ride.rideTime : '00:00'}
            name='time'
            onChange={(e) => changeRideTime(e.target.value)}
        />
        <Button sx={{ ...submitButton(false), ...{ width: '100%' } }}
            onClick={() => createNewRide()}
        >{props.ride ? 'ערוך הסעה' : 'הוסף הסעה'}</Button>
    </Stack>
}



const Requests = (props: { eventId: string, requests?: PNPRideRequest[] }) => {


    const { firebase } = useFirebase()
    const { openDialog, closeDialog } = useLoading()

    useEffect(() => {
        $('.dim').css('display', 'none')

    }, [])




    const [expand, setExpand] = useState<{ [id: string]: boolean }>({})
    const RequestCard = (props: { request: PNPRideRequest }) => {


        return (<span style={{ display: 'flex', color: SECONDARY_WHITE, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>

            <Accordion sx={{ flexGrow: '1', overflowY: 'scroll', margin: '8px', background: 'whitesmoke' }}
                expanded={expand[props.request.requestUserId + props.request.eventId]} onClick={() => {
                    setExpand({
                        ...expand,
                        // dynamically changing property
                        [props.request.requestUserId + props.request.eventId]: !expand[props.request.requestUserId + props.request.eventId]
                    })

                }}>
                <AccordionSummary dir={'rtl'} aria-controls="panel1d-content" id="panel1d-header">
                    <p style={{
                        textAlign: 'right',
                        color: SECONDARY_WHITE,
                        margin: '0px',
                        fontSize: '12px'
                    }}>
                        {expand[props.request.eventId] ? 'הסתר ביקוש ' + " של " + props.request.fullName : 'ביקוש ' + " של " + props.request.fullName}</p>
                </AccordionSummary>
                <AccordionDetails>

                    <div dir={'rtl'} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>


                        <div style={{ display: 'flex', minWidth: '80px', width: '33.3%', flexDirection: 'column', padding: '4px', justifyContent: 'center', alignItems: 'center' }}>


                            <div style={{ fontSize: '14px' }}>{"אירוע מדובר"}</div>
                            <div style={{ fontSize: '12px' }}>{props.request.eventName}</div>
                            <div style={{ fontSize: '14px' }} >{"מספר נוסעים"}</div>
                            <div style={{ fontSize: '12px' }}>{props.request.passengers}</div>
                            <div style={{ fontSize: '14px' }}>{"נקודת יציאה"}</div>
                            <div style={{ fontSize: '12px' }}>{props.request.startingPoint}</div>
                        </div>
                        <div style={{ display: 'flex', width: '33.3%', minWidth: '80px', flexDirection: 'column', padding: '4px', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ fontSize: '14px' }}>{"שם המבקש"}</div>
                            <div style={{ fontSize: '12px' }}>{props.request.fullName}</div>
                            <div style={{ fontSize: '14px' }}>{'מספר טלפון'}</div>
                            <div style={{ fontSize: '12px' }}>{props.request.phoneNumber}</div>

                        </div>
                        <div style={{ display: 'flex', minWidth: '80px', width: '33.3%', flexDirection: 'column', padding: '4px', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ fontSize: '14px' }}>{"נוסעים נוספים"}</div>
                            {props.request.names.map((name: any) => <div key={v4()} style={{ fontSize: '12px' }}>{name}</div>)}

                        </div>
                    </div>

                </AccordionDetails>
            </Accordion>{!expand[props.request.requestUserId + props.request.eventId] && <RemoveCircleIcon sx={{ flexGrow: '0', color: '#bd3333', cursor: 'pointer' }} onClick={() => {
                openDialog({
                    content: <div style={{ padding: '10px' }}> {`האם תרצה להסיר ביקוש זה (אישור, אי רלוונטיות)`} <br /><br />{`ביקוש מעת`} <b>{`${props.request.fullName}`}</b><br /><button
                        onClick={() => { firebase.realTime.removeRideRequest(props.request.eventId, props.request.requestUserId).then(() => { closeDialog() }).catch(() => { closeDialog() }) }}
                        style={{
                            padding: '4px',
                            margin: '16px',
                            minWidth: '100px',
                            fontSize: '18px',
                            background: '#bd3333',
                            color: 'white'
                        }}>{'הסר'}</button></div>
                })
            }} />}</span>)
    }

    return (props.requests ? <div>
        <h1 style = {{color:SECONDARY_WHITE}}>{'בקשות להסעה'}</h1>
        <List sx={{ maxHeight: '400px', overflowY: 'scroll' }}>
            {Array.from(new Set(props.requests).values()).map(request => <RequestCard key={v4()} request={request} />)}
        </List></div> : <h4 style = {{color:SECONDARY_WHITE}}>{'אין בקשות לאירוע זה'}</h4>)


}
enum AdminScreens {
    ridesOverview, rideTransactions, rideRequests
}

type RideStatistics = {
    rideStatistics: { [rideStartingPoint: string]: number; }
    rideTransactionUserIds: { [rideStartingPoint: string]: Array<string> }
}



const EventRideStatistics = (props: { statistics: RideStatistics }) => {
    const [objectsFromStatistics, setObjectsFromStatistics] = useState<{ rideStartPoint: string | number, numberOfPeople: number }[]>()

    const { doLoad, openDialog, openDialogWithTitle, cancelLoad } = useLoading()
    const { firebase } = useFirebase()

    function CustomerCardContainer(props: { users: PNPUser[] }) {

        const CustomerCard = (props: { user: PNPUser }) => {
            return <div style={{
                padding: '8px',
                margin: '8px'
            }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: SECONDARY_WHITE
                }}>{'מספר טלפון'}</div>
                <div style={{
                    color: SECONDARY_WHITE,
                    fontSize: '10px'
                }}>{props.user.phone}</div>
                <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: SECONDARY_WHITE
                }}>{'שם מלא'}</div>
                <div style={{
                    color: SECONDARY_WHITE,
                    fontSize: '10px'
                }}>{props.user.name}</div>
                <hr />
            </div>
        }
        return (<div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowY: 'scroll',
            padding: '8px',
            maxHeight: '400px'
        }}>{props.users.map((user: PNPUser) => <CustomerCard key={v4()} user={user} />)}</div>);
    }


    const fetchUsersWithIds = async (ride: string, ids: string[]) => {
        doLoad()
        await firebase.realTime.getAllUsersByIds(ids)
            .then((users: PNPUser[] | null) => {
                if (users && users.length > 0) {
                    cancelLoad()
                    openDialogWithTitle(<h3 style={
                        {
                            fontWeight: '14px',
                            textAlign: 'center',
                            padding: '8px',
                        }
                    }>{ride}</h3>)
                    openDialog({
                        content: <CustomerCardContainer users={users} />,
                        title: ride
                    })
                } else {
                    cancelLoad()
                }
            }).catch(() => { cancelLoad(); openDialog({ content: <h2>{'אירעה שגיאה בהבאת המשתמשים'}</h2> }) })
    }
    useEffect(() => {
        const rideStatistics: { rideStartPoint: string | number, numberOfPeople: number }[] = []
        if (props.statistics) {
            $.each(props.statistics.rideStatistics, (k, v) => {
                rideStatistics.push({ rideStartPoint: k, numberOfPeople: v })
            })
            setObjectsFromStatistics(rideStatistics)
        }
    }, [])
    return <div >  <h1 style = {{color:SECONDARY_WHITE}}>{'סטטיסטיקה ונתוני הזמנות'} </h1>
        {objectsFromStatistics && objectsFromStatistics.length > 0 ? <div> {<h4 style={{ fontWeight: '100', color: SECONDARY_WHITE }}>{`סה"כ`} : <b>{objectsFromStatistics.reduce((before: any, p: any) => Number(before) + Number(p.numberOfPeople), 0)}</b></h4>}<div dir={'rtl'} style={{color:SECONDARY_WHITE, overflowY: 'scroll', maxHeight: '400px' }}>
            {objectsFromStatistics && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: `repeat(${Math.floor(Object.keys(props.statistics.rideStatistics).length / 2)},1fr)` }}>
                {objectsFromStatistics.map((each: any, index: number) => <div key={each.rideStartPoint + index} style={{ padding: '4px', margin: '4px', maxWidth: '200px', fontSize: '12px', fontWeight: 'bold' }}>
                    {each.rideStartPoint}
                    <div style={{ fontWeight: '500', padding: '4px' }}>
                        {each.numberOfPeople}
                    </div>
                    <button onClick={() => fetchUsersWithIds(each.rideStartPoint, props.statistics.rideTransactionUserIds[each.rideStartPoint])} style={{ margin: '4px', fontSize: '12px', padding: '4px', border: 'none', background: DARKER_BLACK_SELECTED, color: 'white' }}>
                        {'הצג משתמשים'}
                    </button>
                    <hr /></div>)} </div>}
        </div>
        </div> : <h4>{'אין הזמנות לאירוע זה'}</h4>}
    </div>

}
const ShowingPanelScreen = (props: { event: PNPEvent, rides: PNPPublicRide[], requests: PNPRideRequest[], statistics: RideStatistics, showingComponent: AdminScreens }) => {
    return props.showingComponent === AdminScreens.ridesOverview ?
        <Rides rides={props.rides} event={props.event} /> : props.showingComponent === AdminScreens.rideTransactions ?
            <EventRideStatistics statistics={props.statistics} /> : <Requests requests={props.requests} eventId={props.event.eventId} />
}

/**
 * 
 * Temporary Admin Panel
 * TODO: This page should recieve an event to show ride statistics for
 * trans : ride transactions for a given event
 * requests: ride requests from users for a given event
 * users: given a ride request list , get all the users correspinding for the requests
 */

export default function EventStatistics() {
    const location = useLocation()
    const event: PNPEvent | null = location.state ? location.state as PNPEvent : null
    const [showingComponent, setShowingComponent] = useState<AdminScreens>(AdminScreens.rideTransactions)

    const [statistics, setStatistics] = useState<RideStatistics | null>(null)
    const [rides, setRides] = useState<PNPPublicRide[] | null>(null)
    const { firebase } = useFirebase()
    const { lang } = useLanguage()
    const { openDialog, closeDialog, doLoad, cancelLoad, openDialogWithTitle } = useLoading()
    const [requests, setRequests] = useState<PNPRideRequest[] | null>(null)
    useEffect(() => {
        if (event) {
            doLoad()
            axios.post('https://nadavsolutions.com/gserver/transactions', { uid: undefined }, { headers: { 'Content-Type': 'application/json' } })
                .then(response => {
                    const send = response.data.map((transaction: any) => ({
                        transactionDate: transaction.transaction.date,
                        transactionProduct: transaction.transaction.more_info,
                        transactionTotalAmount: transaction.data.items[0].quantity,
                        transactionId: transaction.transaction_uid,
                        transactionUid: transaction.data.customer_uid,
                        transactionTotalPrice: transaction.transaction.amount,
                        status_description: transaction.transaction.status_code === '000' ? 'Success' : 'Failure'
                    }))

                    const rideStatistics: { [rideStartingPoint: string]: number; } = {};
                    const rideTransactionUserIds: { [rideStartingPoint: string]: Array<string> } = {}
                    const filteredTransactions: any = send.filter((transaction: any) => transaction.transactionProduct.includes(event.eventName))
                    filteredTransactions.forEach((transaction: any) => transaction.transactionProduct = transaction.transactionProduct.split(' מ -')[1].split(' ל -')[0])

                    for (const transaction of filteredTransactions) {
                        if (rideStatistics[transaction.transactionProduct]) {
                            rideStatistics[transaction.transactionProduct] += Number(transaction.transactionTotalAmount)
                        } else {
                            rideStatistics[transaction.transactionProduct] = transaction.transactionTotalAmount
                        }
                        if (rideTransactionUserIds[transaction.transactionProduct]) {
                            rideTransactionUserIds[transaction.transactionProduct].push(transaction.transactionUid)
                        } else {
                            rideTransactionUserIds[transaction.transactionProduct] = [transaction.transactionUid]
                        }
                    }

                    setStatistics({ rideStatistics: rideStatistics, rideTransactionUserIds: rideTransactionUserIds })
                    cancelLoad()
                }).catch(() => { cancelLoad() })
        }

        const unsub = event ? firebase.realTime.addListenerToRideRequestsByEventId(event.eventId, setRequests) : null

        const unsub2 = event ? firebase.realTime.getPublicRidesByEventId(event.eventId, (e) => {
            setRides(e)
        }) : null

        return () => { unsub && unsub(); unsub2 && unsub2() }
    }, [])

    const ActionCard = () => {
        return <Stack spacing={3} dir={SIDE(lang)}>
            <Button style={{ background: 'whitesmoke', color: '#6495ED', textTransform: 'none' }}>Show Public Events</Button>
            <Button style={{ background: 'whitesmoke', color: '#6495ED', textTransform: 'none' }}>Show Private Events</Button>
        </Stack>
    }




    return (event ? <PageHolder>
        <SectionTitle style={{ direction: 'rtl' }} title={`${event.eventName}`} />
        <span style={{ color: SECONDARY_WHITE }}>{'ניהול הסעות לאירוע'}</span>
        <InnerPageHolder style={{ overflowY: 'hidden' }} >
            <Stack spacing={3} style={{ width: '75%' }}>


                <Button
                    dir={'rtl'}
                    style={{ background: DARK_BLACK, color: 'white' }}

                    onClick={() => {
                        event && openDialogWithTitle(<h3 style={{
                            fontWeight: '14px',
                            textAlign: 'center'
                        }}>{`הוסף הסעה ל ${event.eventName}`}</h3>)
                        event && openDialog({ content: <AddUpdateEventRide event={event} /> })
                    }}>
                    {event ? `הוסף הסעה` : ''}
                </Button>

                <Button
                    style={{ background: DARK_BLACK, color: 'white' }}
                    onClick={() => { setShowingComponent(AdminScreens.rideTransactions) }}>
                    {'סטטיסטיקת הזמנות'}
                </Button>

                <Button
                    style={{ background: DARK_BLACK, color: 'white' }}
                    onClick={() => { setShowingComponent(AdminScreens.ridesOverview) }}>
                    {'ניהול נסיעות'}
                </Button>

                <Button
                    style={{ background: DARK_BLACK, color: 'white' }}
                    onClick={() => { setShowingComponent(AdminScreens.rideRequests) }}>
                    {'בקשות נסיעה'}
                </Button>
            </Stack>
            {statistics && event && <ShowingPanelScreen
                statistics={statistics}
                requests={requests ?? []}
                rides={rides ?? []}
                event={event}
                showingComponent={showingComponent} />}
        </InnerPageHolder>
    </PageHolder> : <div>{'לא קיים לאירוע זה דף ניהול'}</div>)

}