import { FormControl, InputLabel, TextField, Stack, TextFieldProps, Select, MenuItem, Button, Checkbox } from "@mui/material";
import { useLanguage } from "../../context/Language";
import { ACCEPT_TERMS_REQUEST, CONTINUE_TO_CREATE, CREATE_EVENT, CREATE_EVENT_TITLE, EVENT_ADDRESS, EVENT_DATE, EVENT_END, EVENT_NUMBER_PPL, EVENT_START, EVENT_TITLE, EVENT_TYPE, FILL_ALL_FIELDS, PICK_IMAGE, SIDE, TERMS_OF_USE } from "../../settings/strings";
import { InnerPageHolder, PageHolder } from "../utilities/Holders";
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from "draft-js";
import SectionTitle from "../SectionTitle";
import { useEffect, useState } from "react";
import Places from "../utilities/Places";
import { PNPEvent } from '../../store/external/types'
import { makeStyles } from "@mui/styles";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker, DateTimePicker, TimePicker } from "@mui/lab"
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

export default function CreateEvent() {
    const { lang } = useLanguage()
    const [editorState, setEditorState] = useState<EditorState | undefined>()
    const { uploadEventImage } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()
    const [pnpEvent, setPnpEvent] = useState<PNPEvent>({
        eventName: 'null',
        eventLocation: 'null',
        eventId: 'null',
        eventCanAddRides: true,
        eventProducerId: 'null',
        eventDate: 'null',
        eventDetails: 'null',
        eventPrice: 'null',
        eventHours: { startHour: 'null', endHour: 'null' },
        eventAgeRange: { minAge: 'null', maxAge: 'null' },
        expectedNumberOfPeople: 'null',
        eventImageURL: 'null'
    })
    const [startDate, setStartDate] = useState<string>()
    const [endDate, setEndDate] = useState<string>()
    const onEditorStateChanged = (state: EditorState) => {
        setEditorState(state)
        if (editorState) {
            const eventDetailsHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()))
            setPnpEvent({ ...pnpEvent, ...{ eventDetails: eventDetailsHTML } })
        }
    }

    const eventTypes = [
        "מסיבות ומועדונים",
        "משחקי כדורגל",
        "הופעות",
        "פסטיבלים",
        "ברים",
        "ספורט כללי",
        "אירועי ילדים"
    ]



    const updateEventHours = (type: 'end' | 'start', event: string | undefined | null) => {
        const formatted = formatDateHours(new Date(event as string))
        const dict = type === 'end' ? { startHour: formatted } : { endHour: formatted }
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
        event && setPnpEvent({ ...pnpEvent, ...{ eventDate: event as string } })
    }

    const formatDateHours = (date: Date) => {
        let hours = date.getHours() + ":" + date.getMinutes()
        return hours
    }

    const handleTermsOfUseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTermsOfUse(e.target.checked)
    }

    const [termsOfUser, setTermsOfUse] = useState<boolean>(false)


    const [selectedEventType, setSelectedEventType] = useState<string>(eventTypes[0])

    const [image, setImage] = useState<string>('')
    return (<PageHolder>
        <SectionTitle title={CREATE_EVENT_TITLE(lang)} style={{}} />
        <InnerPageHolder>
            <Stack spacing={3} >
                <FormControl style={{ width: '80%', alignSelf: 'center' }}>
                    <input onChange={(event) => {
                        if (event.target.files) {
                            setImage(URL.createObjectURL(event.target.files[0]))
                            $('#menu_event_create_image').css('borderRadius', '75px')
                        }

                    }} type="file" id="files_create_event" style={{ display: 'none' }} />
                    <img id='menu_event_create_image' alt='' src={image ? image : event_placeholder} style={{
                        width: '100%',
                        alignSelf: 'center',
                        minHeight: '150px',
                        maxWidth: '150px',
                        height: '75px'
                    }} />          <label style={{
                        color: 'black',
                        padding: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        alignSelf: 'center',
                        marginTop: '16px',
                        width: 'fit-content',
                        background: 'white'
                    }} onChange={(e) => alert(e)} htmlFor='files_create_event'>{PICK_IMAGE(lang, true)}</label>
                </FormControl>
                <FormControl style={{ width: '80%', alignSelf: 'center' }}>
                    <TextField
                        placeholder={EVENT_TITLE(lang)}
                        onChange={(event) => { setPnpEvent({ ...pnpEvent, ...{ eventName: event.target.value } }) }}
                        dir='rtl'
                        sx={{
                            background: 'white',
                            direction: SIDE(lang)
                        }} />
                </FormControl>

                <FormControl style={{ width: '80%', alignSelf: 'center' }}>
                    <TextField
                        placeholder={EVENT_NUMBER_PPL(lang)}
                        onChange={(event) => { setPnpEvent({ ...pnpEvent, ...{ eventName: event.target.value } }) }}
                        dir='rtl'
                        type='number'
                        sx={{
                            background: 'white',
                            direction: SIDE(lang)
                        }} />
                </FormControl>

                <FormControl style={{ width: '80%', alignSelf: 'center' }}>
                    <Places value={''} handleAddressSelect={updateEventAddress} types={['address']} className={''} id={''} fixed style={{ width: '100%' }} placeHolder={EVENT_ADDRESS(lang)} />

                </FormControl>
                <FormControl style={{ width: '80%', alignSelf: 'center', background: 'white' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            onChange={(e) => updateEventDate(e)}
                            value={pnpEvent.eventDate}
                            label={EVENT_DATE(lang)}
                            renderInput={(params: TextFieldProps) => <TextField required disabled {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl style={{ width: '80%', alignSelf: 'center', background: 'white' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label={EVENT_START(lang)}
                            value={pnpEvent.eventHours.startHour}
                            onChange={(e) => updateEventHours('start', e)}
                            renderInput={(params: TextFieldProps) => <TextField required disabled {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl style={{ width: '80%', background: 'white', alignSelf: 'center' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label={EVENT_END(lang)}
                            value={pnpEvent.eventHours.endHour}
                            onChange={(e) => updateEventHours('end', e)}
                            renderInput={(params: TextFieldProps) => <TextField required disabled {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>

                <FormControl style={{ width: '80%', alignSelf: 'center' }} fullWidth>
                    <InputLabel required id="create_event_type_select">{EVENT_TYPE(lang)}</InputLabel>
                    <Select
                        labelId="create_event_type_select"
                        id="create_event_type_select"
                        value={selectedEventType}
                        label={EVENT_TYPE(lang)}
                        onChange={(e) => setSelectedEventType(e.target.value)}
                    >

                        {eventTypes.map(type => <MenuItem key={type + "Create_Event_Menu_Item"} value={type}>{type}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl style={{ width: '90%', alignSelf: 'center' }}>
                    <Editor
                        editorStyle={{ background: 'white', minHeight: '200px' }}
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChanged}
                    />
                </FormControl>
                <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!isValidEvent(pnpEvent) ? FILL_ALL_FIELDS(lang) : !termsOfUser ? ACCEPT_TERMS_REQUEST(lang) : CONTINUE_TO_CREATE(lang)} arrow>
                    <span>
                        <Button sx={{ ...submitButton(false), ... { margin: '0px', padding: '8px' } }} disabled={!isValidEvent(pnpEvent) || !termsOfUser} >{CREATE_EVENT(lang)}</Button>
                    </span>
                </HtmlTooltip>
            </Stack>
            <span ><InputLabel style={{ paddingTop: '16px', fontSize: '14px' }}>{TERMS_OF_USE(lang)}</InputLabel>
                <Checkbox
                    onChange={handleTermsOfUseChange}
                    name={TERMS_OF_USE(lang)} value={TERMS_OF_USE(lang)} />
            </span>
        </InnerPageHolder>
    </PageHolder>)

}