import { PNPPrivateEvent } from "../../store/external/types";
import { useLoading } from "../../context/Loading";
import { event_placeholder } from "../../assets/images";
import { Stack, TextField, Checkbox, Button, FormControl } from "@mui/material";
import { SECONDARY_WHITE, PRIMARY_BLACK, DARK_BLACK, PRIMARY_WHITE, RED_ROYAL, PRIMARY_PINK } from "../../settings/colors";
import { reverseDate, unReverseDate } from "../utilityComponents/functions";
import { Editor, EditorState } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from "draft-js";
import { useState } from "react";
import { fullSubmitButton, textFieldStyle } from "../../settings/styles";
import { isValidPrivateEvent } from "../../store/validators";
import { CONTINUE_TO_CREATE, CREATE_EVENT, EVENT_ADDRESS, EVENT_DATE, EVENT_END_2, EVENT_START_2, EVENT_TITLE, FILL_ALL_FIELDS, PICK_IMAGE, SIDE } from "../../settings/strings";
import { HtmlTooltip } from "../utilityComponents/HtmlTooltip";
import Places from "../utilityComponents/Places";
import { makeStyles } from "@mui/styles";
import { getDefaultPrivateEvent } from "../../store/external/helpers";
import { Hooks } from "../generics/types";
import { CommonHooks, withHookGroup } from "../generics/withHooks";
import { StoreSingleton } from "../../store/external";

