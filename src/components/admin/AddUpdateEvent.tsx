import { eventTypes, PNPEvent } from "../../store/external/types";
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
import React, { CSSProperties, useEffect, useState } from "react";
import { submitButton, textFieldStyle } from "../../settings/styles";
import { isValidEvent } from "../../store/validators";
import { CONTINUE_TO_CREATE, CREATE_EVENT, EVENT_ADDRESS, EVENT_DATE, EVENT_END, EVENT_NUMBER_PPL, EVENT_START, EVENT_TITLE, EVENT_TYPE, FILL_ALL_FIELDS, PICK_IMAGE, SIDE } from "../../settings/strings";
import { HtmlTooltip } from "../utilities/HtmlTooltip";
import { getEventType, getEventTypeFromString } from "../../store/external/converters";
import Places from "../utilities/Places";
import { useLanguage } from "../../context/Language";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router";
import { getDefaultPublicEvent } from "../../store/external/helpers";

const AddUpdateEvent = (props: { event?: PNPEvent }) => {
    const [editorState, setEditorState] = useState<EditorState | undefined>()
    const { user } = useFirebase();

    // state
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | undefined>()
    const [image, setImage] = useState<string>('')
    const [pnpEvent, setPnpEvent] = useState<PNPEvent>((props.event ?? getDefaultPublicEvent(user)))
    const [startDate, setStartDate] = useState<string>(props.event ? props.event.eventHours.startHour : '00:00')
    const [endDate, setEndDate] = useState<string>(props.event ? props.event.eventHours.endHour : '00:00')

    // variables
    const oldEventType = props.event?.eventType


    // context
    const { doLoad, cancelLoad, openDialog, closeDialog } = useLoading()
    const { firebase } = useFirebase()
    const { lang } = useLanguage()
    const useStyles = makeStyles(() => textFieldStyle(SECONDARY_WHITE));
    const classes = useStyles()


    // navigation
    const nav = useNavigate()


    /*
    submitUpdateEvent
    submits the event form containing all fields that were modified
    */
    function submitUpdateEvent() {
        const dialogTitle = props.event ? 'ערכת אירוע בהצלחה! השינויים כבר ייכנסו לתוקף!' : 'הוספת אירוע בהצלחה ! בקרוב האירוע יופיע בדף הבית';

        if ((props.event && props.event.eventImageURL) || imageBuffer
            && isValidEvent(pnpEvent)) {
            doLoad()
            firebase.realTime.updateEvent(pnpEvent.eventId,
                pnpEvent, imageBuffer, oldEventType)
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

    const upperStackStyle = { width: '80%', alignSelf: 'center' }
    const formControlStyle: CSSProperties = { width: '100%', alignSelf: 'center' }



    function pickImage(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const imageUrl = URL.createObjectURL(event.target.files[0])
            setImage(imageUrl)
            const pickedImageFile = event.target.files[0]
            pickedImageFile.arrayBuffer().then(buff => {
                setImageBuffer(buff)
                setPnpEvent({ ...pnpEvent, ...{ eventImageURL: 'valid' } })
            }).catch(() => {
                alert('אירעתה בעיה בבחירת התמונה אנא פנא לצוות האתר')
            })
            $('#menu_event_create_image').css('borderRadius', '75px')
        }
    }

    const imageStyle = {

        alignSelf: 'center',
        minHeight: '150px',
        width: '80%',
        maxWidth: '225px',
        height: '75px'
    }
    const pickImageLabelStyle = {
        color: PRIMARY_WHITE,
        padding: '8px',
        borderRadius: '8px',
        cursor: 'pointer',
        alignSelf: 'center',
        marginTop: '16px',
        width: 'fit-content',
        backgroundImage: DARK_BLACK
    }
    const labelStyle = { padding: '4px', color: SECONDARY_WHITE }
    const directionStyle = {
        direction: SIDE(lang)
    }
    const selectStyle = {
        background: DARK_BLACK,
        fontFamily: 'Open Sans Hebrew',
        borderRadius: '32px',
        color: SECONDARY_WHITE
    }
    return (<Stack>


        <Stack spacing={3} style={upperStackStyle} >

            <FormControl style={formControlStyle}>
                <input
                    onChange={pickImage}
                    type="file"
                    id="files_create_event" style={{ display: 'none' }} />
                <img id='menu_event_create_image'
                    alt=''
                    src={image ? image : props.event ? props.event.eventImageURL : event_placeholder}
                    style={imageStyle} />
                <label
                    style={pickImageLabelStyle}
                    onChange={(e) => alert(e)}
                    htmlFor='files_create_event'>{PICK_IMAGE(lang, true)}
                </label>
            </FormControl>

            <FormControl style={formControlStyle}>
                <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_TITLE(lang)}</label>
                <TextField
                    className={classes.root}
                    placeholder={props.event ? props.event.eventName : EVENT_TITLE(lang)}
                    onChange={(event) => {
                        setPnpEvent({ ...pnpEvent, ...{ eventName: event.target.value } })
                    }}
                    dir='rtl'
                    sx={directionStyle} />
            </FormControl>

            <FormControl style={formControlStyle}>
                <label style={labelStyle}>{EVENT_NUMBER_PPL(lang)}</label>
                <TextField
                    className={classes.root}
                    placeholder={props.event ? props.event.expectedNumberOfPeople + "" : EVENT_NUMBER_PPL(lang)}
                    onChange={(event) => {
                        setPnpEvent({ ...pnpEvent, ...{ expectedNumberOfPeople: event.target.value } })
                    }}
                    dir='rtl'
                    type='number'
                    sx={directionStyle} />
            </FormControl>

            <FormControl style={formControlStyle}>
                <label style={labelStyle}>{lang === 'heb' ? 'שימו לב 1 (אופציונלי)' : 'Attention 1 (Optional)'}</label>
                <TextField

                    className={classes.root}
                    placeholder={props.event && props.event.eventAttention && props.event.eventAttention.eventAttention1 ? props.event.eventAttention?.eventAttention1 : lang === 'heb' ? 'הכנס שימו לב 1' : 'Enter Attention 1 (Optional)'}
                    onChange={(event) => { updateEventAttention1(event.target.value) }}
                    dir='rtl'
                    type='text'
                    sx={{

                        direction: SIDE(lang)
                    }} />
            </FormControl>

            <FormControl style={formControlStyle}>
                <label style={labelStyle}>{lang === 'heb' ? 'שימו לב 2 (אופציונלי)' : 'Attention 2 (Optional)'}</label>
                <TextField
                    className={classes.root}
                    placeholder={props.event && props.event.eventAttention && props.event.eventAttention.eventAttention1 ? props.event.eventAttention.eventAttention1 : lang === 'heb' ? 'הכנס שימו לב 2' : 'Enter Attention 2 (Optional)'}
                    onChange={(event) => { updateEventAttention2(event.target.value) }}
                    dir='rtl'
                    type='text'
                    sx={directionStyle} />
            </FormControl>


            <FormControl style={formControlStyle}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <label
                        dir={SIDE(lang)}
                        style={labelStyle}>{lang === 'heb' ? `גיל מינ' ` : 'Min age'}
                    </label>
                    <TextField
                        className={classes.root}
                        placeholder={props.event ? props.event.eventAgeRange.minAge + "" : lang === 'heb' ? `גיל מינ' ` : 'Min age'}
                        onChange={(event) => {
                            setPnpEvent({ ...pnpEvent, ...{ eventAgeRange: { ...pnpEvent.eventAgeRange, ...{ minAge: event.target.value } } } })
                        }}
                        dir='rtl'
                        type='number'
                        sx={directionStyle} />
                    <label
                        dir={SIDE(lang)}
                        style={labelStyle}>{lang === 'heb' ? `גיל מקס' ` : 'Max age'}
                    </label>

                    <TextField
                        className={classes.root}
                        placeholder={props.event ? props.event.eventAgeRange.maxAge + "" : lang === 'heb' ? `גיל מקס' ` : 'Max age'}

                        onChange={(event) => {
                            setPnpEvent({ ...pnpEvent, ...{ eventAgeRange: { ...pnpEvent.eventAgeRange, ...{ maxAge: event.target.value } } } })
                        }}
                        dir='rtl'
                        type='number'
                        sx={{

                            direction: SIDE(lang)
                        }} />

                </div>

            </FormControl>
            <FormControl style={formControlStyle}>
                <label style={{ padding: '4px', color: SECONDARY_WHITE }}>{EVENT_ADDRESS(lang)}</label>
                <Places value={''}
                    handleAddressSelect={(address: string) => {
                        updateEventAddress(address)
                    }} types={['address']} className={''} id={{}} fixed={false} style={{ width: '100%', border: '.8px solid white', borderRadius: '32px', color: SECONDARY_WHITE, background: 'none' }} placeHolder={props.event ? props.event.eventLocation : EVENT_ADDRESS(lang)} />

            </FormControl>
            <FormControl style={formControlStyle}>
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
            <FormControl style={formControlStyle}>

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
            <FormControl style={formControlStyle}>

                <label style={labelStyle}>{EVENT_END(lang)}</label>
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

            <FormControl style={formControlStyle} fullWidth>

                <label style={{ padding: '4px', color: SECONDARY_WHITE }}
                    id="create_event_type_select">{EVENT_TYPE(lang)}</label>
                <Select
                    labelId="create_event_type_select"

                    value={getEventTypeFromString(pnpEvent.eventType!)}
                    style={selectStyle}
                    onChange={(e) => {
                        setPnpEvent({ ...pnpEvent, ...{ eventType: getEventType({ ...pnpEvent, ...{ eventType: e.target.value } }) } })

                    }}
                >

                    {eventTypes.map(type => <MenuItem key={type + "Create_Event_Menu_Item"} style={{ fontFamily: 'Open Sans Hebrew' }} value={type}>{type}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl style={formControlStyle}>
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
            <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!isValidEvent(pnpEvent) ? FILL_ALL_FIELDS(lang) : CONTINUE_TO_CREATE(lang)} arrow>
                <span>
                    <Button
                        onClick={submitUpdateEvent}
                        sx={{ ...submitButton(false), ... { textTransform: 'none', margin: '0px', padding: '8px', width: '75%' } }}> {props.event ? 'שמור שינויים' : CREATE_EVENT(lang)}</Button>
                </span>
            </HtmlTooltip>
        </Stack>
    </Stack>)
}
export default AddUpdateEvent