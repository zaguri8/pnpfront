import 'firebaseui/dist/firebaseui.css'
import { useEffect, useState } from 'react';
import Auth from '../auth/Auth';
import 'firebase/compat/auth';
import $ from 'jquery'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { alreadyHasInvitation, insertInvitation } from '../../auth/db';
import { ThreeDots } from 'react-loader-spinner';
import { useFirebase } from '../../context/Firebase';

export function LoadingIndicator(props) {
    return (<div style={{
        display: props.loading ? 'inherit' : 'none',
        background: 'white',
        zIndex:'9999',
        padding: '8px',
        borderRadius: '8px',
        position: 'fixed',
        top: '0',
        left: '0',
        transform: 'translate(calc(50vw - 50%), calc(50vh - 50%))'
    }}>
        <ThreeDots ariaLabel='loading-indicator' color={'orangered'} />
    </div>);
}
function InvitationCard(props) {
    const [loading, setLoading] = useState(false)
    const [hasInvitation, setHasInvitation] = useState(null)
    const { isAuthenticated, firebase } = useFirebase()
    useEffect(() => {
        if (hasInvitation == null) {
            alreadyHasInvitation(firebase.auth, firebase.temp, props.eventName, (state) => setHasInvitation(state))
        }
    })
    function validateForm(direction, phone) {
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

    async function sendInvitation(e) {
        e.preventDefault()

        var direction;
        for (var i = 5; i < 8; i++) {
            var checkBox = e.target[i]
            if (checkBox.checked) {
                direction = checkBox.value
                break
            }
        }
        const numOfPeople = $('#numofpeople').val() ? $('#numofpeople').val() : 1
        startLoading()
        const phone = $('#phone').val()

        if (validateForm(direction, phone)) {
            await alreadyHasInvitation(firebase.auth, firebase.temp, props.eventName, (hasInvitation) => {
                if (hasInvitation) {
                    alert(`תודה ${firebase.auth.currentUser.displayName}, קיבלנו את אישורך `)
                    setHasInvitation(true)
                    stopLoading()
                } else {
                    insertInvitation(firebase.auth, firebase.temp, direction, numOfPeople, props.startPoint, phone, props.eventName)
                        .then(() => {
                            alert(`תודה ${firebase.auth.currentUser.displayName}, קיבלנו את אישורך `)
                            setHasInvitation(true)
                            stopLoading()
                        })
                        .catch(() => {
                            alert('אירעתה שגיאה באישור ההזמנה אנא נסה שוב מאוחר יותר')
                            stopLoading()
                        })
                }
            })
        }
    }

    function handleCheck(e) { }

    const InvitationConfirmation = () => {
        return <p style={{ color: 'white' }}>
            היי {<b>{firebase.auth.currentUser.displayName + " ,"}</b>}<br />
            תודה על אישור הגעתך להסעה לאירוע<br />
            <b>{props.eventName}</b><br />
            בשעה {props.eventTime + " "}
            מ{props.startPoint}
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
                <p style={{ color: 'white', fontSize: '22px' }}>{`היי, ${firebase.auth.currentUser.displayName}`}</p>
                <p style={{ color: 'white', fontSize: '22px' }}> <b>זהו טופס אישור הגעה להסעה:<br /></b> {props.eventTime} מ {props.startPoint}<br /> לאירוע: {props.eventName}</p>
                <input readOnly value={firebase.auth.currentUser.email} name="to_mail" style={{ display: 'none' }} />
                <input readOnly value={props.eventName} name="event_name" style={{ display: 'none' }} />
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

                    style={{ alignItems: 'center', padding: '16px', color: 'white' }}
                    onChange={handleCheck}>
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
                {hasInvitation ? <InvitationConfirmation /> : <InvitationForm />}
                <button onClick={() => firebase.auth.signOut()} type='button' style={{ margin: '16px', padding: '16px', background: 'white', fontSize: '12px', border: 'none', borderRadius: '16px' }}>{'התנתק'}</button>
            </div>)
    }

    const renderElements = () => {
        if (!isAuthenticated) {
            return <Auth title='התחבר על מנת לאשר הגעה' />
        } else if (hasInvitation === null) {
            return <LoadingIndicator loading />
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