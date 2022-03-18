import { Accordion, FormControl, TextField, AccordionDetails, AccordionSummary, Button, List, ListItem, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { LocalizationProvider, TimePicker } from "@mui/lab"
import { useFirebase } from "../context/Firebase";
import { useLanguage } from "../context/Language";
import { TextFieldProps } from '@mui/material'
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import $ from 'jquery'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { HIDE_EXTRA_DETAILS, SHOW_EXTRA_DETAILS, SIDE } from "../settings/strings";
import { PNPEvent, PNPPrivateEvent, PNPPrivateRide, PNPPublicRide, PNPRideConfirmation, PNPRideRequest, PNPUser } from "../store/external/types";
import { InnerPageHolder, PageHolder } from "./utilities/Holders";

import '../settings/mainstyles.css'
import { Unsubscribe } from "firebase/auth";
import axios from "axios";
import { request } from "http";
import { refEqual } from "firebase/firestore";
import { useLoading } from "../context/Loading";
import { v4 } from "uuid";
import { isValidPublicRide } from "../store/validators";
import { submitButton } from "../settings/styles";



/**
 * 
 * Temporary Admin Panel
 * TODO: This page should recieve an event to show ride statistics for
 * trans : ride transactions for a given event
 * requests: ride requests from users for a given event
 * users: given a ride request list , get all the users correspinding for the requests
 */

export default function AdminPanel() {


    const [trans, setTrans] = useState<any>()


    useEffect(() => {

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

                var hash: { [productName: string]: number; } = {};
                var hash2: { [productName: string]: Array<string> } = {}
                const filter: any = send.filter((x: any) => x.transactionProduct.includes('Live'))
                filter.forEach((e: any) => e.transactionProduct = e.transactionProduct.split(' מ -')[1].split(' ל -')[0])

                for (var T of filter) {
                    if (hash[T.transactionProduct]) {
                        hash[T.transactionProduct] += Number(T.transactionTotalAmount)
                    } else {
                        hash[T.transactionProduct] = T.transactionTotalAmount
                    }
                    if (hash2[T.transactionProduct]) {
                        hash2[T.transactionProduct].push(T.transactionUid)
                    } else {
                        hash2[T.transactionProduct] = [T.transactionUid]
                    }
                }
                setTrans({ hash1: hash, hash2: hash2 })
            })
        const unsub1 = firebase.realTime.getAllPublicEvents(setPublicEvents)
        const unsub2 = firebase.realTime.getAllPrivateEvents(setPrivateEvents)
        return () => { unsub1(); unsub2(); publicRidesSub && publicRidesSub(); privateRidesSub && privateRidesSub(); }
    }, [])
    const PublicEvents = () => {
        return (publicEvents ? <List className='list_events_admin'>
            {publicEvents.map(event => <Button key={v4()}

                onClick={() => {
                    if (currentViewingPublicRides) return
                    setPublicRidesSub(firebase.realTime.getPublicRidesByEventId(event.eventId, (e) => { setCurrentViewingPublicRides(e) }))
                }}
                sx={{ color: 'white', border: '1px solid black' }}
            >
                {event.eventName}
            </Button>)}
        </List> : null)
    }

    const [privateRidesSub, setPrivateRidesSub] = useState<Unsubscribe | null>()
    const [publicRidesSub, setPublicRidesSub] = useState<Unsubscribe | null>()
    const PrivateEvents = () => {
        return (privateEvents ? <List className='list_events_admin'>
            {privateEvents.map(event => <Button
                onClick={() => {
                    if (currentViewingPrivateRides) return
                    setPrivateRidesSub(firebase.realTime.getPrivateEventRidesById(event.eventId, setCurrentViewingPrivateRides))
                }}
                sx={{ color: 'white', border: '1px solid black' }}
            >
                {event.eventName}
            </Button>)}
        </List> : null)
    }
    const { user, appUser, firebase } = useFirebase()

    const [currentViewingPublicRides, setCurrentViewingPublicRides] = useState<PNPPublicRide[] | undefined>()
    const [currentViewingPrivateRides, setCurrentViewingPrivateRides] = useState<PNPPublicRide[] | undefined>()
    const { lang } = useLanguage()
    const [privateEvents, setPrivateEvents] = useState<PNPEvent[] | undefined>()
    const [publicEvents, setPublicEvents] = useState<PNPEvent[] | undefined>()


    const { openDialog, closeDialog, doLoad, cancelLoad, openDialogWithTitle } = useLoading()

    enum AdminScreens {

        rideTransactions, rideRequests
    }

    const [showingComponent, setShowingComponent] = useState<AdminScreens>(AdminScreens.rideTransactions)
    const ActionCard = () => {
        return <Stack spacing={3} dir={SIDE(lang)}>
            <Button style={{ background: 'whitesmoke', color: '#6495ED', textTransform: 'none' }}>Show Public Events</Button>
            <Button style={{ background: 'whitesmoke', color: '#6495ED', textTransform: 'none' }}>Show Private Events</Button>
        </Stack>
    }

    const ContentCard = () => {
        return <div style={
            { padding: '16px', background: 'gray', color: 'white' }
        }><PublicEvents /></div>
    }


    const AddEventRide = () => {



        const [ride, setRide] = useState<PNPPublicRide>({
            rideId: "",
            eventId: "ravepurim140322",
            rideDestination: "Live Park, שדרות מרילנד, ראשון לציון, ישראל",
            rideStartingPoint: "null",
            rideTime: "00:00",
            ridePrice: "null",
            backTime: "04:00",
            passengers: "",
            date: "18/03/2022"
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

            if (!appUser || !appUser.admin) {
                alert('אין לך גישה לפקודה זו')
                return
            }
            else if (isValidPublicRide(ride)) {
                doLoad()
                firebase.realTime.addPublicRide(ride.eventId, ride)
                    .then(() => {
                        cancelLoad()
                        alert(`הוספת נסיעה נוספת בהצלחה : \n נסיעה מ ${ride.rideStartingPoint} ל ${ride.rideDestination} \n בשעה : ${new Date(ride.rideTime).getTime()}`)
                    }).catch(() => {
                        cancelLoad()
                        alert('אירעתה שגיאה בהוספת ההסעה, אנא יידע את המתכנת')
                    })
            } else {
                alert('אנא וודא שמילאת נכון את כל השדות הדרושים')
            }

        }
        return <Stack spacing={2} sx={{ padding: '4px' }}>
            <label>{'הכנס נקודת יציאה'}</label>
            <TextField
                label={'נקודת יציאה'}
                required
                placeholder={'הכנס נקודת יציאה'}
                onChange={(e) => changeRideStartingPoint(e.target.value)}
            />
            <label>{'הכנס מחיר'}</label>
            <TextField
                label={'מחיר'}
                required
                placeholder={'הכנס מחיר'}
                name='price'
                inputProps={{ inputMode: 'decimal', max: 500, min: 1 }}
                type='number'
                onChange={(e) => changeRidePrice(e.target.value)}
            />
            <label>{'הכנס שעה'}</label>
            <TextField
                label={'שעה'}
                required
                placeholder={'00:00'}
                name='time'
                onChange={(e) => changeRideTime(e.target.value)}
            />
            <Button sx={{ ...submitButton(false), ...{ width: '100%' } }}
                onClick={() => createNewRide()}
            >{'הוסף הסעה'}</Button>
        </Stack>
    }


    const Requests = (props: { eventId: string }) => {


        const [requests, setRequests] = useState<PNPRideRequest[] | undefined>()



        useEffect(() => {
            $('.dim').css('display', 'none')
            const unsubscribe = firebase.realTime.addListenerToRideRequestsByEventId(props.eventId, setRequests)
            return () => unsubscribe()
        }, [])




        const [expand, setExpand] = useState<{ [id: string]: boolean }>({})
        const RequestCard = (props: { request: PNPRideRequest }) => {
            return (<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>  <Accordion sx={{ flexGrow: '1', overflowY: 'scroll', margin: '8px', background: 'whitesmoke' }}
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
                        color: 'rgb(0, 122, 255)',
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
                            {props.request.names.map(name => <div key={v4()} style={{ fontSize: '12px' }}>{name}</div>)}

                        </div>
                    </div>

                </AccordionDetails>
            </Accordion>{!expand[props.request.requestUserId + props.request.eventId] && <RemoveCircleIcon sx={{ flexGrow: '0', color: '#bd3333', cursor: 'pointer' }} onClick={() => {


                openDialog({
                    content: <div style={{ padding: '10px' }}> {`האם תרצה להסיר ביקוש זה (אישור, אי רלוונטיות)`} <br /><br />{`ביקוש מעת`} <b>{`${props.request.fullName}`}</b><br /><button
                        onClick={() => { firebase.realTime.removeRideRequest(props.request.eventId, props.request.requestUserId) }}
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

        return (requests ? <List sx={{ maxHeight: '400px', overflowY: 'scroll' }}>
            {Array.from(new Set(requests).values()).map(request => <RequestCard key={v4()} request={request} />)}
        </List> : null)


    }
    const Trans = (props: { hash: any }) => {
        const [n, setN] = useState<any>()

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
                            content: <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                overflowY: 'scroll',
                                padding: '8px',
                                maxHeight: '400px'
                            }}>{users.map((user: PNPUser) => <div key={v4()} style={{ padding: '8px', margin: '8px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{'מספר טלפון'}</div>
                                <div style={{ fontSize: '10px' }}>{user.phone}</div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{'שם מלא'}</div>
                                <div style={{ fontSize: '10px' }}>{user.name}</div>
                                <hr />
                            </div>)}</div>, title: ride
                        })
                    } else {
                        cancelLoad()
                    }
                }).catch(() => { cancelLoad(); openDialog({ content: <h2>{'אירעה שגיאה בהבאת המשתמשים'}</h2> }) })
        }
        useEffect(() => {
            const x: any = []
            if (props.hash) {
                $.each(props.hash.hash1, (k, v) => {
                    x.push({ k: k, v: v })
                })
                setN(x)
            }
        }, [])
        return <div >  <h1>{'כל ההסעות'} </h1>
            {n && n.length > 0 && <h4 style={{ fontWeight: '100', color: 'black' }}>{`סה"כ`} : <b>{n.reduce((before: any, p: any) => Number(before) + Number(p.v), 0)}</b></h4>}<div dir={'rtl'} style={{ overflowY: 'scroll', maxHeight: '400px' }}>
                {n && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: `repeat(${Math.floor(Object.keys(props.hash).length / 2)},1fr)` }}>
                    {n.map((each: any, index: number) => <div key={each.k + index} style={{ padding: '4px', margin: '4px', maxWidth: '200px', fontSize: '12px', fontWeight: 'bold' }}>
                        {each.k}
                        <div style={{ fontWeight: '500', padding: '4px' }}>
                            {each.v}
                        </div>
                        <button onClick={() => fetchUsersWithIds(each.k, props.hash.hash2[each.k])} style={{ margin: '4px', fontSize: '12px', padding: '4px', border: 'none', background: 'orange', color: 'white' }}>
                            {'הצג משתמשים'}
                        </button>
                        <hr /></div>)} </div>}
            </div></div>

    }

    const Confirmations = (props: { eventId: string }) => {


        const [confirmations, setConfirmations] = useState<PNPRideConfirmation[] | undefined | null>()
        useEffect(() => {
            const unsub = firebase.realTime.getAllRideConfirmationByEventId(props.eventId, setConfirmations)
            return () => unsub()
        }, [])

        return (<Stack dir={'rtl'} style={{ padding: '8px' }}>
            <div style={{ fontWeight: 'bold' }}>{'אישורים להורדה בהדרים: '}</div>
            {confirmations && confirmations.filter(confirmation => confirmation.directions.split('to')[1].includes('הדרים')).length}

            <div style={{ fontWeight: 'bold' }}>{'אישורים להורדה בשחר: '}</div>
            {confirmations && confirmations.filter(confirmation => confirmation.directions.split('to')[1].includes('שחר')).length}
        </Stack>)
    }

    return (<PageHolder>
        <InnerPageHolder style={{ overflowY: 'hidden' }} >
            <Confirmations eventId="hadarimprom" />
            <Button
                dir={'rtl'}
                sx={{ background: 'white', color: '#bd3333', margin: '8px' }}

                onClick={() => {
                    openDialogWithTitle(<h3 style={{
                        fontWeight: '14px',
                        textAlign: 'center',
                        padding: '8px',
                    }}>{'הוסף הסעה ל B-Kush Purim Live park'}</h3>)
                    openDialog({ content: <AddEventRide /> })
                }}>
                {'הוסף הסעה ל B-Kush Purim Live park'}
            </Button>
            <Button
                sx={{ background: 'white', color: '#bd3333' }}
                onClick={() => showingComponent === AdminScreens.rideTransactions ? setShowingComponent(AdminScreens.rideRequests) : setShowingComponent(AdminScreens.rideTransactions)}>{showingComponent === AdminScreens.rideTransactions ? 'עבור לביקושים' : 'עבור להזמנות'}</Button>
            {showingComponent === AdminScreens.rideTransactions ? <Trans hash={trans} /> : <Requests eventId="ravepurim140322" />}
        </InnerPageHolder>
    </PageHolder>)

}