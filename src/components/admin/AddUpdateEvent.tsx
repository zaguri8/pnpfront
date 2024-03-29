import { eventTypes, PNPEvent } from "../../store/external/types";
import { event_placeholder } from "../../assets/images";
import { Stack, TextField, Button, FormControl } from "@mui/material";
import { SECONDARY_WHITE, PRIMARY_BLACK, PRIMARY_WHITE, PRIMARY_ORANGE, PRIMARY_PINK } from "../../settings/colors";
import { reverseDate, unReverseDate } from "../utilityComponents/functions";
import { Editor, EditorState } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from "draft-js";
import React, { CSSProperties, useEffect, useState } from "react";
import { submitButton, textFieldStyle } from "../../settings/styles";
import { isValidEvent } from "../../store/validators";
import { CONTINUE_TO_CREATE, CREATE_EVENT, EVENT_ADDRESS, EVENT_DATE, EVENT_END, EVENT_NUMBER_PPL, EVENT_START, EVENT_TITLE, EVENT_TYPE, FILL_ALL_FIELDS, PICK_IMAGE, SIDE } from "../../settings/strings";
import { HtmlTooltip } from "../utilityComponents/HtmlTooltip";
import { getEventType, getEventTypeFromString } from "../../store/external/converters";
import Places from "../utilityComponents/Places";
import { makeStyles } from "@mui/styles";
import { getDefaultPublicEvent } from "../../store/external/helpers";
import { Hooks } from "../generics/types";
import { CommonHooks, withHookGroup } from "../generics/withHooks";
import { StoreSingleton } from "../../store/external";


