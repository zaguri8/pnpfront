import React, { CSSProperties, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useLoading } from "../../context/Loading";
import { BLACK_ELEGANT, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, ORANGE_RED_GRADIENT_BUTTON, PRIMARY_BLACK, RED_ROYAL, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import { PNPPrivateEvent, PNPPublicRide, PNPRideConfirmation } from "../../store/external/types";
import EditIcon from '@mui/icons-material/Edit';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { InnerPageHolder, PageHolder } from "../utilities/Holders";
import AddUpdateEventInvitation from "./AddUpdateEventInvitation";
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, List, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import SectionTitle from "../SectionTitle";
import AddUpdatePrivateEventRide from "./AddUpdatePrivateEventRide";
import { useFirebase } from "../../context/Firebase";
import { Unsubscribe } from "firebase/database";
import './InvitationStatistics.css'
import { v4 } from "uuid";
import $ from 'jquery'

import { useLanguage } from "../../context/Language";
import { makeStyles } from "@mui/styles";
import { textFieldStyle } from "../../settings/styles";
import { HtmlTooltip } from "../utilities/HtmlTooltip";
import { confirmationsPartition, default_no_arrival, getTotalAmountOfConfirmations, getPassengersAndGuests, getInvitationRowGuests } from "./invitationsHelper";

export const buttonStyle = {
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
export const checkBoxStyle = { padding: '4px', background: RED_ROYAL, margin: '8px', color: SECONDARY_WHITE }

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

    const deleteEvent = () => {
        if (privateEvent) {
            closeDialog()
            doLoad()
            firebase.realTime.removePrivateEvent(privateEvent.eventId)
                .then(() => {
                    cancelLoad()
                    alert('אירוע נמחק בהצלחה !')
                }).catch(() => {
                    cancelLoad()
                    alert('אירעתה שגיאה בעת מחיקת האירוע, אנא פנה למתכנת האתר')
                })
        }
    }

    const openDeleteDialog = () => {
        const divStyle = { padding: '8px' } as CSSProperties

        openDialog({
            content: <Stack style={divStyle} spacing={1}>
                <span className="spanStyle">
                    {`האם את/ה בטוח/ה שברצונך למחוק את ההזמנה לאירוע ${privateEvent?.eventTitle} ?`}
                </span>
                <p className="spanStyle">
                    {'מחיקת ההזמנה תמחוק גם את ההסעות לאירוע'}
                </p>

                <Button style={{
                    ...buttonStyle,
                    background: RED_ROYAL
                }} onClick={deleteEvent}>
                    {'מחק/י הזמנה'}
                </Button>
            </Stack>
        })
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

        function deleteConfirmation(pointer: PNPRideConfirmation) {
            doLoad()
            firebase.realTime.deleteConfirmation(
                privateEvent!.eventId,
                confirmation.userName,
                pointer
            ).then(() => {
                dialog("אישור נמחק בהצלחה")
                cancelLoad()
                window.location.reload()
            }).catch(() => { cancelLoad() })
        }

        openDialog({
            content: <Stack
                style={{ padding: '16px' }}
                alignItems={'center'}
                justifyContent={'center'}
                spacing={1}>
                <label style={{ color: SECONDARY_WHITE }}>{lang === 'heb' ? 'כיוון נסיעה' : 'Ride direction'}</label>
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
                <br />
                <Button
                    onClick={() => update(confirmationPointer)}
                    style={{ ...buttonStyle, width: 'fit-content' }}>
                    {'שמור שינויים'}
                </Button>

                <Button
                    onClick={() => deleteConfirmation(confirmationPointer)}
                    style={{
                        ...buttonStyle, ...{
                            background: RED_ROYAL,
                            width: 'fit-content'
                        }
                    }}>
                    {'מחק אישור'}
                </Button>
            </Stack>
        })
    }
    useEffect(() => {
        let unsub: Unsubscribe | undefined
        let unsub2: Unsubscribe | undefined
        let unsub3: Unsubscribe | undefined
        if (privateEvent) {
            unsub = firebase.realTime.getAllRideConfirmationByEventId(privateEvent.eventId, (confs) => {
                if (confs) {
                    setConfirmations(confirmationsPartition(confs))
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
                        setConfirmations(confirmationsPartition(confs))
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

    const ConfirmationsHeader = (props: {
        style: CSSProperties,
        totalConfirmationsNumber: number
    }) => {
        return privateEvent ? <React.Fragment>
            {<h4 style={props.style}>{'סה"כ אישורי הגעה לאירוע: ' + props.totalConfirmationsNumber}</h4>}
        </React.Fragment> : null

    }
    const PrivateRides = (props: { rides: PNPPublicRide[], event: PNPPrivateEvent }) => {

        return (<List style={{ width: '280px', marginLeft: 'auto', marginRight: 'auto' }}>
            <h1 style={{ color: SECONDARY_WHITE }}>{'פעולות אדמין'}</h1>
            <Stack spacing={2}>
                {function addRideButton() {
                    return <Button
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
                }()}


                {function renderRidesTable() {
                    if (props.rides.length > 0)
                        return (<table dir={'rtl'} style={{ width: '100%' }}  >

                            {function tableHead() {
                                return <thead>
                                    <tr style={{ background: 'black', color: SECONDARY_WHITE }}>
                                        <th>
                                            <span style={{ color: SECONDARY_WHITE }}>{`שם הסעה`}</span>
                                        </th>
                                        <th>
                                            <span style={{ color: SECONDARY_WHITE }}>{'פעולות'}</span>
                                        </th>
                                    </tr>
                                </thead>
                            }()}

                            {function tableBody() {
                                return <tbody >
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


                                                {function editRideButton() {
                                                    return <Button
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
                                                    </Button>
                                                }()}

                                                {function deleteRideButton() {
                                                    return (<Button key={v4()}
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
                                                    </Button>)
                                                }()}
                                            </th>
                                        </tr>)}
                                </tbody>
                            }()}
                        </table>)
                    else return <h4>{'אין נסיעות לאירוע זה'}</h4>
                }()}
            </Stack>
        </List>)
    }


    let simpleLabel = {
        color: SECONDARY_WHITE,
        fontSize: '12px'
    } as CSSProperties
    return <PageHolder style={{ background: 'none', paddingBottom: '0px' }}>

        {function invitationTitleSection() {
            if (privateEvent)
                return <React.Fragment>
                    <SectionTitle style={{ fontWeight: 'bold', fontSize: '24px', marginTop: '32px', paddingBottom: '4px', fontFamily: 'fantasy' }} title={privateEvent.eventTitle} />
                    <span style={{ marginTop: '-16px', fontFamily: 'Open Sans Hebrew', color: SECONDARY_WHITE, fontWeight: '200', fontSize: '20px' }}>{lang === 'heb' ? 'עמוד ניהול נסיעות' : 'Ride Supervision Page'}</span>
                </React.Fragment>
            else return null
        }()}
        {function renderInvitationSection() {
            if (privateEvent)
                return (<InnerPageHolder style={{ transform: 'translateY(-3%)', direction: 'rtl', background: 'none', border: 'none' }}>

                    <Stack spacing={2}>

                        <div style={{ border: '.5px solid white', background: 'black', padding: '8px', borderRadius: '8px' }}><span style={{ ...spanStyle }} >{lang === 'heb' ? 'קישור לדף הזמנה : ' : 'Link to invitation Page: '}</span>
                            <a style={{ ...spanStyle, ...{ fontWeight: 'bold' } }} href={`https://www.pick-n-pull.co.il/#/invitation/${privateEvent.eventId}`}>{lang === 'heb' ? 'לחצ/י כאן' : 'Click here'}</a></div>

                        {appUser && appUser.admin && <div style={{ border: '.5px solid white', background: 'black', padding: '8px', borderRadius: '8px' }}><span style={{ ...spanStyle }} >{lang === 'heb' ? 'קישור לדף ניהול : ' : 'Link to Managing Page: '}</span>
                            <a style={{ ...spanStyle, ...{ fontWeight: 'bold' } }} href={`https://www.pick-n-pull.co.il/#/producerpanel/invitation/${privateEvent.eventId}`}>{lang === 'heb' ? 'לחצ/י כאן' : 'Click here'}</a></div>}
                        <Button
                            onClick={() => {
                                openDialog({ content: <AddUpdateEventInvitation event={privateEvent} /> })
                            }}
                            style={{ ...buttonStyle, ...{ textTransform: 'none', background: 'linear-gradient(#282c34,black)', fontWeight: 'bold' } }}>
                            {lang === 'heb' ? 'עריכת אירוע' : 'Edit Event'}
                            <EditIcon style={{ marginLeft: '4px', width: '20px', height: '20px' }} />
                        </Button>

                        {function confirmationsElement() {
                            if (!confirmations) return <ConfirmationsHeader
                                totalConfirmationsNumber={0}
                                style={{ color: SECONDARY_WHITE }} />
                            const totalConfirmations = Object.entries(confirmations)
                            const headerTitle = { color: SECONDARY_WHITE }
                            function withRideArrivalConfirmations(withRide: boolean) {
                                if (!privateEvent) return null
                                return totalConfirmations.filter(x => !withRide ? x[0] === default_no_arrival : x[0] !== default_no_arrival).map(entry => {
                                    return (
                                        <React.Fragment>
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
                                                        let { passengers, guests } = getPassengersAndGuests(entry[0], entry[1])
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
                                                            <h3 style={{ color: SECONDARY_WHITE, margin: '0px', padding: '0px' }}>{entry[0] !== "null" ? entry[0].split(' ל - ')[0] : ""}</h3>
                                                            <div style={{ alignSelf: 'start', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                                                                {entry[0] !== default_no_arrival &&
                                                                    <React.Fragment>
                                                                        <p style={paragraphStyle}>{lang === 'heb' ? ('אישורים הלוך: ' + passengers.to) : ('To event direction approvals: ' + passengers.to)}</p>
                                                                        <p style={paragraphStyle}>{lang === 'heb' ? ('אישורים חזור: ' + passengers.back) : ('Back from event direction approvals: ' + passengers.back)}</p>
                                                                        <p style={paragraphStyle}>{lang === 'heb' ? ('אישורים הלוך-חזור: ' + passengers.twoWay) : ('Both directions approvals: ' + passengers.twoWay)}</p>
                                                                    </React.Fragment>}

                                                                <p style={{ padding: '0px', margin: '0px', fontWeight: 'bold' }}>{lang === 'heb' ? ((entry[0] === default_no_arrival ? ('סה"כ : ' + (Math.max(passengers.total, guests)) + " אישורים") : ('סה"כ אישורי הגעה: ' + passengers.total))) : ('Total ride approvals: ' + passengers.total)}</p>

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

                                                                    <TableCell className='spanStyle_3' sx={{ color: SECONDARY_WHITE }}>
                                                                        {'שם'}
                                                                    </TableCell>
                                                                    <TableCell className='spanStyle_3' sx={{ color: SECONDARY_WHITE }}>
                                                                        {'כיוון'}
                                                                    </TableCell>

                                                                    <TableCell className='spanStyle_4' sx={{ color: SECONDARY_WHITE }}>
                                                                        {'אורחים'}
                                                                    </TableCell>
                                                                    <TableCell className='spanStyle_3' sx={{ color: SECONDARY_WHITE }}>
                                                                        {'טלפון'}
                                                                    </TableCell>

                                                                </TableRow>

                                                            </TableHead>


                                                            {function confirmationsRideArrivalsTable() {
                                                                if (entry[1].length < 1) return null
                                                                return <React.Fragment>

                                                                    <TableBody className='confirmationsTable' >

                                                                        {entry[1].map(confirmation =>

                                                                            <HtmlTooltip
                                                                                key={v4()}
                                                                                className='tooltip_statistics'
                                                                                title={'לחץ על מנת לערוך'} arrow>

                                                                                <TableRow
                                                                                    onClick={() => {
                                                                                        if (confirmation.rideArrival)
                                                                                            openConfirmationUpdateDialog(confirmation)
                                                                                        else alert('לא ניתן לערוך אישור ללא הסעה')
                                                                                    }}
                                                                                >
                                                                                    <TableCell className='spanStyle_3_small' sx={{ color: SECONDARY_WHITE }}>
                                                                                        {confirmation.userName}
                                                                                    </TableCell>
                                                                                    <TableCell className='spanStyle_3_small' sx={{ color: SECONDARY_WHITE }}>
                                                                                        {entry[0] === default_no_arrival ? 'ללא' : confirmation.rideArrival ? (confirmation.directionType === '1' ? 'הלוך' : confirmation.directionType === '2' ? 'חזור' : 'הלוך-חזור') : 'ללא'}
                                                                                    </TableCell>

                                                                                    <TableCell className='spanStyle_4_small' sx={{ color: SECONDARY_WHITE }}>
                                                                                        {getInvitationRowGuests(privateEvent, entry[0], confirmation)}
                                                                                    </TableCell>
                                                                                    <TableCell className='spanStyle_3_small' sx={{ color: SECONDARY_WHITE }}>
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
                                            </Accordion></React.Fragment>)
                                })
                            }
                            const labelStyle = { color: SECONDARY_WHITE, fontSize: '20px' } as CSSProperties

                            return <React.Fragment>

                                <ConfirmationsHeader
                                    totalConfirmationsNumber={getTotalAmountOfConfirmations(privateEvent, confirmations)}
                                    style={headerTitle} />
                                {withRideArrivalConfirmations(false)}
                                {privateEvent.eventWithPassengers && <p style={labelStyle}>אישורי הגעה להסעות</p>}
                                {withRideArrivalConfirmations(true)}
                            </React.Fragment>
                        }()}


                    </Stack>
                    {/* Admin Section */}

                    {function renderAdminSection() {
                        if (rides && location.state)
                            return (<Stack
                                className='admin_section_invitation_stats'
                                spacing={1}>
                                <PrivateRides event={privateEvent} rides={rides} />

                                {function registrationRequired() {
                                    return <Stack style={{ marginBottom: '2px' }} >
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
                                }()}


                                {function eventConfirmationSettings() {
                                    return <Stack style={{ marginBottom: '2px' }} >
                                        <Stack direction={'row'} justifyContent={'center'}
                                            alignItems={'center'}>
                                            <label style={{ color: SECONDARY_WHITE }}>{'בקש מספר אורחים'}</label>
                                            <Checkbox
                                                style={{ padding: '4px', background: RED_ROYAL, margin: '8px', color: SECONDARY_WHITE }}
                                                checked={privateEvent.eventWithGuests}
                                                onChange={(e) => {
                                                    let checked = e.target.checked
                                                    privateEvent.eventWithGuests = checked
                                                    let newEvent = { ...privateEvent, eventWithGuests: checked }
                                                    setPrivateEvent(newEvent)
                                                    setHasChanges({ ...hasChanges, eventWithGuests: true })
                                                }} />

                                        </Stack>

                                        <Stack direction={'row'} justifyContent={'center'}
                                            alignItems={'center'}>
                                            <label style={{ color: SECONDARY_WHITE }}>{'בקש מספר נוסעים'}</label>
                                            <Checkbox
                                                style={{ padding: '4px', background: RED_ROYAL, margin: '8px', color: SECONDARY_WHITE }}
                                                checked={privateEvent.eventWithPassengers}
                                                onChange={(e) => {
                                                    let checked = e.target.checked
                                                    privateEvent.eventWithPassengers = checked
                                                    let newEvent = { ...privateEvent, eventWithPassengers: checked }
                                                    setPrivateEvent(newEvent)
                                                    setHasChanges({ ...hasChanges, eventWithPassengers: true })
                                                }} />
                                        </Stack>

                                        <Button
                                            onClick={updateEvent}
                                            disabled={!hasChanges['eventWithPassengers'] && !hasChanges['eventWithGuests']}
                                            style={{
                                                ...buttonStyle, ...{
                                                    background: (hasChanges['eventWithGuests'] || hasChanges['eventWithPassengers']) ? DARK_BLACK : 'gray'
                                                }
                                            }}>
                                            שמור הגדרות אישור הגעה
                                        </Button>

                                        <label
                                            style={{ ...simpleLabel, padding: '4px' }}
                                        >{'בלחיצה על הכפתור, הגדרות יישמרו לפי תוכן תיבת הסימון'}</label>

                                    </Stack>
                                }()}
                                {function updatePageManagerSection() {
                                    return <React.Fragment>
                                        <TextField
                                            placeholder="אימייל משתמש"
                                            id={'email_admin_update_field'}
                                            style={{ background: 'white', borderRadius: '32px' }}
                                            classes={classes} />
                                        <Button
                                            onClick={updatePageManager}
                                            style={buttonStyle}>
                                            עדכנ/י מנהל דף
                                        </Button>
                                        <label
                                            style={simpleLabel}
                                        >{'בלחיצה על הכפתור, מנהל הדף יישתנה לפי אימייל'}</label>

                                        <Button
                                            onClick={openDeleteDialog}
                                            style={{
                                                ...buttonStyle,
                                                background: RED_ROYAL
                                            }}>
                                            {'מחק/י הזמנה'}
                                        </Button>
                                    </React.Fragment>
                                }()}
                            </Stack>)
                        else return null
                    }()}
                </InnerPageHolder>)
            else return <h3 style={{ color: SECONDARY_BLACK }}>אירוע פרטי לא נמצא</h3>
        }()}

    </PageHolder>
}