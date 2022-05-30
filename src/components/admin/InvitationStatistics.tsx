import React, { CSSProperties, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useLoading } from "../../context/Loading";
import { BLACK_ELEGANT, BLACK_ROYAL, DARKER_BLACK_SELECTED, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, ORANGE_RED_GRADIENT_BUTTON, PRIMARY_BLACK, RED_ROYAL, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import { PNPPrivateEvent, PNPPublicRide, PNPRideConfirmation, PNPUser } from "../../store/external/types";
import EditIcon from '@mui/icons-material/Edit';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { InnerPageHolder, PageHolder } from "../utilities/Holders";
import AddUpdateEventInvitation from "./AddUpdateEventInvitation";
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, List, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import SectionTitle from "../SectionTitle";
import Spacer from "../utilities/Spacer";
import AddUpdatePrivateEventRide from "./AddUpdatePrivateEventRide";
import { useFirebase } from "../../context/Firebase";
import { Unsubscribe } from "firebase/database";
import { v4 } from "uuid";
import $ from 'jquery'
import { orange, purple } from "@mui/material/colors";
import { useLanguage } from "../../context/Language";
import { makeStyles } from "@mui/styles";
import { textFieldStyle } from "../../settings/styles";
import { HtmlTooltip } from "../utilities/HtmlTooltip";

const buttonStyle = {
    textDecoration: 'none',
    borderRadius: '16px',
    width: '200px',
    marginLeft: 'auto',
    border: '.1px solid white',
    marginRight: 'auto',
    fontFamily: 'Open Sans Hebrew',
    background: DARK_BLACK,
    color: SECONDARY_WHITE
}

export default function InvitationStatistics() {
    const location = useLocation()
    const { eventId } = useParams()
    const [accordionHash, setAccordionHash] = useState<{ [id: string]: boolean }>({})
    const { openDialog, openDialogWithTitle, closeDialog } = useLoading()
    const { firebase, user, appUser } = useFirebase()
    const [confirmations, setConfirmations] = useState<{ [dir: string]: PNPRideConfirmation[] } | undefined>()
    const [rides, setRides] = useState<PNPPublicRide[] | null>(null)
    const nav = useNavigate()
    const [oldPrivateEvent, setOldPrivateEvent] = useState<PNPPrivateEvent | undefined>(location.state as PNPPrivateEvent ? location.state as PNPPrivateEvent : undefined)
    const [privateEvent, setPrivateEvent] = useState<PNPPrivateEvent | undefined>(location.state as PNPPrivateEvent ? location.state as PNPPrivateEvent : undefined)
    const [hasChanges, setHasChanges] = useState<{ [id: string]: boolean }>({})
    const { lang } = useLanguage()
    const { doLoad, cancelLoad } = useLoading()
    const useStyles = makeStyles(() => textFieldStyle())
    const classes = useStyles()


    const updateEvent = () => {
        if (privateEvent)
            firebase.realTime.updatePrivateEvent(privateEvent?.eventId, privateEvent).then(() => { alert('שינויים נשמרו בהצלחה') })
    }
    const updatePageManager = () => {
        if (!privateEvent) return;
        let field = $('#email_admin_update_field')
        let val = field.val()
        if (!(val as string)) {
            openDialog({
                content: <div
                    style={{ padding: '8px' }}>
                    <label
                        style={{ color: SECONDARY_WHITE }}>
                        {'יש להכניס אימייל של משתמש על מנת לשנות גישה'}
                    </label>
                </div>
            })
            return
        }

        val = val as string

        doLoad()

        firebase.realTime.getUserIdByEmail(val, (userId: string) => {

            firebase.realTime.makeUserResponsible(
                userId,
                privateEvent
            ).then(() => {
                cancelLoad()
                dialog(
                    "גישות דף הניהול שונו בהצלחה, ונתונות כעת בידי " + val
                )
            }).catch(() => {
                cancelLoad()
            })
        }, () => {
            cancelLoad()
            //error
            dialog('לא נמצא משתמש עם האימייל ' + val)
        })
    }
    function dialog(text: string) {
        openDialog({
            content: <div
                style={{ padding: '8px' }}>
                <label
                    style={{ color: SECONDARY_WHITE }}>
                    {text}
                </label>
            </div>
        })
    }

    const openConfirmationUpdateDialog = (confirmation: PNPRideConfirmation) => {
        if (!privateEvent) return

        let confirmationPointer = confirmation
        function update(pointer: PNPRideConfirmation) {
            doLoad()
            firebase.realTime.updateConfirmation(
                privateEvent!.eventId,
                confirmation.userName,
                pointer
            ).then(() => {
                dialog("אישור עודכן בהצלחה")
                cancelLoad()
            }).catch(() => { cancelLoad() })
        }
        openDialog({
            content: <Stack
                style={{ padding: '16px' }}
                alignItems={'center'}
                justifyContent={'center'}
                spacing={1}>
                <select

                    onChange={(e) => {
                        if (e.target.value as string)
                            confirmationPointer.directionType = e.target.value as string
                    }}>
                    <option value={'1'}>
                        {lang == 'heb' ? 'הלוך' : 'first way only'}
                    </option>
                    <option value={'2'} >
                        {lang == 'heb' ? 'חזור' : 'back way only'}
                    </option>
                    <option value={'3'}>
                        {lang == 'heb' ? 'הלוך-חזור' : 'both ways'}
                    </option>
                </select>
                <Button
                    onClick={() => update(confirmationPointer)}
                    style={buttonStyle}>
                    {'שמור שינויים'}
                </Button>
            </Stack>
        })
    }

    useEffect(() => {
        let unsub: Unsubscribe | undefined
        let unsub2: Unsubscribe | undefined
        let unsub3: Unsubscribe | undefined
        if (privateEvent) {
            const default_no_arrival = 'אישורי הגעה ללא הסעה'
            unsub = firebase.realTime.getAllRideConfirmationByEventId(privateEvent.eventId, (confs) => {
                if (confs) {
                    let hash: { [dir: string]: PNPRideConfirmation[] } = {}
                    for (let conf of confs) {
                        if (!conf.rideArrival) {
                            if (!hash[default_no_arrival])
                                hash[default_no_arrival] = [conf]
                            else
                                hash[default_no_arrival].push(conf)
                        } else if (hash[conf.directions]) {
                            hash[conf.directions].push(conf)
                        } else {
                            hash[conf.directions] = [conf]
                        }
                    }
                    setConfirmations(hash)
                    let hashAccordion: { [id: string]: boolean } = {}
                    for (let entry of Object.entries(hashAccordion))
                        hashAccordion[entry[0]] = false
                    setAccordionHash(hashAccordion)
                }
            })
            unsub2 = firebase.realTime.getPrivateEventRidesById(privateEvent.eventId, setRides)
        } else if (eventId) {
            unsub = firebase.realTime.getPrivateEventById(eventId, (e) => {
                if ((!appUser || !appUser.admin) && e.eventProducerId !== user?.uid) {
                    setTimeout(() => {
                        if ((!appUser || !appUser.admin) && e.eventProducerId !== user?.uid) {
                            openDialog({
                                content: <span style={{ color: SECONDARY_WHITE, padding: '8px' }}>
                                    {'אין לך הרשאות לעמוד זה'}
                                </span>
                            })
                            nav('/')
                        }
                    }, 250)
                    return
                }
                unsub2 = firebase.realTime.getAllRideConfirmationByEventId(eventId, (confs) => {
                    if (confs) {
                        let hash: { [dir: string]: PNPRideConfirmation[] } = {}

                        for (let conf of confs) {
                            if (hash[conf.directions]) {
                                hash[conf.directions].push(conf)
                            } else {
                                hash[conf.directions] = [conf]
                            }
                        }
                        setConfirmations(hash)
                        let hashAccordion: { [id: string]: boolean } = {}
                        for (let entry of Object.entries(hashAccordion))
                            hashAccordion[entry[0]] = false
                        setAccordionHash(hashAccordion)
                    }
                })
                unsub3 = firebase.realTime.getPrivateEventRidesById(eventId, setRides)
                setPrivateEvent(e)
            })
        }
        return () => { unsub && (unsub as Unsubscribe)(); unsub2 && (unsub2 as Unsubscribe)(); unsub3 && (unsub3 as Unsubscribe)(); }
    }, [])



    const spanStyle = {
        color: SECONDARY_WHITE,
        textAlignment: 'right',
        fontFamily: 'Open Sans Hebrew'
    }

    const PrivateRides = (props: { rides: PNPPublicRide[], event: PNPPrivateEvent }) => {

        return (<List style={{ width: '280px', marginLeft: 'auto', marginRight: 'auto' }}>
            <h1 style={{ color: SECONDARY_WHITE }}>{'פעולות אדמין'}</h1>
            <Stack spacing={2}>
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
                                        style={{ color: SECONDARY_WHITE, margin: '4px', border: '1px solid black', background: RED_ROYAL }}>
                                        {`מחק`}
                                    </Button>}
                                </th>
                            </tr>)}
                    </tbody>
                </table> : <h4>{'אין נסיעות לאירוע זה'}</h4>}
            </Stack>


        </List>)
    }


    let simpleLabel = {
        color: SECONDARY_WHITE,
        fontSize: '12px'
    } as CSSProperties
    return <PageHolder style={{ background: 'none', paddingBottom: '0px' }}>
        {privateEvent && <SectionTitle style={{ fontWeight: 'bold', fontSize: '24px', marginTop: '32px', paddingBottom: '4px', fontFamily: 'fantasy' }} title={privateEvent.eventTitle} />}
        {privateEvent && <span style={{ marginTop: '-16px', fontFamily: 'Open Sans Hebrew', color: SECONDARY_WHITE, fontWeight: '200', fontSize: '20px' }}>{lang === 'heb' ? 'עמוד ניהול נסיעות' : 'Ride Supervision Page'}</span>}
        {privateEvent ? <InnerPageHolder style={{ transform: 'translateY(-3%)', direction: 'rtl', background: 'none', border: 'none' }}>

            <Stack spacing={2}>

                <div style={{ border: '.5px solid white', background: 'black', padding: '8px', borderRadius: '8px' }}><span style={{ ...spanStyle }} >{lang === 'heb' ? 'קישור לדף הזמנה : ' : 'Link to invitation Page: '}</span>
                    <a style={{ ...spanStyle, ...{ fontWeight: 'bold' } }} href={`https://www.pick-n-pull.co.il/#/invitation/${privateEvent.eventId}`}>{lang === 'heb' ? 'לחץ כאן' : 'Click here'}</a></div>
                <Button
                    onClick={() => {
                        openDialog({ content: <AddUpdateEventInvitation event={privateEvent} /> })
                    }}
                    style={{ ...buttonStyle, ...{ textTransform: 'none', background: 'linear-gradient(#282c34,black)', fontWeight: 'bold' } }}>
                    {lang === 'heb' ? 'עריכת אירוע' : 'Edit Event'}
                    <EditIcon style={{ marginLeft: '4px', width: '20px', height: '20px' }} />
                </Button>

                {function confirmationsElement() {
                    if (!confirmations) return null

                    const totalConfirmations = Object.entries(confirmations)
                    const headerTitle = { color: SECONDARY_WHITE }

                    const rideArrivals = totalConfirmations.reduce((prev, next) => {
                        return prev + next[1].reduce((innerPrev, innerNext) => innerPrev + (innerNext.rideArrival ? Number(innerNext.guests ?? innerNext.passengers ?? 1) : 0), 0)
                    }, 0)
                    const noRideArrivals = totalConfirmations.reduce((prev, next) => {
                        return prev + next[1].reduce((innerPrev, innerNext) => innerPrev + (!innerNext.rideArrival ? Number(innerNext.guests ?? 1) : 0), 0)
                    }, 0)

                    const totalConfirmationsNumber = noRideArrivals + rideArrivals
                    return <React.Fragment>
                        <h4 style={headerTitle}>{'סה"כ אישורי הגעה בהסעות: ' + rideArrivals}</h4>
                        <h4 style={headerTitle}>{'סה"כ אישורי הגעה ללא הסעה: ' + noRideArrivals}</h4>
                        <h4 style={headerTitle}>{'סה"כ אישורי הגעה: ' + totalConfirmationsNumber}</h4>
                        {totalConfirmations.map(entry => {
                            return (
                                <Accordion
                                    key={v4()}
                                    sx={{ border: '.1px solid white', borderRadius: '8px', background: BLACK_ELEGANT, color: SECONDARY_WHITE }}
                                    expanded={accordionHash[entry[0]]}>
                                    <AccordionSummary
                                        onClick={() => {
                                            let copy = accordionHash
                                            delete copy[entry[0]]
                                            setAccordionHash(copy)
                                        }}
                                        sx={{ maxHeight: 'min-content' }}>
                                        {function accordionSummary() {
                                            let to = 0, back = 0, twoWay = 0, total = 0;
                                            for (let confirmation of entry[1]) {
                                                const passengers = Number(confirmation.passengers ?? 1)
                                                switch (confirmation.directionType) {
                                                    case "1":
                                                        to += passengers
                                                        break;
                                                    case "2":
                                                        back += passengers
                                                        break;
                                                    case "3":
                                                        twoWay += passengers
                                                        break;
                                                }
                                                total += passengers;
                                            }

                                            const keyStyle: CSSProperties = {
                                                left: '8',
                                                bottom: '8',
                                                position: 'absolute'
                                            }
                                            const paragraphStyle: CSSProperties = {
                                                padding: '0px',
                                                margin: '0px'
                                            }
                                            return <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <h3 style={{ color: SECONDARY_WHITE, margin: '0px', padding: '0px' }}>{entry[0].split(' ל - ')[0]}</h3>
                                                <div style={{ alignSelf: 'start', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                    <p style={paragraphStyle}>{lang === 'heb' ? ('אישורים הלוך: ' + to) : ('To event direction approvals: ' + to)}</p>
                                                    <p style={paragraphStyle}>{lang === 'heb' ? ('אישורים חזור: ' + back) : ('Back from event direction approvals: ' + back)}</p>
                                                    <p style={paragraphStyle}>{lang === 'heb' ? ('אישורים הלוך-חזור: ' + twoWay) : ('Both directions approvals: ' + twoWay)}</p>
                                                    <p style={{ padding: '0px', margin: '0px', fontWeight: 'bold' }}>{lang === 'heb' ? ('סה"כ אישורי הגעה: ' + total) : ('Total ride approvals: ' + total)}</p>
                                                    <KeyboardDoubleArrowDownIcon
                                                        style={keyStyle}
                                                    />
                                                </div>
                                            </div>
                                        }()}
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <Stack key={entry[0]}>

                                            <Table style={{
                                                display: 'flex',
                                                background: PRIMARY_BLACK,
                                                flexDirection: 'column'
                                            }}>
                                                <TableHead style={{ width: '100%', minWidth: '280px', maxWidth: '300px' }}>

                                                    <TableRow>

                                                        <TableCell style={{ ...spanStyle, ...{ width: '100px', textAlign: 'center' } }}>
                                                            {'שם'}
                                                        </TableCell>
                                                        <TableCell style={{ ...spanStyle, ...{ width: '100px', textAlign: 'center' } }}>
                                                            {'כיוון'}
                                                        </TableCell>

                                                        <TableCell style={{ ...spanStyle, ...{ width: '50px', textAlign: 'center' } }}>
                                                            {'אורחים'}
                                                        </TableCell>
                                                        <TableCell style={{ ...spanStyle, ...{ width: '100px', textAlign: 'center' } }}>
                                                            {'טלפון'}
                                                        </TableCell>

                                                    </TableRow>

                                                </TableHead>


                                                {function confirmationsRideArrivalsTable() {
                                                    if (entry[1].length < 1) return null
                                                    return <React.Fragment>

                                                        <TableBody style={{
                                                            maxHeight: '300px',
                                                            overflowY: 'scroll',
                                                            width: '100%',
                                                            minWidth: '280px',
                                                            maxWidth: '300px'
                                                        }} >
                                    
                                                            {entry[1].map(confirmation =>

                                                                <HtmlTooltip
                                                                    key={v4()}
                                                                    sx={{

                                                                        fontFamily: 'Open Sans Hebrew', marginBottom: '34px', fontSize: '18px'
                                                                    }} title={'לחץ על מנת לערוך'} arrow>

                                                                    <TableRow
                                                                        onClick={() => {
                                                                            if( confirmation.rideArrival)
                                                                            openConfirmationUpdateDialog(confirmation)
                                                                            else alert('לא ניתן לערוך אישור ללא הסעה')
                                                                        }}
                                                                    >
                                                                        <TableCell style={{ ...spanStyle, ...{ cursor: 'pointer', width: '50px', textAlign: 'center', fontSize: '12px' } }}>
                                                                            {confirmation.userName}
                                                                        </TableCell>
                                                                        <TableCell style={{ ...spanStyle, ...{ cursor: 'pointer', width: '100px', textAlign: 'center', fontSize: '12px' } }}>
                                                                            {confirmation.rideArrival ? (confirmation.directionType === '1' ? 'הלוך' : confirmation.directionType === '2' ? 'חזור' : 'הלוך-חזור') : 'ללא'}
                                                                        </TableCell>

                                                                        <TableCell style={{ ...spanStyle, ...{ cursor: 'pointer', width: '50px', textAlign: 'center', fontSize: '12px' } }}>
                                                                            {confirmation.rideArrival ? confirmation.passengers : confirmation.guests}
                                                                        </TableCell>
                                                                        <TableCell style={{ ...spanStyle, ...{ cursor: 'pointer', width: '100px', textAlign: 'center', fontSize: '12px' } }}>
                                                                            {confirmation.phoneNumber}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </HtmlTooltip>)}
                                                        </TableBody>
                                                    </React.Fragment>
                                                }()}
                                            </Table>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>)
                        })}
                    </React.Fragment>
                }()}


            </Stack>
            {/* Admin Section */}
            {rides && location.state && <Stack
                style={{
                    marginTop: '32px',
                    border: '.5px solid white',
                    padding: '16px',
                    borderRadius: '16px',
                    background: BLACK_ELEGANT
                }}
                spacing={1}>
                <PrivateRides event={privateEvent} rides={rides} />
                <Stack style={{ marginBottom: '2px' }} >
                    <Stack direction={'row'} justifyContent={'center'}
                        alignItems={'center'}>
                        <label style={{ color: SECONDARY_WHITE }}>{'הרשמה דרושה'}</label>
                        <Checkbox
                            style={{ padding: '4px', background: RED_ROYAL, margin: '8px', color: SECONDARY_WHITE }}
                            checked={privateEvent.registrationRequired}
                            onChange={(e) => {
                                let checked = e.target.checked
                                privateEvent.registrationRequired = checked
                                let newEvent = { ...privateEvent, registrationRequired: checked }
                                setPrivateEvent(newEvent)
                                setHasChanges({ ...hasChanges, registrationRequired: true })
                            }} />

                    </Stack>
                    <Button
                        onClick={updateEvent}
                        disabled={!hasChanges['registrationRequired']}
                        style={{
                            ...buttonStyle, ...{
                                background: hasChanges['registrationRequired'] ? DARK_BLACK : 'gray'
                            }
                        }}>
                        שמור הגדרות הרשמה
                    </Button>
                    <label
                        style={{ ...simpleLabel, padding: '4px' }}
                    >{'בלחיצה על הכפתור, הגדרות יישמרו לפי תוכן תיבת הסימון'}</label>

                </Stack>

                <Stack style={{ marginBottom: '2px' }} >
                    <Stack direction={'row'} justifyContent={'center'}
                        alignItems={'center'}>
                        <label style={{ color: SECONDARY_WHITE }}>{'אישור הגעה מלא (לאירוע ולהסעה)'}</label>
                        <Checkbox
                            style={{ padding: '4px', background: RED_ROYAL, margin: '8px', color: SECONDARY_WHITE }}
                            checked={privateEvent.eventFullInvitation}
                            onChange={(e) => {
                                let checked = e.target.checked
                                privateEvent.eventFullInvitation = checked
                                let newEvent = { ...privateEvent, eventFullInvitation: checked }
                                setPrivateEvent(newEvent)
                                setHasChanges({ ...hasChanges, eventFullInvitation: true })
                            }} />

                    </Stack>
                    <Button
                        onClick={updateEvent}
                        disabled={!hasChanges['eventFullInvitation']}
                        style={{
                            ...buttonStyle, ...{
                                background: hasChanges['eventFullInvitation'] ? DARK_BLACK : 'gray'
                            }
                        }}>
                        שמור הגדרות אישור הגעה
                    </Button>
                    <label
                        style={{ ...simpleLabel, padding: '4px' }}
                    >{'בלחיצה על הכפתור, הגדרות יישמרו לפי תוכן תיבת הסימון'}</label>

                </Stack>
                <TextField
                    placeholder="אימייל משתמש"
                    id={'email_admin_update_field'}
                    style={{ background: 'white', borderRadius: '32px' }}
                    classes={classes} />
                <Button
                    onClick={updatePageManager}
                    style={buttonStyle}>
                    עדכן מנהל דף
                </Button>
                <label
                    style={simpleLabel}
                >{'בלחיצה על הכפתור, מנהל הדף יישתנה לפי אימייל'}</label>
            </Stack>}

        </InnerPageHolder> : <h3 style={{ color: SECONDARY_BLACK }}>אירוע פרטי לא נמצא</h3>}
    </PageHolder>
}