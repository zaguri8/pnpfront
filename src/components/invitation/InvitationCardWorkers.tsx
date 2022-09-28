import 'firebaseui/dist/firebaseui.css'
import React, { CSSProperties, useEffect, useState } from 'react';
import 'firebase/compat/auth';
import sold_out from '../../assets/images/sold_out.png'
import $ from 'jquery'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { RegistrationForm } from '../auth/Register';
import { List, Button, MenuItem, Stack, TextField, Typography, Checkbox } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { PNPCompany, PNPCompanyRideConfirmation, PNPUser } from '../../store/external/types';
import { isValidCompany, isValidSingleWorkersRideConfirmation, isValidWorkersRide } from '../../store/validators';
import '../event/EventPage.css'
import { PNPWorkersRide } from '../../store/external/types';
import { useNavigate, useParams } from 'react-router';
import { BETA } from '../../settings/config';
import { DARK_BLACK, PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_PINK, SECONDARY_WHITE } from '../../settings/colors';
import { InnerPageHolder, PageHolder } from '../utilityComponents/Holders';
import { CHOOSE_RIDE, CONFIRM_EVENT_ARRIVAL, FULL_NAME, PHONE_NUMBER, SIDE } from '../../settings/strings';
import { HtmlTooltip } from '../utilityComponents/HtmlTooltip';
import { submitButton, textFieldStyle } from '../../settings/styles';
import { Unsubscribe } from 'firebase/database';
import { makeStyles } from '@mui/styles';
import Spacer from '../utilityComponents/Spacer';
import { getDefaultConfirmationCompanyRide } from '../../store/external/helpers';
import { Hooks } from '../generics/types';
import { CommonHooks, withHookGroup } from '../generics/withHooks';
import { StoreSingleton } from '../../store/external';
import { User } from 'firebase/auth';
import { locationPinIconStyle, paragraphStyle, todayIconStyle } from '../gallery/Gallery';
import { getDateString, getDaysInCurrentMonth, getDaysInMonth } from '../../utilities';
import { determineOffset, getAllWeekDaysLeft, getAllWeekDaysLeftFromDate, getDateWithDayString, getDayName, isEqualDates, isEqualRides, nameforDir, trueDateForSelectedRide, userHasConfirmationForDate } from './invitationsWorkerHelper';
import CompanyRidesCalendar, { IRidesCalendar, SelectedRide } from './CompanyRidesCalendar';
import { v4 } from 'uuid';
import { months } from 'moment';

export const rideTitleStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
}

const typographyStyle = {
    fontFamily: 'Open Sans Hebrew',
    color: PRIMARY_PINK,
    fontSize: '18px'
}
const spanStyle = {
    fontFamily: 'Open Sans Hebrew'
}
const RidesCardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '8px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    marginBlock: '8px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
} as CSSProperties

const styleForRide = (selected: SelectedRide, calendar: IRidesCalendar) => (calendar && selected) ? (() => {
    const equal = isEqualRides(calendar, selected)
    return ({
        width: '100%',
        background: Number(calendar.confirmationForWeek?.date.split('/')[0]) === (selected.day - determineOffset(calendar.today)) ? 'gray' : equal ? 'rgba(0,0,0,0.8)' : selected.ride.extras.rideStatus === 'sold-out' ? `url(${sold_out})` : 'none',
        backgroundSize: (selected.ride.extras.rideStatus === 'sold-out' && !equal) ? '125px 50px' : '100%',
        color: (equal ? 'white' : 'black'),
        border: '.1px solid lightgray',
        borderRadius: '8px',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: selected.ride.extras.rideStatus === 'sold-out' && !equal ? '50% center' : 'center center',
        padding: '8px',
        display: 'flex',
    })
})() : {}
const CalendarStackStyle = {
    maxWidth: '600px',
    width: '100%',
    ...RidesCardStyle
}
// this page was written bad when i just started front-end development, but im too lazy to update it