const upperStackStyle = { width: '80%', alignSelf: 'center' }
const formControlStyle: CSSProperties = { width: '100%', alignSelf: 'center' }
type AddUpdateEventProps = { event?: PNPEvent }
const AddUpdateEvent = (props: AddUpdateEventProps & Hooks) => {
    const [editorState, setEditorState] = useState<EditorState | undefined>()
    const [imageBufferMobile, setImageBufferMobile] = useState<ArrayBuffer | null>(null)
    const [imageBufferDesktop, setImageBufferDesktop] = useState<ArrayBuffer | null>(null)
    const [imageMobile, setImageMobile] = useState<string>('')
    const [imageDesktop, setImageDesktop] = useState<string>('')
    const [pnpEvent, setPnpEvent] = useState<PNPEvent>((props.event ?? getDefaultPublicEvent(props.user.user)))
    const [startDate, setStartDate] = useState<string>(props.event ? props.event.eventHours.startHour : '00:00')
    const [endDate, setEndDate] = useState<string>(props.event ? props.event.eventHours.endHour : '00:00')

    const oldEventType = props.event?.eventType
    const useStyles = makeStyles(() => textFieldStyle(SECONDARY_WHITE, { background: PRIMARY_BLACK }));
    const classes = useStyles()

    function submitUpdateEvent() {
        const dialogTitle = props.event ? 'ערכת אירוע בהצלחה! השינויים כבר ייכנסו לתוקף!' : 'הוספת אירוע בהצלחה ! בקרוב האירוע יופיע בדף הבית';

        if ((props.event && props.event.eventImageURL) || (imageBufferDesktop || imageBufferMobile)
            && isValidEvent(pnpEvent)) {
            props.loading.doLoad()
            StoreSingleton.get().realTime.updateEvent(pnpEvent.eventId,
                pnpEvent, imageBufferMobile, imageBufferDesktop, oldEventType)
                .then(() => {
                    // update succeed
                    props.loading.cancelLoad()
                    props.nav('/adminpanel')
                    props.loading.openDialog({
                        content: <div>
                            <label style={{ color: SECONDARY_WHITE, padding: '16px' }}>
                                {dialogTitle}
                            </label>
                        </div>
                    })

                }).catch((e) => {
                    alert('אירעתה שגיאה בעת יצירת/עריכת האירוע, אנא פנא למתכנת האתר')
                    console.log(e)
                    props.loading.cancelLoad()
                })
        } else {
            alert('אנא וודא שפרטי האירוע תקינים, אם ערכת שדה מסוים והוא שדה חובה וכעת ריק, יש למלא אותו')
            props.loading.closeDialog()
        }

    }



    /**
     * onEditorStateChanged
     * triggers when free text editor state changes 
     * @param state editor state
     */
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
    function pickImage(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const imageUrl = URL.createObjectURL(event.target.files[0])
            setImageDesktop(imageUrl)
            const pickedImageFile = event.target.files[0]
            pickedImageFile.arrayBuffer().then(buff => {
                setImageBufferDesktop(buff)
                setPnpEvent({ ...pnpEvent, ...{ eventImageURL: 'valid' } })
            }).catch(() => {
                alert('אירעתה בעיה בבחירת התמונה אנא פנא לצוות האתר')
            })
            $('#menu_event_create_image_desktop').css('borderRadius', '75px')
        }
    }
    function pickImageMobile(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const imageUrl = URL.createObjectURL(event.target.files[0])
            setImageMobile(imageUrl)
            const pickedImageFile = event.target.files[0]
            pickedImageFile.arrayBuffer().then(buff => {
                setImageBufferMobile(buff)
                setPnpEvent({ ...pnpEvent, ...{ eventMobileImageURL: 'valid' } })
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
        background: PRIMARY_PINK
    }
    const labelStyle = { padding: '4px', color: PRIMARY_PINK }
    const directionStyle = {
        direction: SIDE(props.language.lang)
    }
    const selectStyle = {
        background: PRIMARY_BLACK,
        fontFamily: 'Open Sans Hebrew',
        borderRadius: '32px',
        padding: '8px',
        margin: '8px',
        width: '100%',
        alignSelf: 'center',
        zIndex: '10000',
        color: PRIMARY_ORANGE
    }
    return (<Stack>


        <Stack spacing={3} style={upperStackStyle} >

            {function imagePickerField() {
                return <FormControl style={formControlStyle}>
                    <input
                        onChange={pickImageMobile}
                        type="file"
                        id="files_create_event" style={{ display: 'none' }} />
                    <img id='menu_event_create_image'
                        alt=''
                        src={imageMobile ? imageMobile : props.event ? props.event.eventMobileImageURL : event_placeholder}
                        style={imageStyle} />
                    <label
                        style={pickImageLabelStyle}
                        onChange={(e) => alert(e)}
                        htmlFor='files_create_event'>{PICK_IMAGE(props.language.lang, true) + " Mobile"}
                    </label>
                </FormControl>
            }()}

            {function imagePickerFieldDesktop() {
                return <FormControl style={formControlStyle}>
                    <input
                        onChange={pickImage}
                        type="file"
                        id="files_create_event_desktop" style={{ display: 'none' }} />
                    <img id='menu_event_create_image_desktop'
                        alt=''
                        src={imageDesktop ? imageDesktop : props.event ? props.event.eventImageURL : event_placeholder}
                        style={imageStyle} />
                    <label
                        style={pickImageLabelStyle}
                        onChange={(e) => alert(e)}
                        htmlFor='files_create_event_desktop'>{PICK_IMAGE(props.language.lang, true) + " Desktop"}
                    </label>
                </FormControl>
            }()}
            {function eventTitleField() {
                return <FormControl style={formControlStyle}>
                    <label style={{ padding: '4px', color: PRIMARY_PINK }}>{EVENT_TITLE(props.language.lang)}</label>
                    <TextField
                        className={classes.root}
                        placeholder={props.event ? props.event.eventName : EVENT_TITLE(props.language.lang)}
                        onChange={(event) => {
                            setPnpEvent({ ...pnpEvent, ...{ eventName: event.target.value } })
                        }}
                        dir='rtl'
                        sx={directionStyle} />
                </FormControl>
            }()}

            {function numberOfPeopleField() {
                return <FormControl style={formControlStyle}>
                    <label style={labelStyle}>{EVENT_NUMBER_PPL(props.language.lang)}</label>
                    <TextField
                        className={classes.root}
                        placeholder={props.event ? props.event.expectedNumberOfPeople + "" : EVENT_NUMBER_PPL(props.language.lang)}
                        onChange={(event) => {
                            setPnpEvent({ ...pnpEvent, ...{ expectedNumberOfPeople: event.target.value } })
                        }}
                        dir='rtl'
                        type='number'
                        sx={directionStyle} />
                </FormControl>
            }()}

            {function attention_1_field() {
                return <FormControl style={formControlStyle}>
                    <label style={labelStyle}>{props.language.lang === 'heb' ? 'שימו לב 1 (אופציונלי)' : 'Attention 1 (Optional)'}</label>
                    <TextField

                        className={classes.root}
                        placeholder={props.event && props.event.eventAttention && props.event.eventAttention.eventAttention1 ? props.event.eventAttention?.eventAttention1 : props.language.lang === 'heb' ? 'הכנס שימו לב 1' : 'Enter Attention 1 (Optional)'}
                        onChange={(event) => { updateEventAttention1(event.target.value) }}
                        dir='rtl'
                        type='text'
                        sx={{

                            direction: SIDE(props.language.lang)
                        }} />
                </FormControl>
            }()}

            {function attention_2_field() {
                return <FormControl style={formControlStyle}>
                    <label style={labelStyle}>{props.language.lang === 'heb' ? 'שימו לב 2 (אופציונלי)' : 'Attention 2 (Optional)'}</label>
                    <TextField
                        className={classes.root}
                        placeholder={props.event && props.event.eventAttention && props.event.eventAttention.eventAttention1 ? props.event.eventAttention.eventAttention1 : props.language.lang === 'heb' ? 'הכנס שימו לב 2' : 'Enter Attention 2 (Optional)'}
                        onChange={(event) => { updateEventAttention2(event.target.value) }}
                        dir='rtl'
                        type='text'
                        sx={directionStyle} />
                </FormControl>
            }()}


            {function minAgeField() {
                return <FormControl style={formControlStyle}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <label
                            dir={SIDE(props.language.lang)}
                            style={labelStyle}>{props.language.lang === 'heb' ? `גיל מינ' ` : 'Min age'}
                        </label>
                        <TextField
                            className={classes.root}
                            placeholder={props.event ? props.event.eventAgeRange.minAge + "" : props.language.lang === 'heb' ? `גיל מינ' ` : 'Min age'}
                            onChange={(event) => {
                                setPnpEvent({ ...pnpEvent, ...{ eventAgeRange: { ...pnpEvent.eventAgeRange, ...{ minAge: event.target.value } } } })
                            }}
                            dir='rtl'
                            type='number'
                            sx={directionStyle} />
                        <label
                            dir={SIDE(props.language.lang)}
                            style={labelStyle}>{props.language.lang === 'heb' ? `גיל מקס' ` : 'Max age'}
                        </label>

                        <TextField
                            className={classes.root}
                            placeholder={props.event ? props.event.eventAgeRange.maxAge + "" : props.language.lang === 'heb' ? `גיל מקס' ` : 'Max age'}

                            onChange={(event) => {
                                setPnpEvent({ ...pnpEvent, ...{ eventAgeRange: { ...pnpEvent.eventAgeRange, ...{ maxAge: event.target.value } } } })
                            }}
                            dir='rtl'
                            type='number'
                            sx={{

                                direction: SIDE(props.language.lang)
                            }} />
                    </div>
                </FormControl>
            }()}


            {function eventAddressField() {
                return <FormControl style={formControlStyle}>
                    <label style={{ padding: '4px', color: PRIMARY_PINK }}>{EVENT_ADDRESS(props.language.lang)}</label>
                    <Places value={''}
                        handleAddressSelect={(address: string) => {
                            updateEventAddress(address)
                        }} types={['address']} className={''} id={{}} fixed={false} style={{ width: '100%', border: '.8px solid white', borderRadius: '32px', color: SECONDARY_WHITE, background: PRIMARY_BLACK }} placeHolder={props.event ? props.event.eventLocation : EVENT_ADDRESS(props.language.lang)} />

                </FormControl>
            }()}
            {function eventDateField() {
                return <FormControl style={formControlStyle}>
                    <label style={{ padding: '4px', color: PRIMARY_PINK }}>{EVENT_DATE(props.language.lang)}</label>

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
            }()}
            {function eventStartTimeField() {
                return <FormControl style={formControlStyle}>
                    <label style={{ padding: '4px', color: PRIMARY_PINK }}>{EVENT_START(props.language.lang)}</label>
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
            }()}

            {function eventEndTimeField() {
                return <FormControl style={formControlStyle}>

                    <label style={labelStyle}>{EVENT_END(props.language.lang)}</label>
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
            }()}

            {function eventTypeField() {
                return <FormControl style={{ ...formControlStyle }} fullWidth>

                    <label style={{ padding: '4px', color: PRIMARY_PINK }}
                        id="create_event_type_select">{EVENT_TYPE(props.language.lang)}</label>
                    <select

                        value={getEventTypeFromString(pnpEvent.eventType!)}
                        style={selectStyle}
                        onChange={(e) => {
                            setPnpEvent({ ...pnpEvent, ...{ eventType: getEventType({ ...pnpEvent, ...{ eventType: e.target.value } }) } })

                        }}
                    >
                        {eventTypes.map(type => <option key={type + "Create_Event_Menu_Item"} style={{ fontFamily: 'Open Sans Hebrew' }} value={type}>{type}</option>)}

                    </select>
                </FormControl>
            }()}

            {function detailsEditorField() {
                return <FormControl style={formControlStyle}>
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
            }()}
            {function submitField() {
                return <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!isValidEvent(pnpEvent) ? FILL_ALL_FIELDS(props.language.lang) : CONTINUE_TO_CREATE(props.language.lang)} arrow>
                    <span>
                        <Button
                            onClick={submitUpdateEvent}
                            style={{ ...submitButton(false), ... { textTransform: 'none', margin: '0px', padding: '8px', width: '75%' } }}> {props.event ? 'שמור שינויים' : CREATE_EVENT(props.language.lang)}</Button>
                    </span>
                </HtmlTooltip>
            }()}
        </Stack>
    </Stack>)
}
export default withHookGroup<AddUpdateEventProps>(AddUpdateEvent, CommonHooks)