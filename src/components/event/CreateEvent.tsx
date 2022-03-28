import { FormControl, InputLabel, TextField, Stack, TextFieldProps, Select, MenuItem, Button, Checkbox } from "@mui/material";
import { useLanguage } from "../../context/Language";
import { ACCEPT_TERMS_REQUEST, CONTINUE_TO_CREATE, CREATE_EVENT, CREATE_EVENT_TITLE, EVENT_ADDRESS, EVENT_DATE, EVENT_END, EVENT_NUMBER_PPL, EVENT_START, EVENT_TITLE, EVENT_TYPE, FILL_ALL_FIELDS, PICK_IMAGE, SIDE, TERMS_OF_USE } from "../../settings/strings";
import { InnerPageHolder, PageHolder } from "../utilities/Holders";
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from "draft-js";
import SectionTitle from "../SectionTitle";
import $ from 'jquery'
import { useEffect, useState } from "react";
import Places from "../utilities/Places";
import { PNPEvent } from '../../store/external/types'
import { makeStyles } from "@mui/styles";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker, TimePicker } from "@mui/lab"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from "react-draft-wysiwyg";
import { event_placeholder } from "../../assets/images";
import { useFirebase } from "../../context/Firebase";
import { useLoading } from "../../context/Loading";
import { submitButton } from "../../settings/styles";
import { isValidEvent } from "../../store/validators";
import { HtmlTooltip } from "../utilities/HtmlTooltip";
import { DARKER_BLACK_SELECTED, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_WHITE, SECONDARY_WHITE } from "../../settings/colors";
import Spacer from "../utilities/Spacer";
import { useNavigate } from "react-router";
import { dateStringFromDate, reverseDate, unReverseDate } from "../utilities/functions";