const showingWeek = (c: IRidesCalendar) => {
    if (c) {
        const offset = (isEqualDates(c.today, new Date()) ? getAllWeekDaysLeft().length : getAllWeekDaysLeftFromDate(c.today).length) - 1
        let x1 = trueDateForSelectedRide(c.today, {
            day: c.today.getDate()
        })
        let x2 = trueDateForSelectedRide(c.today, {
            day: c.today.getDate() + offset
        })
        return x2 + " - " + x1;
    }
    return ""
}

function InvitationCardWorkers(props: Hooks) {
    const { id } = useParams()
    const calendar = CompanyRidesCalendar(props, id)

    if (!calendar) return null
    function getMenuItems(ride: PNPWorkersRide) {
        if (!calendar) return null
        const RideRow = (p: SelectedRide & { index: number, weekDay: number }) => {
            return (<MenuItem
                disabled={calendar.confirmationForWeek !== undefined}
                dir='rtl'
                onClick={() => {
                    calendar.selectRide(p)
                }} style={styleForRide(p, calendar)} value={ride.id}>
                <div style={rideTitleStyle} >
                    <Stack direction={'row'} alignItems={'center'} style={{ columnGap: '8px' }}>
                        <DirectionsBusIcon style={{ color: PRIMARY_ORANGE }} />
                        <Stack className='eventRideRowName_ePage' direction={'row'} alignItems={'center'} justifyContent={'center'}>
                            <div>{getDayName(p.weekDay)}</div>
                            <b style={{ marginInline: '4px' }}> - {trueDateForSelectedRide(calendar.today, p)}</b>
                        </Stack>
                    </Stack>
                    <span className={calendar.selectedRide === p ? 'eventTimeSelected_ePage' : 'eventTime_ePage'}>{ride.extras.twoWay ? ride.rideTime : ride.extras.rideDirection === '1' ? ride.backTime : ride.rideTime}</span>
                </div>
            </MenuItem>)
        }



        return <Stack alignSelf={'center'} spacing={1} style={CalendarStackStyle}>
            <React.Fragment
                key={ride.id + ride.startPoint + Math.random() * Number.MAX_VALUE}>
                <Stack>

                    <Typography
                        style={typographyStyle} >
                        {ride.startPoint}
                    </Typography>
                    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>

                        {!ride.extras.twoWayOnly && <span
                            style={{ fontSize: '14px', textAlign: 'center', color: PRIMARY_BLACK }}
                        >{props.language.lang === 'heb' ? 'בחר הסעה: הלוך/חזור/הלוך וחזור' : 'Choose directions'}</span>}
                    </Stack>
                </Stack>
                {calendar.weekDays.map((day, index) => <RideRow index={index} week={calendar.selectedWeek} key={v4()}
                    day={(calendar.today.getDate() + index)} weekDay={day} ride={ride} />)}
            </React.Fragment>
        </Stack >
    }


    const companyDoesNotExist = !calendar?.company
    const companyValid = calendar?.company != null
    if (companyDoesNotExist) {
        return <div style={{ padding: '32px' }}>Event Does not exist</div>
    } else if (companyValid) {
        return <PageHolder style={{ direction: SIDE(props.language.lang), marginTop: '0px' }}>

            {calendar.company && calendar.company.logo ? <img alt='No image for this event'
                style={{ width: '50%', minWidth: '300px', height: '50%' }}
                src={calendar.company.logo} /> : null}
            <Stack spacing={1}>
                <span style={{ ...spanStyle, fontWeight: 'bold', paddingTop: '8px', color: PRIMARY_PINK, fontSize: '20px' }}>{calendar.company?.name}</span>
                <Stack direction={'row'} columnGap={2}>
                    <p style={{ ...paragraphStyle, color: SECONDARY_WHITE, fontSize: '16px' }}><LocationOnIcon className="img_pin_location" style={locationPinIconStyle} />{calendar.company?.name}</p>
                    <p style={{ ...paragraphStyle, color: SECONDARY_WHITE, fontSize: '16px' }}><CalendarTodayIcon style={todayIconStyle} />{new Date().getUTCDay()} </p>
                </Stack>
            </Stack>
            <div style={{ width: '100%', background: PRIMARY_BLACK }}>
                <List style={{ width: '85%', background: PRIMARY_BLACK, minWidth: 'fit-content', marginLeft: 'auto', marginRight: 'auto', padding: '16px' }}>
                    {/* Arriving to rides Check box */}

                    <List style={{ width: '100%' }} dir={SIDE(props.language.lang)}>
                        {props.user.appUser && <Typography
                            style={{ ...{ fontSize: '24px', color: SECONDARY_WHITE, fontFamily: 'Open Sans Hebrew' } }} >
                            {props.language.lang === 'heb' ? `שלום, ${props.user.appUser.name}` : `Hello, ${props.user.appUser.name}`}
                        </Typography>}
                        <Typography
                            style={{ ...{ fontSize: '24px', color: SECONDARY_WHITE, fontFamily: 'Open Sans Hebrew' } }} >
                            {props.language.lang === 'heb' ? 'בחר/י נקודת אסיפה/הורדה' : 'Start Point/Destination'}
                        </Typography>
                        <br />

                        <Stack direction={'row'} justifyContent={'space-between'} style={{ background: 'white', padding: '8px', width: '100%', borderRadius: '4px', maxWidth: '500px', marginInline: 'auto' }}>
                            <ArrowForwardIosIcon style={{ cursor: 'pointer', color: PRIMARY_PINK }} onClick={() => calendar?.weekForwards()} />
                            <div>{showingWeek(calendar)}</div>
                            <ArrowBackIosIcon style={{ cursor: 'pointer', color: PRIMARY_PINK }} onClick={() => calendar?.weekBackwards()} />
                        </Stack>
                        {calendar.rides!.map(ride => {
                            return <React.Fragment key={ride.id + ride.companyId}>
                                {getMenuItems(ride)}
                            </React.Fragment>

                        })}
                        <Spacer offset={1} />

                    </List>
                    <Stack spacing={1}
                        style={{ width: '300px', marginLeft: 'auto', marginRight: 'auto' }}>

                        {/* {!event.registrationRequired && <TextField classes={classes}
                            onChange={(e) => updateConfirmationName(e.target.value)}
                            name='fullname'
                            placeholder={FULL_NAME(props.language.lang)} />}
                        {!event.registrationRequired && <TextField classes={classes}
                            name='phone'
                            type='tel'
                            onChange={(e) => updateConfirmationPhone(e.target.value)}
                            placeholder={PHONE_NUMBER(props.language.lang)} />} */}
                    </Stack>
                    {!props.user.appUser
                        ? <RegistrationForm
                            externalRegistration
                            registerButtonText={CONFIRM_EVENT_ARRIVAL(props.language.lang)}
                            style={{
                                width: 'fit-content',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }} registrationSuccessAction={(user: User) => {
                                props.loading.doLoad()
                                let unsub: Unsubscribe | undefined;
                                unsub = StoreSingleton.get().realTime.getUserById(user.uid, ((u: PNPUser) => {
                                    if (u && u.name) {
                                        props.loading.cancelLoad()
                                        unsub && (unsub as Unsubscribe) && unsub()
                                    }
                                }))
                            }} /> : <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} arrow title={calendar.selectedRide === null ? CHOOSE_RIDE(props.language.lang) : 'אשר הגעה'}>
                            <span>
                                <Button onClick={() => calendar.saveConfirmation()}
                                    sx={{
                                        ...submitButton(false),
                                        ... { textTransform: 'none', margin: '16px', padding: '8px', minWidth: props.language.lang === 'heb' ? '200px' : '250px' }
                                    }}
                                    disabled={calendar.selectedRide === null}>
                                    {CONFIRM_EVENT_ARRIVAL(props.language.lang)}
                                </Button>
                            </span>
                        </HtmlTooltip>}
                </List>
            </div>
        </PageHolder >
    } else return null
}

export default withHookGroup(InvitationCardWorkers, [...CommonHooks, 'cookies'])