type AddUpdateInvitationProps = { event?: PNPPrivateEvent }
const AddUpdateEventInvitation = (props: AddUpdateInvitationProps & Hooks) => {
    const [startDate, setStartDate] = useState<string>(props.event ? props.event.eventHours.startHour : '00:00')
    const [endDate, setEndDate] = useState<string>(props.event ? props.event.eventHours.endHour : '00:00')
    const [image, setImage] = useState<string>('')
    const [pnpEvent, setPnpEvent] = useState<PNPPrivateEvent>((props.event ?? getDefaultPrivateEvent()))
    const [editorState, setEditorState] = useState<EditorState | undefined>()
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | undefined>()
    const useStyles = makeStyles(() => textFieldStyle(SECONDARY_WHITE, { background: PRIMARY_BLACK }));
    const classes = useStyles()

    function submitUpdateEvent() {
        const dialogTitle = props.event ? 'ערכת אירוע בהצלחה! השינויים כבר ייכנסו לתוקף!' : 'הוספת אירוע בהצלחה ! בקרוב האירוע יופיע בדף הבית';

        if ((props.event && props.event.eventImageURL) || imageBuffer
            && isValidPrivateEvent(pnpEvent)) {
            props.loading.doLoad()
            StoreSingleton.getTools().realTime.updatePrivateEvent(pnpEvent.eventId,
                pnpEvent, imageBuffer)
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


    // text editor state handler
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

    const updateEventGuests = (enabledGuests: boolean) => {
        setPnpEvent({ ...pnpEvent, ...{ eventGuests: enabledGuests } })
    }

    const updateEventDate = (event: string | undefined | null) => {
        if (event as string) {
            const split = reverseDate(event)
            setPnpEvent({ ...pnpEvent, ...{ eventDate: split } })
        }
    }


    // style
    const tooltipStyle = { fontFamily: 'Open Sans Hebrew', fontSize: '18px' }
    const formControlStyle = { width: '100%', alignSelf: 'center' }
    const fitFormControlStyle = { width: 'fit-content', alignSelf: 'center' }
    const upperStackStyle = { width: '80%', alignSelf: 'center' }
    const labelStyleSimple = { padding: '8px', color: PRIMARY_PINK }
    const directionStyle = { direction: SIDE(props.language.lang) }
    const editorStyle = {
        background: SECONDARY_WHITE,
        minHeight: '200px',
        maxWidth: '100%'
    }
    const imageStyle = {
        alignSelf: 'center',
        minHeight: '150px',
        width: '80%',
        maxWidth: '225px',
        height: '75px'
    }

    const labelStyle = {
        color: PRIMARY_PINK,
        padding: '8px',
        borderRadius: '8px',
        cursor: 'pointer',
        alignSelf: 'center',
        marginTop: '16px',
        width: 'fit-content',
        backgroundImage: DARK_BLACK
    }
    const placeSearchStyle = {
        width: '100%',
        border: '.8px solid white',
        borderRadius: '32px',
        color: SECONDARY_WHITE,

        background: PRIMARY_BLACK
    }

    return (<Stack>


        <Stack spacing={3} style={upperStackStyle} >

            {function imagePickerField() {
                return <FormControl style={formControlStyle}>
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
                    <img id='menu_event_create_image' alt='' src={image ? image : props.event ? props.event.eventImageURL : event_placeholder} style={imageStyle} />

                    <label
                        style={{ ...labelStyle, background: PRIMARY_PINK, color: SECONDARY_WHITE }}
                        onChange={(e) => alert(e)} htmlFor='files_create_event'>{PICK_IMAGE(props.language.lang, true)}
                    </label>
                </FormControl>
            }()}

            {function eventTitleField() {
                return <FormControl style={formControlStyle}>
                    <label style={labelStyleSimple}>{EVENT_TITLE(props.language.lang)}
                    </label>
                    <TextField
                        className={classes.root}
                        placeholder={props.event ? props.event.eventTitle : EVENT_TITLE(props.language.lang)}
                        onChange={(event) => {
                            setPnpEvent({ ...pnpEvent, ...{ eventTitle: event.target.value } })

                        }}
                        dir='rtl'
                        sx={directionStyle} />
                </FormControl>
            }()}


            {function eventAddressField() {
                return <FormControl style={formControlStyle}>
                    <label style={labelStyleSimple}>{EVENT_ADDRESS(props.language.lang)}</label>
                    <Places value={''}
                        handleAddressSelect={(address: string) => {
                            updateEventAddress(address)
                        }} types={['address']}
                        className={''}
                        id={{}}
                        fixed={false}
                        style={placeSearchStyle}
                        placeHolder={props.event ? props.event.eventLocation : EVENT_ADDRESS(props.language.lang)} />
                </FormControl>
            }()}
            {function eventDateField() {
                return <FormControl style={formControlStyle}>
                    <label style={labelStyleSimple}>{EVENT_DATE(props.language.lang)}</label>

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
                    <label dir={SIDE(props.language.lang)} style={labelStyleSimple}>{EVENT_START_2(props.language.lang)}</label>
                    <TextField
                        value={startDate}
                        classes={{ root: classes.root }}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: SECONDARY_WHITE }
                        }}

                        type='text'
                        onChange={(e) => {
                            updateEventHours('start', e.target.value)
                        }}
                        required />
                </FormControl>
            }()}

            {function eventEndTimeField() {
                return <FormControl style={formControlStyle}>
                    <label style={labelStyleSimple}>{EVENT_END_2(props.language.lang)}</label>
                    <TextField
                        value={endDate}
                        classes={{ root: classes.root }}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: SECONDARY_WHITE }
                        }}

                        type='text'
                        onChange={(e) => {
                            updateEventHours('end', e.target.value)
                        }}
                        required />
                </FormControl>
            }()}

            {function allowGuestsField() {
                return <FormControl style={fitFormControlStyle}>
                    <label style={labelStyleSimple}>{props.language.lang === 'heb' ? 'אפשר אורחים' : 'Enable Guests'}</label>
                    <Checkbox
                        classes={{ root: classes.root }}
                        style={{ padding: '4px', alignSelf: 'center', width: 'fit-content', background: RED_ROYAL, color: SECONDARY_WHITE }}
                        onChange={(e) => {
                            updateEventGuests(e.target.checked)
                        }}
                        required />
                </FormControl>
            }()}
            {function detailsEditorField() {
                return <FormControl style={formControlStyle}>
                    <Editor
                        editorStyle={editorStyle}
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
                return <HtmlTooltip
                    sx={tooltipStyle}
                    title={!isValidPrivateEvent(pnpEvent) ? FILL_ALL_FIELDS(props.language.lang) : CONTINUE_TO_CREATE(props.language.lang)}
                    arrow>
                    <span>
                        <Button
                            onClick={submitUpdateEvent}
                            style={fullSubmitButton as any}>
                            {props.event ? 'שמור שינויים' : CREATE_EVENT(props.language.lang)}
                        </Button>
                    </span>
                </HtmlTooltip>
            }()}
        </Stack>
    </Stack>)
}
export default withHookGroup<AddUpdateInvitationProps>(AddUpdateEventInvitation, CommonHooks)