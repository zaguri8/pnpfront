import { PNPEvent, PNPPrivateEvent } from "../../store/external/types";
import { useFirebase } from "../../context/Firebase";
import { useLoading } from "../../context/Loading";

import { event_placeholder } from "../../assets/images";
import { Stack, TextField, Checkbox, Button, Select, MenuItem, FormControl } from "@mui/material";
import { SECONDARY_WHITE, PRIMARY_BLACK, DARK_BLACK, PRIMARY_WHITE } from "../../settings/colors";

import { dateStringFromDate, reverseDate, unReverseDate } from "../utilities/functions";
import { getCurrentDate } from "../../utilities";

import { Editor, EditorState } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from "draft-js";
import { useEffect, useState } from "react";
import { submitButton } from "../../settings/styles";
import { isValidEvent, isValidPrivateEvent } from "../../store/validators";
import { CONTINUE_TO_CREATE, CREATE_EVENT, EVENT_ADDRESS, EVENT_DATE, EVENT_END, EVENT_NUMBER_PPL, EVENT_START, EVENT_TITLE, EVENT_TYPE, FILL_ALL_FIELDS, PICK_IMAGE, SIDE } from "../../settings/strings";
import { HtmlTooltip } from "../utilities/HtmlTooltip";
import { getEventType, getEventTypeFromString } from "../../store/external/converters";
import Places from "../utilities/Places";
import { useLanguage } from "../../context/Language";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router";

