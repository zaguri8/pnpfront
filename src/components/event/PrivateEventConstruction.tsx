import { Stack, TextField, Button } from '@mui/material'
import React, { CSSProperties, HTMLInputTypeAttribute, useEffect, useState } from 'react'
import { useFirebase } from '../../context/Firebase'
import { useLoading } from '../../context/Loading'
import { getDefaultPrivateEvent } from '../../store/external/helpers'
import { PNPPrivateEvent } from '../../store/external/types'
import { event_placeholder } from "../../assets/images";
import { isValidPrivateEvent } from '../../store/validators'
import { BLACK_ELEGANT, BLACK_ROYAL, DARK_BLACK, PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_PINK, SECONDARY_BLACK, SECONDARY_WHITE } from '../../settings/colors'
import { CREATE_EVENT, CREATE_INVITATION, CREATE_INVITATION_TITLE, EVENT_ADDRESS, EVENT_DATE, EVENT_END, EVENT_START, EVENT_TITLE, PICK_IMAGE, SIDE } from '../../settings/strings'
import { useLanguage } from '../../context/Language'
import Places from '../utilities/Places'
import { InnerPageHolder, PageHolder } from '../utilities/Holders'
import { elegantShadow, submitButton, textFieldStyle } from '../../settings/styles'
import { makeStyles } from '@mui/styles'
import Spacer from '../utilities/Spacer'
import { reverseDate, unReverseDate } from '../utilities/functions'
import SectionTitle from '../SectionTitle'
import { useHeaderBackgroundExtension } from '../../context/HeaderContext'

type FormFieldProps = {
    title: string,
    name?: string,
    placeholder?: string,
    type: HTMLInputTypeAttribute,
    value?: string,
    style?: CSSProperties,
    onChange: (value: string) => void
}

