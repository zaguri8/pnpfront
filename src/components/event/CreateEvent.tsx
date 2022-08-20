import { FormControl, InputLabel, TextField, Stack, TextFieldProps, Select, MenuItem, Button, Checkbox } from "@mui/material";
import { useLanguage } from "../../context/Language";
import { ACCEPT_TERMS_REQUEST, CONTINUE_TO_CREATE, CREATE_EVENT, CREATE_EVENT_TITLE, EVENT_ADDRESS, EVENT_DATE, EVENT_END, EVENT_NUMBER_PPL, EVENT_START, EVENT_TITLE, EVENT_TYPE, FILL_ALL_FIELDS, PICK_IMAGE, SIDE, TERMS_OF_USE } from "../../settings/strings";
import { InnerPageHolder, PageHolder } from "../utilities/Holders";
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from "draft-js";
import '../../App.css'
import SectionTitle from "../other/SectionTitle";
import $ from 'jquery'
import { useEffect, useState } from "react";
import Places from "../utilities/Places";

import { PNPEvent, PNPEventAgeRange, PNPEventAttention } from '../../store/external/types'
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
import { submitButton, textFieldStyle } from "../../settings/styles";
import { isValidEvent } from "../../store/validators";
import { HtmlTooltip } from "../utilities/HtmlTooltip";
import { DARKER_BLACK_SELECTED, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, ORANGE_GRADIENT_SECONDARY, PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_PINK, PRIMARY_WHITE, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import Spacer from "../utilities/Spacer";
import { useNavigate } from "react-router";
import { dateStringFromDate, reverseDate, unReverseDate } from "../utilities/functions";
import { v4 } from "uuid";
import { getEventType, getEventTypeFromString } from "../../store/external/converters";
import { getCurrentDate } from "../../utilities";
import { getDefaultPublicEvent } from "../../store/external/helpers";
import { useHeaderBackgroundExtension } from "../../context/HeaderContext";

export default function CreateEvent() {
    const { lang } = useLanguage()
    const [editorState, setEditorState] = useState<EditorState | undefined>()
    const { doLoad, cancelLoad, openDialog, closeDialog } = useLoading()
    const { user, firebase, appUser } = useFirebase()
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

    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | undefined>()
    const [image, setImage] = useState<string>('')
    const [pnpEvent, setPnpEvent] = useState<PNPEvent>(getDefaultPublicEvent(user))
    const [startDate, setStartDate] = useState<string>('00:00')
    const [endDate, setEndDate] = useState<string>('00:00')



    const { hideHeader, showHeader } = useHeaderBackgroundExtension()
    useEffect(() => {
        hideHeader();
        return () => showHeader()
    })

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

    const updateEventAttention1 = (attention: string) => {
        setPnpEvent({ ...pnpEvent, ...{ eventAttention: { eventAttention1: attention, eventAttention2: pnpEvent.eventAttention ? pnpEvent.eventAttention.eventAttention2 : 'unset' } } })
    }
    const updateEventAttention2 = (attention: string) => {
        setPnpEvent({ ...pnpEvent, ...{ eventAttention: { eventAttention2: attention, eventAttention1: pnpEvent.eventAttention ? pnpEvent.eventAttention.eventAttention1 : 'unset' } } })
    }

    const updateEventDate = (event: string | undefined | null) => {

        if (event as string) {
            const split = reverseDate(event)
            setPnpEvent({ ...pnpEvent, ...{ eventDate: split } })
        }
    }


    const useStyles = makeStyles(() => textFieldStyle(SECONDARY_WHITE,{background:PRIMARY_BLACK,border:`1px solid ${PRIMARY_PINK}`}));


    const [mandatory, setMandatory] = useState<{ [id: number]: string }>({
        0: '',
        1: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: 'clubs',
    })

    const submitCreateEvent = () => {

        function isAllFieldsValid() {
            let allFieldValids = true
            mandatory && Object.entries(mandatory).forEach(entry => {
                if (!entry[1] || entry[1].length < 1) {
                    $("#arm" + entry[0]).css({ 'boxSizing': 'padding-box', 'border': '2px solid red', 'borderRadius': '32px' })
                    allFieldValids = false
                }
            })
            return allFieldValids
        }
        const valid = isAllFieldsValid()

        if (!valid || !termsOfUser) {
            return
        }
        const dialogTitle = lang === 'heb' ? `תודה ${appUser?.name ?? ''}, הבקשה ליצירת האירוע התקבלה. האירוע יאושר על ידי ההנהלה תוך זמן קצר. לאחר האישור האירוע יופיע בדף הבית תחת אותה קטגוריה.` : `Thanks ${appUser?.name ?? ''}, Event creation request accepted.and will be Approved by management shortly. One the event is approvedm, will appear on the home page under the same category.`
        if (imageBuffer) {
            doLoad()
            firebase.realTime.createEvent(pnpEvent,
                imageBuffer)
                .then(() => {
                    cancelLoad()
                    nav('/')
                    openDialog({
                        content: <div style={{ color: SECONDARY_WHITE }}>
                            {dialogTitle}
                            <Spacer offset={1} />
                        </div>
                    })
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
        <InnerPageHolder style={{ background: 'black', border: '1px solid gray' }}>

            <Stack spacing={3} style={{ width: '100%',maxWidth:'300px' }} >
                <FormControl style={{ width: '100%', alignSelf: 'center' }}>
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
                        }

                    }} type="file" id="files_create_event" style={{ display: 'none' }} />
                    <img id='menu_event_create_image' alt='' src={image ? image : event_placeholder} style={{

                        alignSelf: 'center',
                        minHeight: '150px',
                        width: '80%',
                        maxWidth: '225px',
                        height: '75px'
                    }} />          <label style={{
                        color: PRIMARY_ORANGE,
                        fontWeight:'bold',
                        padding: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        alignSelf: 'center',
                        marginTop: '16px',
                        width: 'fit-content',
                        backgroundColor: 'transparent'
                    }} onChange={(e) => alert(e)} htmlFor='files_create_event'>{PICK_IMAGE(lang, true)}</label>
                </FormControl>
                <FormControl style={{ width: '100%', alignSelf: 'center' }}>
                    <label style={{ padding: '4px', color: PRIMARY_ORANGE }}>{EVENT_TITLE(lang)}</label>
                    <TextField
                    
                        className={classes.root}
                        id={`arm${0}`}
                        placeholder={EVENT_TITLE(lang)}
                        onChange={(event) => {
                            (event.target.value as string && setMandatory({ ...mandatory, ...{ 0: event.target.value } }))

                            setPnpEvent({ ...pnpEvent, ...{ eventName: event.target.value } })

                            $(`#arm${0}`).css('border', 'none')
                        }}
                        dir='rtl'
                        sx={{
                            direction: SIDE(lang)
                        }} />
                </FormControl>

                <FormControl style={{ width: '100%', alignSelf: 'center' }}>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_NUMBER_PPL(lang)}</label>
                    <TextField
                        id={`arm${1}`}
                        className={classes.root}
                        placeholder={EVENT_NUMBER_PPL(lang)}
                        onChange={(event) => {
                            (event.target.value as string && setMandatory({ ...mandatory, ...{ 1: event.target.value } }))
                            setPnpEvent({ ...pnpEvent, ...{ expectedNumberOfPeople: event.target.value } })
                            $(`#arm${1}`).css('border', 'none')
                        }}
                        dir='rtl'
                        type='number'
                        sx={{

                            direction: SIDE(lang)
                        }} />
                </FormControl>

                {appUser && appUser.admin && <FormControl style={{ width: '100%', alignSelf: 'center' }}>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{lang === 'heb' ? 'שימו לב 1 (אופציונלי)' : 'Attention 1 (Optional)'}</label>
                    <TextField

                        className={classes.root}
                        placeholder={lang === 'heb' ? 'הכנס שימו לב 1' : 'Enter Attention 1 (Optional)'}
                        onChange={(event) => { updateEventAttention1(event.target.value) }}
                        dir='rtl'
                        type='text'
                        sx={{

                            direction: SIDE(lang)
                        }} />
                </FormControl>}

                {appUser && appUser.admin && <FormControl style={{ width: '100%', alignSelf: 'center' }}>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{lang === 'heb' ? 'שימו לב 2 (אופציונלי)' : 'Attention 2 (Optional)'}</label>
                    <TextField
                        className={classes.root}
                        placeholder={lang === 'heb' ? 'הכנס שימו לב 2' : 'Enter Attention 2 (Optional)'}
                        onChange={(event) => { updateEventAttention2(event.target.value) }}
                        dir='rtl'
                        type='text'
                        sx={{

                            direction: SIDE(lang)
                        }} />
                </FormControl>}


                <FormControl style={{ width: '100%', alignSelf: 'center', direction: SIDE(lang) }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <label style={{ padding: '4px', color: SECONDARY_WHITE, direction: SIDE(lang) }}>{lang === 'heb' ? `גיל מינ' ` : 'Min age'}</label>
                        <TextField
                            id={`arm${3}`}
                            className={classes.root}
                            placeholder={lang === 'heb' ? `גיל מינ' ` : 'Min age'}
                            onChange={(event) => {
                                (event.target.value as string && setMandatory({ ...mandatory, ...{ 3: event.target.value } }))
                                setPnpEvent({ ...pnpEvent, ...{ eventAgeRange: { ...pnpEvent.eventAgeRange, ...{ minAge: event.target.value } } } })
                                $(`#arm${3}`).css('border', 'none')
                            }}
                            dir='rtl'
                            type='number'
                            sx={{

                                direction: SIDE(lang)
                            }} />
                        <label style={{ padding: '4px', color: SECONDARY_WHITE, direction: SIDE(lang) }}>{lang === 'heb' ? `גיל מקס' ` : 'Max age'}</label>
                        <TextField
                            className={classes.root}
                            placeholder={lang === 'heb' ? `גיל מקס' ` : 'Max age'}
                            id={`arm${4}`}
                            onChange={(event) => {
                                (event.target.value as string && setMandatory({ ...mandatory, ...{ 4: event.target.value } }))
                                setPnpEvent({ ...pnpEvent, ...{ eventAgeRange: { ...pnpEvent.eventAgeRange, ...{ maxAge: event.target.value } } } })
                                $(`#arm${4}`).css('border', 'none')
                            }}
                            dir='rtl'
                            type='number'
                            sx={{

                                direction: SIDE(lang)
                            }} />

                    </div>

                </FormControl>
                <FormControl style={{ width: '100%', alignSelf: 'center' }}>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_ADDRESS(lang)}</label>
                    <Places value={''}
                        extras={{ id: `arm${5}` }}
                        handleAddressSelect={(address: string) => {
                            (address as string && setMandatory({ ...mandatory, ...{ 5: address } }))
                            updateEventAddress(address)
                            $(`#arm${5}`).css('border', 'none')
                        }} types={['address']} className={''} id={{}} fixed={false} style={{ width: '100%', borderRadius: '32px', color: SECONDARY_WHITE, background: 'none' }} placeHolder={EVENT_ADDRESS(lang)} />

                </FormControl>
                <FormControl style={{ width: '100%', alignSelf: 'center' }}>
                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_DATE(lang)}</label>

                    <TextField
                        id={`arm${6}`}
                        value={unReverseDate(pnpEvent.eventDate)}
                        classes={{ root: classes.root }}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: SECONDARY_WHITE }
                        }}

                        type='date'
                        onChange={(e) => {
                            (e.target.value as string && setMandatory({ ...mandatory, ...{ 6: e.target.value } }))
                            updateEventDate(e.target.value)
                            $(`#arm${6}`).css('border', 'none')
                        }}
                        required />
                </FormControl>
                <FormControl style={{ width: '100%', alignSelf: 'center' }}>

                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_START(lang)}</label>
                    <TextField
                        id={`arm${7}`}

                        value={startDate}
                        classes={{ root: classes.root }}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: SECONDARY_WHITE }
                        }}

                        type='time'
                        onChange={(e) => {
                            (e.target.value as string && setMandatory({ ...mandatory, ...{ 7: e.target.value } }))
                            updateEventHours('start', e.target.value)
                            $(`#arm${7}`).css('border', 'none')
                        }}
                        required />
                </FormControl>
                <FormControl style={{ width: '100%', alignSelf: 'center' }}>

                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_END(lang)}</label>
                    <TextField
                        value={endDate}
                        classes={{ root: classes.root }}
                        id={`arm${8}`}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: SECONDARY_WHITE }
                        }}

                        type='time'
                        onChange={(e) => {
                            (e.target.value as string && setMandatory({ ...mandatory, ...{ 8: e.target.value } }))
                            updateEventHours('end', e.target.value)
                            $(`#arm${8}`).css('border', 'none')
                        }}
                        required />
                </FormControl>

                <FormControl style={{ width: '100%', alignSelf: 'center' }} fullWidth>

                    <label style={{ padding: '4px', color: SECONDARY_WHITE }}
                        id="create_event_type_select">{EVENT_TYPE(lang)}</label>
                    <Select
                        labelId="create_event_type_select"

                        id={`arm${9}`}
                        value={getEventTypeFromString(pnpEvent.eventType!)}
                        style={{ background: 'transparent',fontWeight:'bold', fontFamily: 'Open Sans Hebrew', borderRadius: '32px', color: PRIMARY_ORANGE,border:`1px solid ${PRIMARY_ORANGE}` }}
                        onChange={(e) => {
                            (e.target.value as string && setMandatory({ ...mandatory, ...{ 9: e.target.value } }))
                            setPnpEvent({ ...pnpEvent, ...{ eventType: getEventType({ ...pnpEvent, ...{ eventType: e.target.value } }) } })
                            $(`#arm${9}`).css('border', 'none')
                        }}
                    >

                        {(appUser && appUser.admin ? eventTypes.concat(['חתונות', 'אירועים פרטיים']) : eventTypes).map(type => <MenuItem key={type + "Create_Event_Menu_Item"} style={{ fontFamily: 'Open Sans Hebrew' }} value={type}>{type}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl style={{ width: '100%', alignSelf: 'center' }}>
                    <Editor
                        editorStyle={{ background: SECONDARY_WHITE, minHeight: '200px', maxWidth: '100%' }}
                        editorState={editorState}
                        wrapperStyle={{ maxWidth: '100%' }}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChanged}
                    />
                </FormControl>
                <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!isValidEvent(pnpEvent) ? FILL_ALL_FIELDS(lang) : !termsOfUser ? ACCEPT_TERMS_REQUEST(lang) : CONTINUE_TO_CREATE(lang)} arrow>
                    <span>
                        <Button
                            onClick={submitCreateEvent}
                            style={{ ...submitButton(false), ... { textTransform: 'none', margin: '0px', padding: '8px', width: '75%' } }}> {CREATE_EVENT(lang)}</Button>
                    </span>
                </HtmlTooltip>
            </Stack>
            <span ><InputLabel style={{ paddingTop: '16px', fontSize: '14px', color: SECONDARY_WHITE }}>{TERMS_OF_USE(lang)}</InputLabel>
                <Checkbox
                    style={{ background: 'none', color: SECONDARY_WHITE, margin: '8px' }}
                    onChange={handleTermsOfUseChange}
                    name={TERMS_OF_USE(lang)} value={TERMS_OF_USE(lang)} />
            </span>
        </InnerPageHolder>
    </PageHolder >)

}