const AddUpdateEventInvitation = (props: { event?: PNPPrivateEvent }) => {
    const [editorState, setEditorState] = useState<EditorState | undefined>()
    const { user } = useFirebase();
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | undefined>()


    const [image, setImage] = useState<string>('')
    const [pnpEvent, setPnpEvent] = useState<PNPPrivateEvent>((props.event ?? {
        eventTitle: 'null',
        eventLocation: 'null',
        eventId: 'null',
        eventDate: dateStringFromDate(getCurrentDate()),
        eventDetails: 'null',
        eventHours: { startHour: 'null', endHour: 'null' },
        eventImageURL: 'null'
    }))
    const { doLoad, cancelLoad, openDialog, closeDialog } = useLoading()
    const { firebase } = useFirebase()
    const nav = useNavigate()
    function submitUpdateEvent() {
        const dialogTitle = props.event ? 'ערכת אירוע בהצלחה! השינויים כבר ייכנסו לתוקף!' : 'הוספת אירוע בהצלחה ! בקרוב האירוע יופיע בדף הבית';

        if ((props.event && props.event.eventImageURL) || imageBuffer
            && isValidPrivateEvent(pnpEvent)) {
            doLoad()
            firebase.realTime.updatePrivateEvent(pnpEvent.eventId,
                pnpEvent, imageBuffer)
                .then(() => {
                    // update succeed
                    cancelLoad()
                    nav('/adminpanel')
                    openDialog({
                        content: <div>
                            <label style={{ color: SECONDARY_WHITE, padding: '16px' }}>
                                {dialogTitle}
                            </label>
                        </div>
                    })

                }).catch((e) => {
                    alert('אירעתה שגיאה בעת יצירת/עריכת האירוע, אנא פנא למתכנת האתר')
                    console.log(e)
                    cancelLoad()
                })
        } else {
            alert('אנא וודא שפרטי האירוע תקינים, אם ערכת שדה מסוים והוא שדה חובה וכעת ריק, יש למלא אותו')
            closeDialog()
        }

    }

    const [startDate, setStartDate] = useState<string>(props.event ? props.event.eventHours.startHour : '00:00')
    const [endDate, setEndDate] = useState<string>(props.event ? props.event.eventHours.endHour : '00:00')



    const useStyles = makeStyles(() => ({
        root: {
            "& .MuiOutlinedInput-root": {
                background: 'none',
                borderRadius: '32px',
                padding: '0px',
                border: '.8px solid white',
                color: SECONDARY_WHITE, ...{
                    '& input[type=number]': {
                        '-moz-appearance': 'textfield'
                    },
                    '& input[type=number]::-webkit-outer-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0
                    },
                    '& input[type=time]::-webkit-calendar-picker-indicator': {
                        filter: 'invert(200%) sepia(85%) saturate(10%) hue-rotate(356deg) brightness(107%) contrast(117%)'
                    },
                    '& input[type=date]::-webkit-calendar-picker-indicator': {
                        filter: 'invert(200%) sepia(85%) saturate(10%) hue-rotate(356deg) brightness(107%) contrast(117%)'
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

    const classes = useStyles()
    const onEditorStateChanged = (state: EditorState) => {
        setEditorState(state)
        if (editorState) {
            const eventDetailsHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()))
            setPnpEvent({ ...pnpEvent, ...{ eventDetails: eventDetailsHTML } })
        }
    }



    const updateEventHours = (type: 'end' | 'start', event: string | undefined | null) => {
        const dict = type === 'end' ? { endHour: event as string } : { startHour: event as string }
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

    const { lang } = useLanguage()


    return (<Stack>


        <Stack spacing={3} style={{ width: '80%', alignSelf: 'center' }} >
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

                        $('#menu_event_create_image').css('borderRadius', '75px')
                    }

                }} type="file" id="files_create_event" style={{ display: 'none' }} />
                <img id='menu_event_create_image' alt='' src={image ? image : props.event ? props.event.eventImageURL : event_placeholder} style={{

                    alignSelf: 'center',
                    minHeight: '150px',
                    width: '80%',
                    maxWidth: '225px',
                    height: '75px'
                }} />          <label style={{
                    color: PRIMARY_WHITE,
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    alignSelf: 'center',
                    marginTop: '16px',
                    width: 'fit-content',
                    backgroundImage: DARK_BLACK
                }} onChange={(e) => alert(e)} htmlFor='files_create_event'>{PICK_IMAGE(lang, true)}</label>
            </FormControl>
            <FormControl style={{ width: '100%', alignSelf: 'center' }}>
                <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_TITLE(lang)}</label>
                <TextField

                    className={classes.root}
                    placeholder={props.event ? props.event.eventTitle : EVENT_TITLE(lang)}
                    onChange={(event) => {
                        setPnpEvent({ ...pnpEvent, ...{ eventName: event.target.value } })

                    }}
                    dir='rtl'
                    sx={{

                        direction: SIDE(lang)
                    }} />
            </FormControl>


            <FormControl style={{ width: '100%', alignSelf: 'center' }}>
                <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_ADDRESS(lang)}</label>
                <Places value={''}
                    handleAddressSelect={(address: string) => {
                        updateEventAddress(address)
                    }} types={['address']} className={''} id={{}} fixed={false} style={{ width: '100%', border: '.8px solid white', borderRadius: '32px', color: SECONDARY_WHITE, background: 'none' }} placeHolder={props.event ? props.event.eventLocation : EVENT_ADDRESS(lang)} />

            </FormControl>
            <FormControl style={{ width: '100%', alignSelf: 'center' }}>
                <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_DATE(lang)}</label>

                <TextField
                    value={props.event ? unReverseDate(props.event.eventDate) : unReverseDate(pnpEvent.eventDate)}
                    classes={{ root: classes.root }}
                    InputLabelProps={{
                        shrink: true,
                        style: { color: SECONDARY_WHITE }
                    }}

                    type='date'
                    onChange={(e) => {
                        updateEventDate(e.target.value)
                    }}
                    required />
            </FormControl>
            <FormControl style={{ width: '100%', alignSelf: 'center' }}>

                <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_START(lang)}</label>
                <TextField
                    value={startDate}
                    classes={{ root: classes.root }}
                    InputLabelProps={{
                        shrink: true,
                        style: { color: SECONDARY_WHITE }
                    }}

                    type='time'
                    onChange={(e) => {
                        updateEventHours('start', e.target.value)
                    }}
                    required />
            </FormControl>
            <FormControl style={{ width: '100%', alignSelf: 'center' }}>

                <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_END(lang)}</label>
                <TextField
                    value={endDate}
                    classes={{ root: classes.root }}
                    InputLabelProps={{
                        shrink: true,
                        style: { color: SECONDARY_WHITE }
                    }}

                    type='time'
                    onChange={(e) => {
                        updateEventHours('end', e.target.value)
                    }}
                    required />
            </FormControl>
            <FormControl style={{ width: '100%', alignSelf: 'center' }}>
                <Editor
                    editorStyle={{ background: SECONDARY_WHITE, minHeight: '200px', maxWidth: '100%' }}
                    editorState={editorState}
                    placeholder={'הכנס פרטים אם ברצונך לשנות את הפרטים הנוכחים'}
                    wrapperStyle={{ maxWidth: '100%' }}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={onEditorStateChanged}
                />
            </FormControl>
            <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!isValidPrivateEvent(pnpEvent) ? FILL_ALL_FIELDS(lang) : CONTINUE_TO_CREATE(lang)} arrow>
                <span>
                    <Button
                        onClick={submitUpdateEvent}
                        sx={{ ...submitButton(false), ... { textTransform: 'none', margin: '0px', padding: '8px', width: '75%' } }}> {props.event ? 'שמור שינויים' : CREATE_EVENT(lang)}</Button>
                </span>
            </HtmlTooltip>
        </Stack>
    </Stack>)
}
export default AddUpdateEventInvitation