const FormField = React.memo((props: FormFieldProps) => {
    const useStyles = makeStyles(() => textFieldStyle(SECONDARY_WHITE, { background: PRIMARY_BLACK,border:`1px solid ${PRIMARY_PINK}` }))
    const classes = useStyles()
    const { lang } = useLanguage()
    return <Stack alignItems={'center'} justifyContent={'center'} spacing={1}>
        <label
            style={{ ...props.style, ...{ padding: '4px', color: SECONDARY_WHITE, fontWeight: 'bold' } }}
        > {props.title}</label>
        {props.type === 'date' || props.type === 'time' ? <TextField
            dir={SIDE(lang)}
            classes={classes}
            style={props.style}
            value={props.value}
            name={props.name}
            onChange={(e) => { props.onChange(e.target.value) }}
            type={props.type} //   value={unReverseDate(pnpEvent.eventDate)}
            placeholder={(props.placeholder && props.placeholder !== 'null') ? props.placeholder : props.title} /> : <TextField
            classes={classes}
            dir={SIDE(lang)}
            style={props.style}
            name={props.name}
            value={props.value}
            onChange={(e) => { props.onChange(e.target.value) }}
            type={props.type}
            placeholder={props.placeholder ?? props.title} />}
    </Stack>
})
export default function PrivateEventConstruction() {
    // state && context
    const [privateEvent, setPrivateEvent] = useState<PNPPrivateEvent>(getDefaultPrivateEvent())
    const { firebase, appUser } = useFirebase()
    const { doLoad, openDialog, cancelLoad } = useLoading()
    const { lang } = useLanguage()

    const { hideHeader, showHeader } = useHeaderBackgroundExtension()
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | undefined>()
    const [image, setImage] = useState<string>('')


    useEffect(() => {
        hideHeader();
        return () => showHeader()
    })
    // event properties changers
    const updateEventTitle = (title: string) => {
        setPrivateEvent({ ...privateEvent, ...{ eventTitle: title } })
    }
    const updateEventLocation = (location: string) => {
        setPrivateEvent({ ...privateEvent, ...{ eventLocation: location } })
    }
    const updateEventDate = (date: string) => {
        const split = reverseDate(date)
        setPrivateEvent({ ...privateEvent, ...{ eventDate: split } })
    }
    const updateEventDetails = (details: string) => {
        setPrivateEvent({ ...privateEvent, ...{ eventDetails: details } })
    }
    const updateEventStartHour = (startHour: string) => {
        setPrivateEvent({ ...privateEvent, ...{ eventHours: { ...privateEvent.eventHours, ... { startHour: startHour } } } })
    }
    const updateEventEndHour = (endHour: string) => {
        setPrivateEvent({ ...privateEvent, ...{ eventHours: { ...privateEvent.eventHours, ... { endHour: endHour } } } })
    }
    const updateEventImage = (image: string) => {
        setPrivateEvent({ ...privateEvent, ...{ eventImageURL: image } })
    }

    const addPrivateEventAction = () => {
        if (isValidPrivateEvent(privateEvent)) {
            doLoad()
            firebase.realTime.addPrivateEvent(privateEvent, imageBuffer)
                .then((response) => {
                    if (response && response as { id: string }) {
                        const dialogTitle = lang === 'heb' ? `תודה ${appUser?.name ?? ''}, הבקשה ליצירת האירוע התקבלה. האירוע יאושר על ידי ההנהלה תוך זמן קצר. לאחר אישור האירוע תקבל/י קישור הניתן לשיתוף לדף הזמנה  .` : `Thanks ${appUser?.name ?? ''}, Event creation request accepted.and will be Approved by management shortly. Once the event is approved, you will receive a shareable link for the invitation.`

                        cancelLoad()
                        openDialog({
                            content: <span
                                dir={SIDE(lang)}
                                style={{
                                    padding: '8px',
                                    color: SECONDARY_WHITE
                                }}
                            >{dialogTitle}</span>
                        })
                    } else {
                        cancelLoad()
                        alert('קרתה תקלה בהוספת האירוע, אנא פנא אל המתכנת')
                    }
                }).catch(e => {
                    console.log(e)
                    cancelLoad()
                })
        } else {
            alert('יש למלא את כל שדות הדרושים על מנת ליצור הזמנה')
        }
    }

    return <PageHolder style={{ maxWidth: '600px', border: 'none', marginLeft: 'auto', marginRight: 'auto' }}>

        <SectionTitle title={CREATE_INVITATION_TITLE(lang)} style={{}} />
        <InnerPageHolder style={{border: '1px solid gray' , background: 'black' }}>
            < Stack style={{ maxWidth: '300px' }} spacing={1}>

                <input onChange={(event) => {
                    if (event.target.files) {
                        setImage(URL.createObjectURL(event.target.files[0]))
                        event.target.files[0].arrayBuffer()
                            .then(buff => {
                                setImageBuffer(buff)
                            })
                            .catch(() => {
                                alert('אירעתה בעיה בבחירת התמונה אנא פנא לצוות האתר')
                            })
                    }

                }} type="file" id="files_create_event" style={{ display: 'none' }} />
                <img id='menu_event_create_image_2' alt='' src={image ? image : event_placeholder} style={{

                    alignSelf: 'center',
                    minHeight: '150px',
                    width: '80%',
                    maxWidth: '225px',
                    height: '75px',
                    boxShadow: elegantShadow()
                }} />          <label style={{
                    color: PRIMARY_ORANGE,
                    padding: '8px',
                    borderRadius: '8px',
                    fontWeight:'bold',
                    cursor: 'pointer',
                    alignSelf: 'center',
                    marginTop: '16px',
                    width: 'fit-content',
                    backgroundColor:'transparent'
                }} onChange={(e) => alert(e)} htmlFor='files_create_event'>{PICK_IMAGE(lang, true)}</label>

                <FormField
                    title={EVENT_TITLE(lang)}
                    value={(privateEvent.eventTitle && privateEvent.eventTitle !== 'null') ? privateEvent.eventTitle : ""}
                    placeholder={EVENT_TITLE(lang)}
                    style={{ width: '100%', color: PRIMARY_BLACK }}
                    type={'text'}
                    onChange={updateEventTitle} />
                <label dir={SIDE(lang)} style={{ fontWeight: 'bold', color: SECONDARY_WHITE, paddingTop: '6px' }}>{EVENT_ADDRESS(lang)}</label>

                <Places value={''}
                    handleAddressSelect={updateEventLocation}
                    types={['address']}
                    className={''}
                    fixed={false}
                    id={{}}

                    style={{
                        width: '100%',
                        borderRadius:'32px',
                        marginBottom: '2px',
                        color: SECONDARY_WHITE,
                        background: PRIMARY_BLACK
                    }} placeHolder={EVENT_ADDRESS(lang)} />




                <FormField
                    title={EVENT_DATE(lang)}
                    placeholder={EVENT_DATE(lang)}
                    style={{ width: '100%', color: PRIMARY_BLACK }}
                    value={unReverseDate(privateEvent.eventDate)}
                    type={'date'}
                    name={'date'}
                    onChange={updateEventDate} />

                <FormField
                    title={EVENT_START(lang)}
                    placeholder={EVENT_START(lang)}
                    value={privateEvent.eventHours.startHour}
                    type={'text'}
                    style={{ width: '100%', color: PRIMARY_BLACK }}
                    name={'time'}
                    onChange={updateEventStartHour} />


                <FormField
                    title={EVENT_END(lang)}
                    value={privateEvent.eventHours.endHour}
                    style={{ width: '100%', color: PRIMARY_BLACK }}
                    placeholder={EVENT_END(lang)}
                    type={'text'}
                    name={'time'}
                    onChange={updateEventEndHour} />


                <Spacer offset={1} />
                <Button
                    onClick={addPrivateEventAction}
                    style={{ ...submitButton(false), ...{ marginTop: '0px', width: '80%',paddingTop:'8px',paddingBottom:'8px', textTransform: 'none' } }}>{CREATE_INVITATION(lang)}</Button>
            </Stack >
        </InnerPageHolder>
    </PageHolder>
}