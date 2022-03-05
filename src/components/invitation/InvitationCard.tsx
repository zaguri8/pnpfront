import 'firebaseui/dist/firebaseui.css'
import { FormEvent, useEffect, useState } from 'react';
import Auth from '../auth/Auth';
import 'firebase/compat/auth';

import $ from 'jquery'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useFirebase } from '../../context/Firebase';
import { PNPPrivateEvent, PNPEvent, PNPRideConfirmation } from '../../store/external/types';
import { isValidPrivateEvent, isValidPublicRide, isValidRideConfirmation } from '../utilities/validators';
import LoadingIndicator from '../utilities/LoadingIndicator';
import { PNPPublicRide } from '../../store/external/types';
function InvitationCard(props: { eventId: string }) {
    const [confirmation, setConfirmation] = useState<PNPRideConfirmation | null>(null)

    const [loading, setLoading] = useState(false)
    const [event, setEvent] = useState<PNPPrivateEvent | null>(null)
    const [rides, setRides] = useState<PNPPublicRide[] | null>(null)
    const { isAuthenticated, firebase } = useFirebase()

    useEffect(() => {
        firebase.realTime.getPrivateEventById(props.eventId).then((event) => {
            if (isValidPrivateEvent(event as PNPPrivateEvent)) {
                setEvent(event as PNPPrivateEvent)
            } else {
                setEvent(null)
            }
        })

        firebase.realTime.getPrivateEventRidesById(props.eventId).then(rides => {
            if (rides as PNPPublicRide[]) {
                setRides(rides as PNPPublicRide[])
            }
        })

        firebase.realTime.getRideConfirmationByEventId(props.eventId)
            .then((confirmation) => {
                if (confirmation as PNPRideConfirmation)
                    if (isValidRideConfirmation(confirmation as PNPRideConfirmation)) {
                        setConfirmation(confirmation as PNPRideConfirmation)
                    }
            })

    }, [])

    function validateForm(direction: string, phone: string) {
        if (direction.length < 1) {
            stopLoading()
            alert('יש לבחור כיוון נסיעה')
            return false
        }

        if (phone.length < 10) {
            alert('יש להכניס מספר נייד תקין')
            stopLoading()
            return false
        }
        return true
    }

    async function sendInvitation(e: FormEvent) {
        e.preventDefault()

        var direction: any;
        for (var i = 5; i < 8; i++) {
            var checkBox: any = e.target
            if (checkBox.checked) {
                direction = checkBox.value
                break
            }
        }
        const numOfPeople = $('#numofpeople').val() ? $('#numofpeople').val() : 1
        startLoading()
        const phone = $('#phone').val()

        if (validateForm(direction, phone as string)) {
            const confirmation: PNPRideConfirmation = {
                confirmationId: '',
                eventId: props.eventId,
                directions: direction,
                date: event!.eventDate,
                passengers: numOfPeople as string
            }
            await firebase.realTime.addRideConfirmation(confirmation)
                .then(() => {
                    alert(`תודה ${firebase.auth.currentUser?.displayName}, קיבלנו את אישורך `)
                    setConfirmation(confirmation)
                    stopLoading()
                })
        }
    }
    const InvitationConfirmation = () => {
        return <p style={{ color: 'white' }}>
            היי {<b>{firebase.auth.currentUser?.displayName + " ,"}</b>}<br />
            תודה על אישור הגעתך להסעה לאירוע<br />
            <b>{event!.eventTitle}</b><br />
            בשעה {event!.eventHours.startHour + " "}
            מ{event}
        </p>
    }

    function startLoading() {
        setLoading(true)
        $('div *').prop('disabled', true)
    }

    function stopLoading() {
        $('div *').prop('disabled', false)
        setLoading(false)
    }




    const InvitationForm = () => {
        return (
            <form onSubmit={(e) => sendInvitation(e)} >
                <p style={{ color: 'white', fontSize: '22px' }}>{`היי, ${firebase.auth.currentUser?.displayName}`}</p>
                <p style={{ color: 'white', fontSize: '22px' }}> <b>זהו טופס אישור הגעה להסעה:<br /></b> { } מ { }<br /> לאירוע: {event!.eventTitle}</p>
                <input readOnly value={firebase.auth.currentUser?.email ? firebase.auth.currentUser!.email : ''} name="to_mail" style={{ display: 'none' }} />
                <input readOnly value={event!.eventTitle} name="event_name" style={{ display: 'none' }} />
                <input readOnly value={'18:00'} name="event_time" style={{ display: 'none' }} />
                <input style={{ padding: '8px' }} id='phone' type='tel' placeholder='מס נייד'></input>

                <LoadingIndicator loading={loading} />
                <div>

                    <label style={{ fontWeight: 'bold', color: 'white', marginTop: '8px', padding: '8px', display: 'inline-block' }}>כמה אורחים תהיו ?</label><br />
                    <select id='numofpeople' style={{ padding: '4px' }}>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                    </select>
                </div>

                <RadioGroup

                    style={{ alignItems: 'center', padding: '16px', color: 'white' }}>
                    <label style={{ fontWeight: 'bold', padding: '4px', margin: '4px' }}>בחר כיווני הסעה</label>

                    <FormControlLabel style={{ marginLeft: '26px' }} value={'הסעה הלוך'} control={<Radio style={{ color: 'white' }} />} label='הסעה הלוך'></FormControlLabel>
                    <FormControlLabel style={{ marginLeft: '26px' }} value={'הסעה חזור'} control={<Radio style={{ color: 'white' }} />} label='הסעה חזור '></FormControlLabel>
                    <FormControlLabel value={'הסעה הלוך וחזור'} control={<Radio style={{ color: 'white' }} />} label='הסעה הלוך וחזור'></FormControlLabel>
                </RadioGroup>

                <button type='submit' style={{ padding: '16px', background: 'white', color: 'black', fontSize: '22px', border: 'none', borderRadius: '16px' }}>{'אשר הגעה'}</button>
            </form>
        )
    }

    const InvitationPage = () => {
        return (
            <div >
                {confirmation ? <InvitationConfirmation /> : event ?  <InvitationForm /> : <LoadingIndicator loading />}
                <button onClick={() => firebase.auth.signOut()} type='button' style={{ margin: '16px', padding: '16px', background: 'white', fontSize: '12px', border: 'none', borderRadius: '16px' }}>{'התנתק'}</button>
            </div>)
    }

    const renderElements = () => {
        if (!isAuthenticated) {
            return <Auth title='התחבר על מנת לאשר הגעה' />
        } else if (confirmation === null) {
            return <LoadingIndicator loading={loading} />
        } else {
            return <InvitationPage />
        }
    }

    return (
        <div dir='rtl' style={{ background: 'orange', display: 'flex', flexDirection: 'column' }}>
            <p style={{ color: 'white', fontSize: '22px' }}><b style={{ fontWeight: 'bold', margin: '0px' }}>אישור הגעה להסעה לאירוע:</b><br /> החתונה של הגר וגבריאל </p>
            {renderElements()}
        </div>
    );
}

export default InvitationCard