export default function CreateEvent() {
    const { lang } = useLanguage()
    const [editorState, setEditorState] = useState<EditorState | undefined>()
    const { doLoad, cancelLoad, openDialog, closeDialog } = useLoading()
    const { user, firebase } = useFirebase()
    const nav = useNavigate()

    const [termsOfUser, setTermsOfUse] = useState<boolean>(false)
    const eventTypes = [
        "מסיבות ומועדונים",
        "משחקי כדורגל",
        "הופעות",
        "פסטיבלים",
        "ברים",
        "ספורט כללי",
        "אירועי ילדים"
    ]


    const [selectedEventType, setSelectedEventType] = useState<string>(eventTypes[0])

    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | undefined>()
    const [image, setImage] = useState<string>('')
    const [pnpEvent, setPnpEvent] = useState<PNPEvent>({
        eventName: 'null',
        eventLocation: 'null',
        eventId: 'null',
        eventCanAddRides: true,
        eventProducerId: user ? user.uid : 'null',
        eventDate: dateStringFromDate(new Date()),
        eventType: selectedEventType ?? 'null',
        eventDetails: 'null',
        eventPrice: 'null',
        eventHours: { startHour: 'null', endHour: 'null' },
        eventAgeRange: { minAge: 'null', maxAge: 'null' },
        expectedNumberOfPeople: 'null',
        eventImageURL: 'null'
    })
    const [startDate, setStartDate] = useState<string>('00:00')
    const [endDate, setEndDate] = useState<string>('00:00')
    const onEditorStateChanged = (state: EditorState) => {
        setEditorState(state)
        if (editorState) {
            const eventDetailsHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()))
            setPnpEvent({ ...pnpEvent, ...{ eventDetails: eventDetailsHTML } })
        }
    }



    const updateEventHours = (type: 'end' | 'start', event: string | undefined | null) => {
        const dict = type === 'end' ? { startHour: event as string } : { endHour: event as string }
        type === 'end' ? setEndDate(event as string) : setStartDate(event as string)
        event && setPnpEvent({
            ...pnpEvent, ...{
                eventHours: {
                    ...pnpEvent.eventHours, ...dict
                }
            }
        })
    }
    const updateEventAddress = (address: string) => {
        setPnpEvent({ ...pnpEvent, ...{ eventLocation: address } })
    }

    const updateEventDate = (event: string | undefined | null) => {

        if (event as string) {
            const split = reverseDate(event)
            setPnpEvent({ ...pnpEvent, ...{ eventDate: split } })
        }
    }
    const useStyles = makeStyles(() => ({
        root: {
            "& .MuiOutlinedInput-root": {
                background: SECONDARY_WHITE,
                borderRadius: '32px',
                padding: '0px',
                border: '.1px solid white',
                color: PRIMARY_BLACK, ...{
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
        }, noBorder: {
            border: "1px solid red",
            outline: 'none'
        }
    }));


    const submitCreateEvent = (stage: number) => {
        if (stage === 1) {
            const dialogTitle = <span style={{ padding: '16px', minWidth: '300px', maxWidth: '400px', color: SECONDARY_WHITE, fontSize: '14px' }}>{lang === 'heb' ? 'בטום יצירת האירוע יישלחו הפרטים לבדיקה ולאחר שייעברו אישור יופיעו באירועי פיק אנד פול, יצירת אירוע זה תאושר אך ורק במידה ומפיק/ת האירוע מאשר/ת את תנאי התקנון ומסכים/ה לתנאי השימוש, האם קראת את התקנון ותהייה מעוניין/ת להמשיך ליצירת האירוע ?' : 'The event submission will go through a procidure of approbal by our staff and when approved will be shown in the main event area, by creating an event the producer accepts the terms of service of pick and pull, are you accepting the terms and would like to continue creation ?'}</span>
            openDialog({
                content: <div>
                    {dialogTitle}
                    <Spacer offset={1} />
                    <Button
                        onClick={() => {
                            submitCreateEvent(2)
                        }}
                        sx={{ ...submitButton(false), ... { width: '75%', margin: '0px', padding: '8px' } }} >
                        {CREATE_EVENT(lang)}</Button>

                </div>
            })
        } else if (stage === 2) {
            if (imageBuffer) {
                doLoad()
                firebase.realTime.createEvent(pnpEvent,
                    imageBuffer)
                    .then(() => {
                        alert('האירוע נוצר בהצלחה ! לאחר שייעבור אישור של צוות האתר, יופיע האירוע בדף הבית')
                        cancelLoad()
                        closeDialog()
                        nav('/')
                    }).catch(() => {
                        alert('אירעתה שגיאה בעת יצירת האירוע, אנא פנא לצוות האתר')
                        closeDialog()
                        cancelLoad()
                    })
            } else {
                alert('אירעתה בעיה ביצירת האירוע אנא נסה שוב מאוחר יותר')
                closeDialog()
            }
        }

    }
    const classes = useStyles()

    const formatDateHours = (date: Date) => {
        const hours = date.getHours() + ":" + date.getMinutes()
        return hours
    }

    const handleTermsOfUseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTermsOfUse(e.target.checked)
    }



    return (<PageHolder>
        <SectionTitle title={CREATE_EVENT_TITLE(lang)} style={{}} />
        <InnerPageHolder>

            <Stack spacing={3} >
                <FormControl style={{ width: '80%', alignSelf: 'center' }}>
                    <input onChange={(event) => {
                        if (event.target.files) {
                            setImage(URL.createObjectURL(event.target.files[0]))
                            event.target.files[0].arrayBuffer()
                                .then(buff => {
                                    setImageBuffer(buff)
                                    setPnpEvent({ ...pnpEvent, ...{ eventImageURL: 'valid' } })
                                })
                                .catch(() => {
                                    alert('אירעתה בעיה בבחירת התמונה אנא פנא לצוות האתר')
                                })

                            $('#menu_event_create_image').css('borderRadius', '75px')
                        }

                    }} type="file" id="files_create_event" style={{ display: 'none' }} />
                    <img id='menu_event_create_image' alt='' src={image ? image : event_placeholder} style={{

                        alignSelf: 'center',
                        minHeight: '150px',
                        width: '80%',
                        height: '75px'
                    }} />          <label style={{
                        color: PRIMARY_WHITE,
                        padding: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        alignSelf: 'center',
                        marginTop: '16px',
                        width: 'fit-content',
                        backgroundImage: ORANGE_GRADIENT_PRIMARY
                    }} onChange={(e) => alert(e)} htmlFor='files_create_event'>{PICK_IMAGE(lang, true)}</label>
                </FormControl>
                <FormControl style={{ width: '80%', alignSelf: 'center' }}>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_TITLE(lang)}</label>
                    <TextField
                        className={classes.root}
                        placeholder={EVENT_TITLE(lang)}
                        onChange={(event) => { setPnpEvent({ ...pnpEvent, ...{ eventName: event.target.value } }) }}
                        dir='rtl'
                        sx={{

                            direction: SIDE(lang)
                        }} />
                </FormControl>

                <FormControl style={{ width: '80%', alignSelf: 'center' }}>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_NUMBER_PPL(lang)}</label>
                    <TextField
                        className={classes.root}
                        placeholder={EVENT_NUMBER_PPL(lang)}
                        onChange={(event) => { setPnpEvent({ ...pnpEvent, ...{ expectedNumberOfPeople: event.target.value } }) }}
                        dir='rtl'
                        type='number'
                        sx={{

                            direction: SIDE(lang)
                        }} />
                </FormControl>

                <FormControl style={{ width: '80%', alignSelf: 'center' }}>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{lang === 'heb' ? 'הכנס מחיר' : 'Enter price'}</label>
                    <TextField
                        className={classes.root}
                        placeholder={lang === 'heb' ? 'הכנס מחיר' : 'Price'}
                        onChange={(event) => { setPnpEvent({ ...pnpEvent, ...{ eventPrice: event.target.value } }) }}
                        dir='rtl'
                        type='number'
                        sx={{

                            direction: SIDE(lang)
                        }} />
                </FormControl>


                <FormControl style={{ width: '80%', alignSelf: 'center', direction: SIDE(lang) }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <label style={{ padding: '4px', color: SECONDARY_WHITE, direction: SIDE(lang) }}>{lang === 'heb' ? `גיל מינ' ` : 'Min age'}</label>
                        <TextField
                            className={classes.root}
                            placeholder={lang === 'heb' ? `גיל מינ' ` : 'Min age'}
                            onChange={(event) => { setPnpEvent({ ...pnpEvent, ...{ eventAgeRange: { ...pnpEvent.eventAgeRange, ...{ minAge: event.target.value } } } }) }}
                            dir='rtl'
                            type='number'
                            sx={{

                                direction: SIDE(lang)
                            }} />
                        <label style={{ padding: '4px', color: SECONDARY_WHITE, direction: SIDE(lang) }}>{lang === 'heb' ? `גיל מקס' ` : 'Max age'}</label>
                        <TextField
                            className={classes.root}
                            placeholder={lang === 'heb' ? `גיל מקס' ` : 'Max age'}

                            onChange={(event) => { setPnpEvent({ ...pnpEvent, ...{ eventAgeRange: { ...pnpEvent.eventAgeRange, ...{ maxAge: event.target.value } } } }) }}
                            dir='rtl'
                            type='number'
                            sx={{

                                direction: SIDE(lang)
                            }} />

                    </div>

                </FormControl>
                <FormControl style={{ width: '80%', alignSelf: 'center' }}>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_ADDRESS(lang)}</label>
                    <Places value={''} handleAddressSelect={updateEventAddress} types={['address']} className={''} id={''} fixed style={{ width: '100%' }} placeHolder={EVENT_ADDRESS(lang)} />

                </FormControl>
                <FormControl style={{ width: '80%', alignSelf: 'center' }}>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_DATE(lang)}</label>
                    <TextField

                        value={unReverseDate(pnpEvent.eventDate)}
                        classes={{ root: classes.root }}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: SECONDARY_WHITE }
                        }}

                        type='date'
                        onChange={(e) => updateEventDate(e.target.value)}
                        required />
                </FormControl>
                <FormControl style={{ width: '80%', alignSelf: 'center' }}>

                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_START(lang)}</label>
                    <TextField


                        value={startDate}
                        classes={{ root: classes.root }}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: SECONDARY_WHITE }
                        }}

                        type='time'
                        onChange={(e) => updateEventHours('start', e.target.value)}
                        required />
                </FormControl>
                <FormControl style={{ width: '80%', alignSelf: 'center' }}>

                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_END(lang)}</label>
                    <TextField
                        value={endDate}
                        classes={{ root: classes.root }}

                        InputLabelProps={{
                            shrink: true,
                            style: { color: SECONDARY_WHITE }
                        }}

                        type='time'
                        onChange={(e) => updateEventHours('end', e.target.value)}
                        required />
                </FormControl>

                <FormControl style={{ width: '80%', alignSelf: 'center' }} fullWidth>

                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}
                        id="create_event_type_select">{EVENT_TYPE(lang)}</label>
                    <Select
                        labelId="create_event_type_select"

                        id="create_event_type_select"
                        value={selectedEventType}
                        style={{ background: DARK_BLACK, borderRadius: '32px', color: SECONDARY_WHITE }}
                        onChange={(e) => {
                            setPnpEvent({ ...pnpEvent, ...{ eventType: e.target.value } })
                            setSelectedEventType(e.target.value)
                        }}
                    >

                        {eventTypes.map(type => <MenuItem key={type + "Create_Event_Menu_Item"} value={type}>{type}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl style={{ width: '90%', alignSelf: 'center' }}>
                    <Editor
                        editorStyle={{ background: SECONDARY_WHITE, minHeight: '200px' }}
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChanged}
                    />
                </FormControl>
                <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!isValidEvent(pnpEvent) ? FILL_ALL_FIELDS(lang) : !termsOfUser ? ACCEPT_TERMS_REQUEST(lang) : CONTINUE_TO_CREATE(lang)} arrow>
                    <span>
                        <Button
                            onClick={() => {
                                submitCreateEvent(1)
                            }}
                            sx={{ ...submitButton(false), ... { margin: '0px', padding: '8px' } }} disabled={!isValidEvent(pnpEvent) || !termsOfUser}> {CREATE_EVENT(lang)}</Button>
                    </span>
                </HtmlTooltip>
            </Stack>
            <span ><InputLabel style={{ paddingTop: '16px', fontSize: '14px', color: SECONDARY_WHITE }}>{TERMS_OF_USE(lang)}</InputLabel>
                <Checkbox
                    style={{ background: ORANGE_GRADIENT_PRIMARY, color: SECONDARY_WHITE, margin: '8px' }}
                    onChange={handleTermsOfUseChange}
                    name={TERMS_OF_USE(lang)} value={TERMS_OF_USE(lang)} />
            </span>
        </InnerPageHolder>
    </PageHolder >)

}