import { Accordion, TextField, MenuItem, Checkbox, Select, AccordionDetails, AccordionSummary, Button, List, Stack, alertTitleClasses } from "@mui/material";
import { useEffect, useState } from "react";

import { useFirebase } from "../../context/Firebase";
import { Unsubscribe } from "firebase/database";
import { useLanguage } from "../../context/Language";
import $ from 'jquery'
import { CSVLink } from "react-csv";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { SAME_SPOT, SIDE } from "../../settings/strings";
import { PNPEvent, PNPPublicRide, PNPRideRequest, PNPUser } from "../../store/external/types";
import { InnerPageHolder, PageHolder } from "../utilities/Holders";

import '../../settings/mainstyles.css'
import axios from "axios";
import { useLoading } from "../../context/Loading";
import { v4 } from "uuid";
import { isValidPublicRide } from "../../store/validators";
import { submitButton } from "../../settings/styles";
import { useLocation, useNavigate } from "react-router";
import SectionTitle from "../SectionTitle";
import { DARKER_BLACK_SELECTED, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, ORANGE_RED_GRADIENT_BUTTON, PRIMARY_BLACK, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import Spacer from "../utilities/Spacer";
import { makeStyles } from "@mui/styles";



const Rides = (props: { rides: PNPPublicRide[], event: PNPEvent }) => {
    const { openDialog, openDialogWithTitle, closeDialog } = useLoading()

    const { firebase } = useFirebase()
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
                                    }>{`עריכת הסעה לאירוע: ${props.event.eventName}`}</h3>
                                        <h4 style={
                                            {
                                                fontWeight: '12px',
                                                textAlign: 'center'
                                            }
                                        }>{`נקודת יציאה : ${ride.rideStartingPoint}`}</h4></div>)
                                    openDialog({ content: <AddUpdateEventRide event={props.event} ride={ride} />, title: `עריכת הסעה לאירוע` })
                                }}
                                style={{ color: SECONDARY_WHITE, border: '.1px solid black', background: DARK_BLACK }}>
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
                                                background: ORANGE_RED_GRADIENT_BUTTON,
                                                color: SECONDARY_WHITE
                                            }}>{'מחק'}</button></div>, title: `מחיקת הסעה לאירוע`
                                    })
                                }}
                                style={{ color: SECONDARY_WHITE, margin: '4px', border: '1px solid black', background: '#bd3333' }}>
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
    const { lang } = useLanguage()
    const { firebase } = useFirebase()
    const [ride, setRide] = useState<PNPPublicRide>(props.ride ? props.ride : {
        rideId: "null",
        eventId: props.event.eventId,
        rideDestination: props.event.eventName,
        rideStartingPoint: "null",
        rideTime: "00:00",
        ridePrice: "null",
        backTime: "04:00",
        passengers: "0",
        date: props.event.eventDate,
        extras: {
            isRidePassengersLimited: true,
            rideStatus: 'on-going',
            rideMaxPassengers: '54',
            twoWay: true,
            rideDirection: '2',
            exactBackPoint: SAME_SPOT(lang),
            exactStartPoint: ''
        }
    })
    const useStyles = makeStyles(() => (
        {
            root: {
                "& .MuiOutlinedInput-root": {
                    background: SECONDARY_WHITE,
                    borderRadius: '32px',
                    padding: '0px',
                    border: '.1px solid white',
                    color: PRIMARY_BLACK,
                    WebkitAppearance: 'none'
                    , ...{
                        '& input[type=number]': {
                            '-moz-appearance': 'textfield'
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0
                        }
                    }
                }
            }

        }
    ))

    const classes = useStyles()
    const changeRideStartingPoint = (newStartPoint: string) => {
        setRide({
            ...ride,
            rideStartingPoint: newStartPoint
        })
    }

    const changeRideExactStartPoint = (newStartPoint: string) => {
        setRide({
            ...ride,
            extras: { ...ride.extras, exactStartPoint: newStartPoint }
        })
    }

    const changeRideExactBackPoint = (newBackPoint: string) => {
        setRide({
            ...ride,
            extras: { ...ride.extras, exactBackPoint: newBackPoint }
        })
    }

    const changeRideWays = (twoWay: boolean) => {
        setRide({
            ...ride,
            extras: { ...ride.extras, twoWay: twoWay }
        })
    }

    const changeRideDirections = (directions: '1' | '2') => {
        setRide({
            ...ride,
            extras: { ...ride.extras, rideDirection: directions }
        })
    }



    const changeRidePassengerLimit = (max: string) => {
        setRide({
            ...ride,
            extras: { ...ride.extras, rideMaxPassengers: max }
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
    const changeRideBackTime = (newTime: string) => {
        setRide({
            ...ride,
            backTime: newTime
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
    return <Stack spacing={2} style={{ padding: '16px', minWidth: '250px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><label style={{ color: SECONDARY_WHITE }}>{'הסעה דו כיוונית'}</label>
            <Checkbox
                style={{ width: 'fit-content', alignSelf: 'center' }}
                checked={ride.extras.twoWay}
                onChange={(e) => {
                    changeRideWays(e.target.checked)
                }}
                inputProps={{ 'aria-label': 'controlled' }}
            /></div>
        {!ride.extras.twoWay &&
            <Stack direction='column' spacing={2}>
                <label style={{ color: SECONDARY_WHITE }}>{'בחר כיוון נסיעה'}</label>
                <Select
                    value={ride.extras.rideDirection}
                    style={{ color: PRIMARY_BLACK, borderRadius: '32px', background: SECONDARY_WHITE }}
                    onChange={(e) => {
                        if (e.target.value === '1' || e.target.value === '2')
                            changeRideDirections(e.target.value)
                    }}>
                    <MenuItem value={'1'}>{'חזור בלבד'}</MenuItem>
                    <MenuItem value={'2'}>{'הלוך בלבד'}</MenuItem>
                </Select></Stack>}
        {(ride.extras.twoWay || ride.extras.rideDirection === '2') &&
            <Stack direction='column' spacing={2}>
                <label style={{ color: SECONDARY_WHITE }}>{'הכנס נקודת יציאה'}</label>
                <TextField
                    autoComplete=""
                    InputLabelProps={{
                        style: { color: SECONDARY_WHITE },
                    }}
                    classes={{ root: classes.root }}

                    style={{ color: SECONDARY_WHITE }}
                    placeholder={props.ride ? props.ride.rideStartingPoint : 'נקודת יציאה'}
                    onChange={(e) => changeRideStartingPoint(e.target.value)}
                />
                <label style={{ color: SECONDARY_WHITE }}>{'הכנס נקודת יציאה מדויקת'}</label>
                <TextField
                    autoComplete=""
                    InputLabelProps={{
                        style: { color: SECONDARY_WHITE },
                    }}
                    classes={{ root: classes.root }}

                    style={{ color: SECONDARY_WHITE }}
                    placeholder={props.ride ? props.ride.extras.exactStartPoint : 'נקודת יציאה מדויקת'}
                    onChange={(e) => changeRideExactStartPoint(e.target.value)}
                />

            </Stack>}

        {(ride.extras.twoWay || ride.extras.rideDirection === '1') && <Stack direction='column' spacing={2}>
            <label style={{ color: SECONDARY_WHITE }}>{'הכנס נקודת חזרה מדויקת'}</label>
            <TextField
                autoComplete=""
                InputLabelProps={{
                    style: { color: SECONDARY_WHITE },
                }}
                classes={{ root: classes.root }}

                style={{ color: SECONDARY_WHITE }}
                placeholder={props.ride ? props.ride.extras.exactBackPoint : ride.extras.twoWay && ride.extras.exactBackPoint ? ride.extras.exactBackPoint : 'נקודת חזרה מדויקת'}
                onChange={(e) => changeRideExactBackPoint(e.target.value)}
            />
        </Stack>}
        <label style={{ color: SECONDARY_WHITE }}>{'הכנס מחיר'}</label>
        <TextField
            required
            classes={{ root: classes.root }}
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
        <label style={{ color: SECONDARY_WHITE }}> {'הכנס שעת יציאה'}</label>
        <TextField
            classes={{ root: classes.root }}
            InputLabelProps={{
                style: { color: SECONDARY_WHITE },
            }}
            required
            type='time'
            style={{ color: SECONDARY_WHITE }}

            placeholder={props.ride ? props.ride.rideTime : '00:00'}
            name='time'
            onChange={(e) => changeRideTime(e.target.value)}
        />
        <label style={{ color: SECONDARY_WHITE }}> {'הכנס שעת חזרה'}</label>
        <TextField
            classes={{ root: classes.root }}
            InputLabelProps={{
                style: { color: SECONDARY_WHITE },
            }}
            required
            type='time'
            style={{ color: SECONDARY_WHITE }}

            placeholder={props.ride ? props.ride.backTime : '00:00'}
            name='time'
            onChange={(e) => changeRideBackTime(e.target.value)}
        />

        <label style={{ color: SECONDARY_WHITE }}> {'הגבל מספר מקומות'}</label>
        <TextField
            classes={{ root: classes.root }}
            InputLabelProps={{
                style: { color: SECONDARY_WHITE },
            }}
            required
            type='number'
            inputProps={{ inputMode: 'numeric', min: 0, max: 250 }}
            style={{ color: SECONDARY_WHITE }}

            placeholder={props.ride && props.ride.extras.rideMaxPassengers ? props.ride.extras.rideMaxPassengers : 'הכנס מספר מקומות'}
            name='number of'
            onChange={(e) => changeRidePassengerLimit(e.target.value)}
        />
        <Button sx={{ ...submitButton(false), ...{ width: '100%', maxHeight: '50px' } }}
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


        return (<span style={{ marginLeft: '12px', marginRight: '12px', maxWidth: '90%', display: 'flex', color: PRIMARY_BLACK, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>

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
                        color: PRIMARY_BLACK,
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
                    content: <div style={{ padding: '10px', color: SECONDARY_WHITE }}> {`האם תרצה להסיר ביקוש זה (אישור, אי רלוונטיות)`} <br /><br />{`ביקוש מעת`} <b>{`${props.request.fullName}`}</b><br /><button
                        onClick={() => { firebase.realTime.removeRideRequest(props.request.eventId, props.request.requestUserId).then(() => { closeDialog() }).catch(() => { closeDialog() }) }}
                        style={{
                            padding: '4px',
                            margin: '16px',
                            minWidth: '100px',
                            fontSize: '18px',
                            background: '#bd3333',
                            color: SECONDARY_WHITE
                        }}>{'הסר'}</button></div>
                })
            }} />}</span>)
    }

    return (props.requests ? <div>
        <h1 style={{ color: SECONDARY_WHITE }}>{'בקשות להסעה'}</h1>
        <List sx={{ maxHeight: '400px', overflowY: 'scroll' }}>
            {Array.from(new Set(props.requests).values()).map(request => <RequestCard key={v4()} request={request} />)}
        </List></div> : <h4 style={{ color: SECONDARY_WHITE }}>{'אין בקשות לאירוע זה'}</h4>)


}
enum AdminScreens {
    ridesOverview, rideTransactions, rideRequests
}

type RideStatistics = {
    amount: string
    uid: string
    extraPeople: { fullName: string, phoneNumber: string }[]
    rideStartPoint: string
}



const EventRideStatistics = (props: { statistics: RideStatistics[] }) => {
    const [objectsFromStatistics, setObjectsFromStatistics] = useState<{ [rideStartingPoint: string]: { amount: number, users: { uid: string, extraPeople: { fullName: string, phoneNumber: string }[] }[] } }>()

    const { doLoad, openDialog, openDialogWithTitle, cancelLoad } = useLoading()
    const { firebase } = useFirebase()
    useEffect(() => {
        let t = total
        const hash: { [rideStartingPoint: string]: { amount: number, users: { uid: string, extraPeople: { fullName: string, phoneNumber: string }[] }[] } } = {}
        props.statistics.forEach(stat => {
            if (!hash[stat.rideStartPoint]) {
                hash[stat.rideStartPoint] = { amount: Number(stat.amount), users: [{ uid: stat.uid, extraPeople: stat.extraPeople }] }
            } else {
                hash[stat.rideStartPoint].amount += Number(stat.amount)
                hash[stat.rideStartPoint].users.push({ uid: stat.uid, extraPeople: stat.extraPeople })
            }
            t += Number(stat.amount)
        })
        setTotal(t)
        setObjectsFromStatistics(hash)
    }, [])

    function CustomerCardContainer(props: { data: { user: PNPUser, extraPeople: { fullName: string, phoneNumber: string }[] }[] }) {

        const CustomerCard = (props: { customerData: { user: PNPUser, extraPeople: { fullName: string, phoneNumber: string }[] } }) => {
            const labelTitleStyle = {
                fontSize: '14px',
                fontWeight: 'bold',
                color: SECONDARY_WHITE
            }
            const labelTitleStyleSecond = {
                fontSize: '12px',
                fontWeight: 'bold',
                color: SECONDARY_WHITE
            }
            const labelSmallStyle = {
                color: SECONDARY_WHITE,
                fontSize: '10px'
            }
            
            return <div style={{
                padding: '8px',
                margin: '8px'
            }}>

                <div style={labelTitleStyle}>{'שם הקונה'}</div>
                <div style={labelSmallStyle}>{props.customerData.user.name}</div>
                <div style={labelTitleStyle}>{'מספר טלפון הקונה'}</div>
                <div style={labelSmallStyle}>{props.customerData.user.phone}</div>

                {props.customerData.extraPeople && props.customerData.extraPeople.length > 0 && <div>
                    <label style={{ ...labelTitleStyle, ...{ textDecoration: 'underline' } }}>{'נוסעים נוספים: '}</label>
                    {props.customerData.extraPeople.map((extra, i) => <Stack key={extra.fullName + extra.phoneNumber + i}>
                        <label style={labelTitleStyleSecond}>{'נוסע מספר ' + (i + 2)}</label>
                        <label style={labelSmallStyle}>{'שם: ' + extra.fullName}</label>
                        <label style={labelSmallStyle}>{'טלפון: ' + extra.phoneNumber}</label>
                    </Stack>)}
                </div>}
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
        }}>{props.data.map((data: { user: PNPUser, extraPeople: { fullName: string, phoneNumber: string }[] }) => <CustomerCard key={v4()} customerData={data} />)}</div>);
    }


    const fetchUsersWithIds = async (ride: string, ids_and_extraPeople: { uid: string, extraPeople: { fullName: string, phoneNumber: string }[] }[]) => {
        doLoad()
        await firebase.realTime.getAllUsersByIds(ids_and_extraPeople)
            .then((data: { user: PNPUser, extraPeople: { fullName: string, phoneNumber: string }[] }[] | null) => {
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
                        content: <CustomerCardContainer data={data} />,
                        title: ride
                    })
                } else {
                    cancelLoad()
                }
            }).catch(() => { cancelLoad(); openDialog({ content: <h2>{'אירעה שגיאה בהבאת המשתמשים'}</h2> }) })
    }

    const [total, setTotal] = useState(0)



    return <div >  <h1 style={{ color: SECONDARY_WHITE }}>{'סטטיסטיקה ונתוני הזמנות'} </h1>
        {objectsFromStatistics ? <div> {<h4 style={{ fontWeight: '100', color: SECONDARY_WHITE }}>{`סה"כ`} : <b>{total}</b></h4>}<div dir={'rtl'} style={{ color: SECONDARY_WHITE, overflowY: 'scroll', maxHeight: '400px' }}>
            {objectsFromStatistics && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: `repeat(${Math.floor(props.statistics.length / 2)},1fr)` }}>
                {Object.entries(objectsFromStatistics).map((each, index: number) => <div key={each[0] + index} style={{ padding: '4px', margin: '4px', maxWidth: '200px', fontSize: '12px', fontWeight: 'bold' }}>
                    {each[0]}
                    <div style={{ fontWeight: '500', padding: '4px' }}>
                        {each[1].amount}
                    </div>
                    <button onClick={() => fetchUsersWithIds(each[0], each[1].users)} style={{ margin: '4px', fontSize: '12px', padding: '4px', border: 'none', background: DARKER_BLACK_SELECTED, color: SECONDARY_WHITE }}>
                        {'הצג משתמשים'}
                    </button>
                    <hr /></div>)} </div>}
        </div>
        </div> : <h4 style={{ color: 'gray' }}>{'אין הזמנות לאירוע זה'}</h4>}
    </div>

}
const ShowingPanelScreen = (props: { event: PNPEvent, rides: PNPPublicRide[], requests: PNPRideRequest[], statistics: RideStatistics[], showingComponent: AdminScreens }) => {
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

    const [statistics, setStatistics] = useState<RideStatistics[] | null>(null)
    const [rides, setRides] = useState<PNPPublicRide[] | null>(null)
    const { firebase } = useFirebase()
    const { lang } = useLanguage()
    const { openDialog, closeDialog, doLoad, cancelLoad, openDialogWithTitle } = useLoading()
    const [requests, setRequests] = useState<PNPRideRequest[] | null>(null)
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

    const ActionCard = () => {
        return <Stack spacing={3} dir={SIDE(lang)}>
            <Button style={{ background: 'whitesmoke', color: '#6495ED', textTransform: 'none' }}>Show Public Events</Button>
            <Button style={{ background: 'whitesmoke', color: '#6495ED', textTransform: 'none' }}>Show Private Events</Button>
        </Stack>
    }


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
        borderRadius: '16px',
        fontFamily: 'Open Sans Hebrew',
        background: DARK_BLACK,
        color: SECONDARY_WHITE
    }

    return (event ? <PageHolder>
        <SectionTitle style={{ direction: 'rtl' }} title={`${event.eventName}`} />
        <span style={{ color: SECONDARY_WHITE }}>{'ניהול הסעות לאירוע'}</span>
        <InnerPageHolder style={{ overflowY: 'hidden' }} >
            <Stack spacing={3} style={{ width: '75%' }}>


                <Button
                    dir={'rtl'}
                    style={buttonStyle}

                    onClick={() => {

                        event && openDialog({
                            content: <div style={{ padding: '16px' }}>
                                <h3 style={{
                                    fontWeight: '14px',
                                    background: PRIMARY_BLACK,
                                    color: SECONDARY_WHITE,
                                    padding: '4px',
                                    textAlign: 'center'
                                }}>{`הוסף הסעה ל ${event.eventName}`}</h3>
                                <AddUpdateEventRide event={event} />
                            </div>
                        })
                    }}>
                    {event ? `הוסף הסעה` : ''}
                </Button>

                <Button
                    style={buttonStyle}
                    onClick={() => { setShowingComponent(AdminScreens.rideTransactions) }}>
                    {'סטטיסטיקת הזמנות'}
                </Button>

                <Button
                    style={buttonStyle}
                    onClick={() => { setShowingComponent(AdminScreens.ridesOverview) }}>
                    {'ניהול נסיעות'}
                </Button>

                <Button
                    style={buttonStyle}
                    onClick={() => { setShowingComponent(AdminScreens.rideRequests) }}>
                    {'בקשות נסיעה'}
                </Button>



                <CSVLink filename={event.eventName} style={{ ...buttonStyle, ...{ padding: '8px', background: ORANGE_GRADIENT_PRIMARY } }} dir='rtl' data={[event]}>{'ייצא לקובץ CSV'}</CSVLink>

                <Button
                    style={{ fontFamily: 'Open Sans Hebrew', background: ORANGE_RED_GRADIENT_BUTTON, fontWeight: 'bold', color: SECONDARY_WHITE }}
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