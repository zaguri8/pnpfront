import { Accordion, TextField, MenuItem, Checkbox, Select, AccordionDetails, AccordionSummary, Button, List, Stack, alertTitleClasses } from "@mui/material";
import React, { useEffect, useState } from "react";

import { useFirebase } from "../../context/Firebase";
import { Unsubscribe } from "firebase/database";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { whatsappIcon } from '../../assets/images.js'
import { useLanguage } from "../../context/Language";
import $ from 'jquery'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { SAME_SPOT, SIDE } from "../../settings/strings";
import { PNPEvent, PNPPublicRide, PNPRideRequest, PNPTransactionConfirmation, PNPUser } from "../../store/external/types";
import { InnerPageHolder, PageHolder } from "../utilityComponents/Holders";

import '../../settings/mainstyles.css'
import axios from "axios";
import { useLoading } from "../../context/Loading";
import { v4 } from "uuid";
import { isValidPublicRide } from "../../store/validators";
import { elegantShadow, submitButton, textFieldStyle } from "../../settings/styles";
import { useLocation, useNavigate } from "react-router";
import SectionTitle from "../other/SectionTitle";
import { BLACK_ELEGANT, BLACK_ROYAL, DARKER_BLACK_SELECTED, ORANGE_GRADIENT_PRIMARY, ORANGE_RED_GRADIENT_BUTTON, PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_PINK, RED_ROYAL, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import Spacer from "../utilityComponents/Spacer";
import { makeStyles } from "@mui/styles";
import AddUpdateEventRide from "./AddUpdateEventRide";
import AddUpdateEvent from "./AddUpdateEvent";
import { base64 } from "@firebase/util";
import EventLinkRedirect from "./EventLinkRedirect";
import ScannerPermissions from "./ScannerPermissions";
import { useBackgroundExtension, useHeaderBackgroundExtension } from "../../context/HeaderContext";

export type PNPRideExtraPassenger = {
    fullName: string,
    phoneNumber: string
}

export type PNPEventRidePurchaseData = { [rideStartingPoint: string]: { amount: number, users: { uid: string, extraPeople: PNPRideExtraPassenger[] }[] } }

export type RideStatistics = {
    amount: string
    uid: string
    extraPeople: PNPRideExtraPassenger[]
    rideStartPoint: string
}

enum AdminScreens {
    ridesOverview, rideTransactions, rideRequests
}

export default function EventStatistics() {
    const location = useLocation()
    const [event, setEvent] = useState<PNPEvent | null>(location.state ? location.state as PNPEvent : null)
    const [showingComponent, setShowingComponent] = useState<AdminScreens>(AdminScreens.rideTransactions)
    const [objectsFromStatistics, setObjectsFromStatistics] = useState<PNPEventRidePurchaseData>()
    const [total, setTotal] = useState(0)
    const [barCodes, setBarCodes] = useState<PNPTransactionConfirmation[] | undefined>()
    const [statistics, setStatistics] = useState<RideStatistics[] | null>(null)
    const [rides, setRides] = useState<PNPPublicRide[] | null>(null)
    const { firebase } = useFirebase()
    const { lang } = useLanguage()
    const { openDialog, openDialogWithBottom, closeDialog, doLoad, cancelLoad, openDialogWithTitle } = useLoading()
    const [requests, setRequests] = useState<PNPRideRequest[] | null>(null)
    const [sortedRequests, setSortedRequests] = useState<{ startPoint: string, rideRequests: PNPRideRequest[] }[]>()
    useEffect(() => {
        let unsub3: Unsubscribe | null = null
        let unsub2: Unsubscribe | null = null
        let unsub: Unsubscribe | null = null
        if (event) {
            doLoad()
            unsub3 = firebase.realTime.getAllTransactionsForEvent(event.eventId, (stats) => {
                setStatistics(stats)
                cancelLoad()
            }, (e) => {
                cancelLoad()
            })


            unsub = event ? firebase.realTime.addListenerToRideRequestsByEventId(event.eventId, setRequests) : null

            unsub2 = event ? firebase.realTime.getPublicRidesByEventId(event.eventId, (e) => {
                setRides(e)
            }) : null
        }
        return () => { unsub && unsub(); unsub2 && unsub2(); unsub3 && unsub3() }
    }, [])
    const { hideHeader, showHeader } = useHeaderBackgroundExtension()
    useEffect(() => {
        hideHeader()
        return () => showHeader()
    }, [])


    useEffect(() => {
        let sub: Unsubscribe | undefined;
        if (!barCodes && event) {
            sub = firebase.realTime.getAllTransactionConfirmations(event.eventId, setBarCodes, err => { })
        }
        return () => sub && sub()
    }, [event])

    const nav = useNavigate()
    const deleteEvent = () => {
        if (event) {
            doLoad()
            firebase.realTime.removeEvent(event)
                .then(() => {
                    alert('אירוע נמחק בהצלחה')
                    nav('/adminpanel')
                    closeDialog()
                    cancelLoad()
                })
                .catch(() => {
                    cancelLoad()
                    closeDialog()
                    alert('מחיקה נכשלה, אנא פנא אל המתכנת')
                })
        } else {
            closeDialog()
            alert('מחיקה נכשלה, אנא פנא אל המתכנת')
            alert(event)
            alert(event!.eventType)
        }
    }



    const buttonStyle = {
        textDecoration: 'none',
        border: `.1px solid ${'white'}`,
        borderRadius: '16px',
        fontSize: '16px',
        fontFamily: 'Open Sans Hebrew',
        background: 'whitesmoke',
        fontWeight: 'bold',
        color: PRIMARY_PINK
    }




    const Rides = (props: { rides: PNPPublicRide[], event: PNPEvent }) => {
        const approveAllTransactions = (ride: PNPPublicRide) => {
            const send = {
                rideId: ride.rideId,
                credentials: { key: "N_O_R_M_M_A_C_D_O_N_A_L_D" }
            }
            closeDialog()
            setTimeout(() => {
                doLoad()
                axios.post('https://nadavsolutions.com/gserver/approveRideTransactions', send)
                    .then(async res => {
                        ride.extras.rideTransactionsConfirmed = true
                        await firebase.realTime.updatePublicRide(props.event.eventId, ride.rideId, ride)
                        cancelLoad()
                        alert(res.data.result)
                    }).catch(e => {
                        cancelLoad()
                        alert('אירעתה שגיאה בעת אישור העסקאות, אנא פנה למתכנת')
                    })
            }, 50)
        }
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
                                        openDialogWithTitle(<div style={{ background: 'none', padding: '8px' }}><h3 style={
                                            {
                                                fontWeight: '14px',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }
                                        }>{`עריכת הסעה לאירוע: ${props.event.eventName}`}</h3>
                                            <h4 style={
                                                {
                                                    fontWeight: '12px',
                                                    fontSize: '12px',

                                                    textAlign: 'center'
                                                }
                                            }>{`נקודת יציאה : ${ride.rideStartingPoint}`}</h4></div>)
                                        openDialog({ content: <AddUpdateEventRide event={props.event} ride={ride} />, title: `עריכת הסעה לאירוע` })
                                    }}
                                    style={{ color: SECONDARY_WHITE, border: '.1px solid black', background: 'transparent' }}>
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
                                                    background: PRIMARY_PINK,
                                                    color: SECONDARY_WHITE
                                                }}>{'מחק'}</button></div>, title: `מחיקת הסעה לאירוע`
                                        })
                                    }}
                                    style={{ color: SECONDARY_WHITE, margin: '4px', border: '1px solid black', background: RED_ROYAL }}>
                                    {`מחק`}
                                </Button>}

                                {/* {<Button key={v4()}
                                    onClick={() => {
                                        openDialogWithTitle(<div>
                                            <h4 style={
                                                {
                                                    fontWeight: '12px',
                                                    textAlign: 'center',
                                                    padding: '8px',
                                                }
                                            }>{`אישור עסקאות להסעה ל ${props.event.eventName} מנקודת יציאה :  ${ride.rideStartingPoint}`}</h4></div>)
                                        openDialog({
                                            content: <div style={{ padding: '4px' }}><button
                                                onClick={() => approveAllTransactions(ride)}
                                                disabled={ride.extras.rideTransactionsConfirmed}
                                                style={{
                                                    padding: '4px',
                                                    margin: '16px',
                                                    minWidth: '100px',
                                                    fontSize: '18px',
                                                    background: 'linear-gradient(#44A08D,#093637)',
                                                    color: SECONDARY_WHITE
                                                }}>{ride.extras.rideTransactionsConfirmed ? "עסקאות אושרו" : 'אשר עסקאות'}</button></div>, title: `אישור עסקאות להסעה לאירוע`
                                        })
                                    }}
                                    style={{ color: SECONDARY_WHITE, margin: '4px', border: '1px solid black', background: 'linear-gradient(#44A08D,#093637)' }}>
                                    {`אשר עסקאות`}
                                </Button>} */}
                            </th>
                        </tr>)}
                </tbody>
            </table> : <h4>{'אין נסיעות לאירוע זה'}</h4>}


        </List>)
    }
    const EventRideStatistics = (props: { statistics: RideStatistics[] }) => {
        useEffect(() => {
            if (objectsFromStatistics) { // cached resources
                return;
            }
            let t = total
            const hash: PNPEventRidePurchaseData = {}
            let hHash: { [uid: string]: RideStatistics } = {}
            for (let i = 0; i < props.statistics.length; i++) {
                if (!hHash[props.statistics[i].uid])
                    hHash[props.statistics[i].uid] = props.statistics[i];
                else {
                    if (hHash[props.statistics[i].uid].extraPeople) {
                        if (props.statistics[i].extraPeople)
                            hHash[props.statistics[i].uid].extraPeople.push(...props.statistics[i].extraPeople)
                        else {
                            hHash[props.statistics[i].uid].extraPeople.push({
                                fullName: 'כרטיס נוסף',
                                phoneNumber: 'מספר על שם הקונה'
                            })
                        }
                    } else {
                        if (props.statistics[i].extraPeople)
                            hHash[props.statistics[i].uid].extraPeople = props.statistics[i].extraPeople.concat({
                                fullName: 'כרטיס נוסף',
                                phoneNumber: 'מספר על שם הקונה'
                            })
                        else
                            hHash[props.statistics[i].uid].extraPeople = [{
                                fullName: 'כרטיס נוסף',
                                phoneNumber: 'מספר על שם הקונה'
                            }]
                    }
                    hHash[props.statistics[i].uid].amount += props.statistics[i].amount
                }
            }
            let newArray = Object.values(hHash)
            newArray.forEach(stat => {
                if (stat) {
                    if (!hash[stat.rideStartPoint]) {
                        hash[stat.rideStartPoint] = { amount: Number(stat.amount), users: [{ uid: stat.uid, extraPeople: stat.extraPeople }] }
                    } else {
                        hash[stat.rideStartPoint].amount += Number(stat.amount)
                        let exists = hash[stat.rideStartPoint].users.findIndex(uid => uid.uid === stat.uid)
                        if (exists != -1) {
                            if (stat.extraPeople && hash[stat.rideStartPoint].users[exists].extraPeople) {
                                hash[stat.rideStartPoint].users[exists].extraPeople.push(...stat.extraPeople)
                            }
                        } else
                            hash[stat.rideStartPoint].users.push({ uid: stat.uid, extraPeople: stat.extraPeople })
                    }
                    t += Number(stat.amount)
                }
            })
            setTotal(t)
            setObjectsFromStatistics(hash)
        }, [])


        type CustomerCardContainerProps = { data: { user: PNPUser, extraPeople: PNPRideExtraPassenger[] }[], ride: string }
        function CustomerCardContainer(props: CustomerCardContainerProps) {
            const [historyProp, setHistoryProp] = useState(props)
            const searchStyle = {
                background: 'none',
                color: PRIMARY_BLACK,
                border: `.5px solid ${PRIMARY_BLACK}`,
                textDecoration: 'none',

                fontSize: '18px',
                fontFamily: 'Open Sans Hebrew',
                padding: '16px',
                borderRadius: '32px'
            }
            const search = (query: string) => {
                if (query.length < 1)
                    setHistoryProp({
                        ...historyProp, data: props.data
                    })
                else {

                    let transPred = (content: { user: PNPUser, extraPeople: PNPRideExtraPassenger[] }) => {
                        return content.user.name.includes(query) || (content.extraPeople && content.extraPeople.find(p => p.fullName.includes(query)))
                    }
                    let filter = props.data.filter(transaction => transPred(transaction))

                    setHistoryProp({
                        ...historyProp, data: filter
                    })
                }
            }

            useEffect(() => {
                openDialogWithBottom(<input placeholder="חפש משתמש"

                    style={searchStyle}
                    onChange={(e) => {
                        search(e.target.value)
                    }}>
                </input>)
            }, [])


            type CustomerCardProps = { customerData: { user: PNPUser, extraPeople: PNPRideExtraPassenger[] }, ride: string }
            const CustomerCard = (props: CustomerCardProps) => {
                const labelTitleStyle = {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: PRIMARY_BLACK
                }
                const labelTitleStyleSecond = {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: PRIMARY_BLACK
                }
                const labelSmallStyle = {
                    color: PRIMARY_BLACK,
                    fontSize: '14px'
                }
                return <div style={{
                    width: '90%',
                    justifyContent: 'center',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        columnGap: '16px',
                        padding: '16px',
                        margin: '4px',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: `1px solid ${'white'}`
                    }} >

                        <Stack >
                            <div style={labelTitleStyle}>{'שם הקונה'}</div>
                            <div style={labelSmallStyle}>{props.customerData.user.name}</div>
                            <div style={labelTitleStyle}>{'מספר טלפון הקונה'}</div>
                            <div style={labelSmallStyle}>{props.customerData.user.phone}</div>
                        </Stack>
                        {props.customerData.extraPeople && props.customerData.extraPeople.length > 0 && <div>
                            <label style={{ ...labelTitleStyle, ...{ textDecoration: 'underline' } }}>{'נוסעים נוספים: '}</label>
                            {props.customerData.extraPeople.map((extra, i) => <Stack key={extra.fullName + extra.phoneNumber + i}>
                                <label style={labelTitleStyleSecond}>{'נוסע מספר ' + (i + 2)}</label>
                                <label style={labelSmallStyle}>{'שם: ' + extra.fullName}</label>
                                <label style={labelSmallStyle}>{'טלפון: ' + extra.phoneNumber}</label>
                            </Stack>)}
                        </div>}


                        <Stack style={{ justifySelf: 'flex-start' }}>
                            <Button
                                onClick={() => {
                                    doLoad()
                                    firebase.realTime.removeTransaction(props.customerData.user.customerId, props.ride)
                                        .then(removed => {
                                            if (removed) {
                                                alert('ברקוד ועסקה נמחקו בהצלחה')
                                            } else {
                                                alert('אירעתה שגיאה בעת ביטול הכרטיס, אנא פנא למתכנת')
                                            }
                                            cancelLoad()
                                            window.location.reload()
                                        }).catch(err => {
                                            alert('אירעתה שגיאה בעת ביטול הכרטיס, אנא פנא למתכנת')
                                            cancelLoad()
                                        })
                                }}
                                style={{
                                    background: 'whitesmoke',
                                    fontWeight: 'bold',
                                    color: PRIMARY_PINK,
                                    textTransform: 'none',
                                    fontFamily: 'Open Sans Hebrew'
                                }}>
                                בטל
                            </Button>
                        </Stack>

                        <hr style={{ borderWidth: '1px', height: '1px', borderColor: 'rgba(255,255,255,0.15)' }} />
                    </div>
                </div >
            }
            return (<div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflowY: 'scroll',
                padding: '8px',
                maxHeight: '400px'
            }}>{historyProp.data.map((data: { user: PNPUser, extraPeople: PNPRideExtraPassenger[] }) => <CustomerCard key={v4()} customerData={data} ride={props.ride} />)}
            </div>);
        }


        const fetchUsersWithIds = async (ride: string, rideUsers: { uid: string, extraPeople: PNPRideExtraPassenger[] }[]) => {
            doLoad()
            let users = rideUsers.map(u => ({ ...u, uid: u.uid.split('_nm')[0] }))
            firebase.realTime.getAllUsersByIds(false, users)
                .then((data) => {

                    if (data && data.length > 0) {
                        cancelLoad()
                        openDialogWithTitle(<h3 style={
                            {
                                fontWeight: '14px',
                                textAlign: 'center',
                                padding: '8px',
                            }
                        }>{ride}</h3>)
                        openDialog({
                            content: <CustomerCardContainer data={data} ride={ride} />,
                            title: ride
                        })
                    } else {
                        cancelLoad()
                    }
                }).catch(() => { cancelLoad(); openDialog({ content: <h2>{'אירעה שגיאה בהבאת המשתמשים'}</h2> }) })
        }


        return <div>  <h1 style={{ color: SECONDARY_WHITE }}>{'סטטיסטיקה ונתוני הזמנות'} </h1>
            {objectsFromStatistics ? <div > {<h4 style={{ fontWeight: '100', color: SECONDARY_WHITE }}>{`סה"כ נוסעים`} : <b>{total}</b></h4>}<div dir={'rtl'} style={{ color: SECONDARY_WHITE, overflowY: 'scroll', maxHeight: '400px' }}>
                {objectsFromStatistics && <div style={{ display: 'grid', minWidth: '320px', height: 'fit-content', gridTemplateColumns: '1fr 1fr' }}>
                    {Object.entries(objectsFromStatistics)
                        .map((each, index: number) => <div
                            key={each[0] + index}
                            style={{
                                padding: '4px',
                                margin: '4px',
                                maxWidth: '200px',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}>
                            {each[0]} {/*   City Title */}
                            <div style={{
                                fontWeight: '500',
                                padding: '4px'
                            }}>
                                {each[1].amount}{/*  City Transactions amount */}
                            </div>
                            <button onClick={() => fetchUsersWithIds(each[0], each[1].users)}
                                style={{
                                    margin: '4px',
                                    fontSize: '14px',
                                    padding: '4px',
                                    border: '1px solid white',
                                    background: 'black',
                                    fontWeight: 'bold',
                                    color: PRIMARY_ORANGE
                                }}>
                                {'הצג משתמשים'}
                            </button>
                            <hr /></div>)} </div>}
            </div>
            </div> : <h4 style={{ color: 'gray' }}>{'אין הזמנות לאירוע זה'}</h4>}
        </div>

    }
    const Requests = (props: { eventId: string, requests?: PNPRideRequest[] }) => {
        useEffect(() => {
            $('.dim').css('display', 'none')
            if (sortedRequests) { // already cached resources
                cancelLoad()
                return;
            }
            doLoad()
            fetch('https://www.nadavsolutions.com/gserver/cities')
                .then(cList => {
                    return cList.json()
                }).then((cities: string[] | undefined) => {
                    if (!cities)
                        return
                    let hashedCity;
                    const transform = Array.from(new Set(props.requests).values()).reduce((prev, cur) => {
                        hashedCity = cities.find(city => cur.startingPoint.includes(city))?.replaceAll('ישראל', '').replaceAll(', Israel', '') ?? cur.startingPoint.replaceAll('ישראל', '').replaceAll(', Israel', '');
                        if (!prev[hashedCity])
                            prev[hashedCity] = [cur];
                        else prev[hashedCity].push(cur);
                        return prev;
                    }, {} as { [startPoint: string]: PNPRideRequest[] })

                    const merge = () => {
                        let newArray: { startPoint: string, rideRequests: PNPRideRequest[] }[] = []
                        Object.entries(transform).forEach(entry => {

                            let key = entry[0]
                            let matches = Object.keys(transform).find(other => (other.includes(key) || key.includes(other)) && key != other)
                            let newDict: { startPoint: string, rideRequests: PNPRideRequest[] };
                            if (matches) {
                                let shorter = key.length < matches.length
                                if (shorter) {
                                    newDict = { startPoint: key.replace(',', ' '), rideRequests: entry[1].concat(transform[matches]) }
                                } else {
                                    newDict = { startPoint: matches.replace(',', ' '), rideRequests: transform[matches].concat(entry[1]) }
                                }
                            } else {
                                newDict = { startPoint: entry[0], rideRequests: entry[1] }
                            }
                            if (!newArray.find(x => x.startPoint === newDict.startPoint))
                                newArray.push(newDict)
                        })
                        return newArray;
                    }
                    setSortedRequests(merge())
                    cancelLoad()
                }).catch(e => {
                    alert('אירעתה בעיה במיון הבקשות, אנא פנא למתכנת' + e)
                    cancelLoad()
                })
        }, [])




        const h = (req: PNPRideRequest) => req.requestUserId + req.eventId + req.startingPoint

        const [expand, setExpand] = useState<{ [id: string]: boolean }>({})
        const RequestCard = (props: { request: PNPRideRequest, index: number }) => {

            return (<div style={{ overflowX: 'hidden', marginTop: props.index === 0 ? '8px' : '2px', marginLeft: 'auto', marginRight: 'auto', alignSelf: 'center', maxWidth: '90%', display: 'flex', color: PRIMARY_BLACK, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>

                <Accordion sx={{ flexGrow: '1', ...{ boxShadow: elegantShadow() }, overflowY: 'scroll', margin: '8px', background: 'whitesmoke' }}
                    expanded={expand[h(props.request)]} onClick={() => {
                        setExpand({
                            ...expand,
                            // dynamically changing property
                            [h(props.request)]: !expand[h(props.request)]
                        })

                    }}>
                    <AccordionSummary dir={'rtl'} aria-controls="panel1d-content" id="panel1d-header">
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>


                            <p style={{
                                textAlign: 'right',
                                fontWeight: 'bold',
                                color: PRIMARY_BLACK,
                                margin: '0px',
                                fontSize: '12px'
                            }}>
                                {expand[h(props.request)] ? 'הסתר ביקוש ' + " של " + props.request.fullName : 'ביקוש ' + " של " + props.request.fullName}</p>

                            <span style={{ display: expand[h(props.request)] ? 'none' : 'inherit', marginLeft: '64px' }}>{props.request.passengers} נוסעים</span>
                        </div>
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

                        <Button
                            onClick={() => window.open('https://wa.me/972' + props.request.phoneNumber.substring(1))}
                            style={{ float: 'left', margin: '6px', background: 'linear-gradient(#282c34,black)', color: SECONDARY_WHITE }}>{'צור קשר'}
                            <img src={whatsappIcon} style={{ width: '15px', height: '15px', marginLeft: '4px' }} />
                        </Button>
                    </AccordionDetails>
                </Accordion>{!expand[h(props.request)] && <RemoveCircleIcon sx={{ flexGrow: '0', color: '#bd3333', cursor: 'pointer' }} onClick={() => {
                    openDialog({
                        content: <div style={{ padding: '10px', color: SECONDARY_WHITE }}> {`האם תרצה להסיר ביקוש זה (אישור, אי רלוונטיות)`} <br /><br />{`ביקוש מעת`} <b>{`${props.request.fullName}`}</b><br /><button
                            onClick={() => {
                                delete expand[props.request.eventId]
                                if (requests)
                                    for (let i = 0; i < requests.length; i++) {
                                        let req = requests[i]
                                        if (req.requestUserId === props.request.requestUserId
                                            && req.eventId === props.request.eventId
                                            && req.startingPoint === props.request.startingPoint) {
                                            requests.splice(i, 1)
                                            setRequests(requests)
                                            break
                                        }
                                    }
                                firebase.realTime.removeRideRequest(props.request.eventId, props.request.requestUserId).then(() => { closeDialog() }).catch(() => { closeDialog() })
                            }}
                            style={{
                                padding: '4px',
                                margin: '16px',
                                minWidth: '100px',
                                fontSize: '18px',
                                background: '#bd3333',
                                color: SECONDARY_WHITE
                            }}>{'הסר'}</button></div>
                    })
                }} />}</div>)
        }



        function populateCategory(category: string, requests: PNPRideRequest[]) {
            return <List key={category} sx={{ overflowY: 'scroll', maxHeight: '400px' }}>
                <label style={{
                    direction: SIDE(lang),
                    color: SECONDARY_WHITE,
                    textDecorationThickness: '.5px',
                    textDecoration: 'underline',
                    textUnderlinePosition: 'under'
                }}>{category}</label>
                {Array.from(requests)
                    .map((request, index) => <RequestCard index={index} key={request.eventName + request.startingPoint + request.requestUserId} request={request} />)}
            </List>
        }

        return (sortedRequests ? <div>
            <h1 style={{ color: SECONDARY_WHITE }}>{'בקשות להסעה'}</h1>
            <List sx={{ maxHeight: '400px', overflowY: 'scroll' }}>
                {Array.from(sortedRequests).map((v) => populateCategory(v.startPoint, v.rideRequests))}
            </List></div> : <h4 style={{ color: SECONDARY_WHITE }}>{'אין בקשות לאירוע זה'}</h4>)
    }

    type ShowingPanelScreenProps = { event: PNPEvent, rides: PNPPublicRide[], requests: PNPRideRequest[], statistics: RideStatistics[], showingComponent: AdminScreens }

    const ShowingPanelScreen = (props: ShowingPanelScreenProps) => {
        return props.showingComponent === AdminScreens.ridesOverview ?
            <Rides rides={props.rides} event={props.event} />
            : props.showingComponent === AdminScreens.rideTransactions ?
                <EventRideStatistics statistics={props.statistics} />
                : <Requests requests={props.requests} eventId={props.event.eventId} />
    }

    const csvData = async () => {
        if (objectsFromStatistics && event) {
            const all = Object.keys(objectsFromStatistics).map((city) => {
                return {
                    fetchUsers: async () => await firebase.realTime.getAllUsersByIds(true, objectsFromStatistics[city].users),
                    cityName: city
                }
            })
            if (all) {
                openDialog({
                    content: <label dir={'rtl'} style={{ padding: '8px', color: SECONDARY_WHITE }}>
                        {'ברגעים הקרובים תתחיל הורדת הנתונים למכשירך, לכל עיר משתייך קובץ csv מתאים'}
                    </label>
                })
                all.forEach(async (cityD) => {
                    const rows = [
                        ["שם", "טלפון"],
                    ];
                    await cityD.fetchUsers().then(users => {
                        if (users) {
                            users.forEach(data => {
                                rows.push([data.user.name, data.user.phone]);
                                if (data.extraPeople) {
                                    data.extraPeople.forEach(extra => {
                                        rows.push([extra.fullName, extra.phoneNumber])
                                    })
                                }
                            })
                            let csvContent = "data:text/csv;charset=utf-8,";
                            rows.forEach(function (rowArray) {
                                let row = rowArray.join(",");
                                csvContent += row + "\r\n";
                            });
                            var downloadLink = document.createElement("a");
                            var encodedUri = encodeURI(csvContent);
                            downloadLink.href = encodedUri;
                            downloadLink.download = event.eventName + "_" + cityD.cityName + ".csv";
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                        }
                    })
                })
            }
        }
    }
    const actionToggleEventShowsInGallery = () => {
        if (event) {
            const toShow = event.eventShowsInGallery === undefined || event.eventShowsInGallery === null || event.eventShowsInGallery === false
            let newEvent = { ...event, eventShowsInGallery: !event.eventShowsInGallery }
            doLoad()
            setEvent(newEvent)
            firebase.realTime.updateEvent(event.eventId, newEvent, null, null).then(result => {
                cancelLoad()
                alert(toShow ? 'אירוע נוסף לגלריה בהצלחה' : 'אירוע הוסר מהגלריה בהצלחה')
            }).catch(problem => {
                cancelLoad()
                alert("אירעתה שגיאה בפעולה זו, אנא פנה למתכנת");
            })
        }
    }

    useEffect(() => {
        let unsub: Unsubscribe | undefined;
        if (event) {
            unsub = firebase.realTime.getLinkRedirectForEventId(event.eventId, (link, err) => {
                if (err) {
                    return;
                }
                setLinkRedirect(link);
            })
        }
        return () => unsub && unsub();
    }, [event])

    const { setHeaderColor, resetHeaderColor } = useHeaderBackgroundExtension()
    const { changeBackgroundColor, resetBackgroundColor } = useBackgroundExtension()
    useEffect(() => {
        setHeaderColor('black')
        changeBackgroundColor('black')
        return () => {
            resetHeaderColor()
            resetBackgroundColor()
        }
    }, [])


    const [linkRedirect, setLinkRedirect] = useState<string | null>()
    return (event ? <PageHolder style={{ background: 'black', overflowX: 'hidden' }}>
        <InnerPageHolder style={{ width: '80%', overflowY: 'hidden', overflowX: 'hidden', background: 'black', border: 'none' }} >
            <SectionTitle style={{ marginTop: '4px', direction: 'rtl' }} title={`${event.eventName}`} />
            <span style={{ color: SECONDARY_WHITE }}>{'ניהול הסעות לאירוע'}</span>
            <Spacer offset={1} />
            <Stack spacing={3} style={{ width: '75%' }}>
                {function addRideButton() {
                    return <Button
                        dir={'rtl'}
                        style={buttonStyle}
                        onClick={() => {

                            event && openDialog({
                                content: <div style={{ padding: '16px' }}>
                                    <h3 style={{
                                        fontWeight: '14px',
                                        color: PRIMARY_PINK,
                                        padding: '4px',
                                        textAlign: 'center'
                                    }}>{`הוסף הסעה ל ${event.eventName}`}</h3>
                                    <AddUpdateEventRide event={event} />
                                </div>
                            })
                        }}>

                        {event ? `הוסף הסעה` : ''}
                    </Button>
                }()}

                {function invitationStatsButton() {
                    return <Button
                        style={buttonStyle}
                        onClick={() => { setShowingComponent(AdminScreens.rideTransactions) }}>
                        {'סטטיסטיקת הזמנות'}
                    </Button>
                }()}

                {function rideManagingButton() {
                    return <Button
                        style={buttonStyle}
                        onClick={() => { setShowingComponent(AdminScreens.ridesOverview) }}>
                        {'ניהול נסיעות'}
                    </Button>
                }()}

                {function rideRequestsButton() {
                    return <Button
                        style={buttonStyle}
                        onClick={() => { setShowingComponent(AdminScreens.rideRequests) }}>
                        {'בקשות נסיעה'}
                    </Button>
                }()}




                {function eventEditButton() {
                    return <Button
                        onClick={() => {
                            openDialog({ content: <AddUpdateEvent event={event} /> })
                        }}
                        style={{ ...buttonStyle, ...{ background: 'whitesmoke', fontWeight: 'bold' } }}>
                        {'עריכת אירוע'}
                        <EditIcon style={{ marginLeft: '4px', width: '20px', height: '20px' }} />
                    </Button>
                }()}

                {function toggleEventShowsInGallery() {
                    return <Button
                        onClick={actionToggleEventShowsInGallery}
                        style={{ ...buttonStyle, ...{ background: 'whitesmoke', fontWeight: 'bold' } }}>
                        {event.eventShowsInGallery ? 'הסר אירוע מגלריה' : 'הוסף אירוע לגלריה'}
                        <EditIcon style={{ marginLeft: '4px', width: '20px', height: '20px' }} />
                    </Button>
                }()}

                {function eventDeleteButton() {
                    return <Button
                        style={{ borderRadius: '16px', border: '1px solid white', fontFamily: 'Open Sans Hebrew', background: 'black', fontWeight: 'bold', color: PRIMARY_PINK }}
                        onClick={() => {
                            openDialog({
                                content: <div>
                                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{'פעולה זו תמחק גם את ההסעות שיש לאירוע זה'}</label>
                                    <Spacer offset={1} />
                                    <label style={{ color: SECONDARY_WHITE }}>{'האם אתה בטוח שברצונך להמשיך?'}</label>
                                    <Spacer offset={1} />
                                    <Button
                                        onClick={deleteEvent}
                                        style={{ padding: '8px', margin: '8px', color: SECONDARY_WHITE, width: '50%', background: ORANGE_RED_GRADIENT_BUTTON, fontSize: '14px' }}>
                                        {'כן, מחק אירוע סופית'}
                                    </Button>
                                </div>
                            })

                        }}>
                        {'מחק אירוע'}

                        <DeleteForeverIcon style={{ marginLeft: '4px', width: '20px', height: '20px' }} />
                    </Button>
                }()}
            </Stack>

            {function renderStatisticsPanel() {
                if (statistics && event)
                    return (<ShowingPanelScreen
                        statistics={statistics}
                        requests={requests ?? []}
                        rides={rides ?? []}
                        event={event}
                        showingComponent={showingComponent} />)
                else return null

            }()}


            {function csvExportButton() {
                return <Button
                    dir={'rtl'}
                    style={{
                        ...buttonStyle, ...{
                            padding: '8px',
                            marginTop: '32px',
                            width: '50%',
                            minWidth: 'max-content',
                            background: 'linear-gradient(#282c34,black)'
                        }
                    }}
                    onClick={() => {
                        csvData()
                    }}>{'ייצא לקובץ CSV'}</Button>
            }()}

            <Spacer offset={1} />
            {(function eventRedirectLink() {
                return event && <EventLinkRedirect firebase={firebase} event={event} linkRedirect={linkRedirect} />
            })()}

            {event && <ScannerPermissions event={event} />}

            {event && <Stack direction={'row'} alignItems={'center'}>
                <Checkbox checked={event.eventSendsSMS}
                    onChange={(e) => {
                        setEvent({ ...event, eventSendsSMS: e.target.checked })
                        firebase.realTime.updateEvent(event.eventId, { ...event, eventSendsSMS: e.target.checked })
                            .then(() => {
                                alert(e.target.checked ? 'סמסים יישלחו כעת עבור הזמנות לאירוע זה' : 'סמסים לא יישלחו עבור הזמנות לאירוע זה')
                            }).catch(err => {
                                alert('אירעתה שגיאה בעת הזנת השיני אנא פנא אל המתכנת')
                            })
                    }}
                    style={{ color: 'white' }} />

                <label style={{ color: 'white' }}>שלח סמס בעת רכישת כרטיסים</label>
            </Stack>}
        </InnerPageHolder>
    </PageHolder> : <div>{'לא קיים לאירוע זה דף ניהול'}</div>)

}