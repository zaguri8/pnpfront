import 'firebaseui/dist/firebaseui.css'
import React, { createContext, useContext, useMemo, useState } from 'react';
import 'firebase/compat/auth';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { List, Button, Stack, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import '../event/EventPage.css'
import { useParams } from 'react-router';
import { PageHolder } from '../utilityComponents/Holders';
import { CHOOSE_RIDE, CONFIRM_EVENT_ARRIVAL, CONFIRM_EVENT_ARRIVAL_2, SIDE } from '../../settings/strings';
import { HtmlTooltip } from '../utilityComponents/HtmlTooltip';
import Spacer from '../utilityComponents/Spacer';
import { Hooks } from '../generics/types';
import { CommonHooks, withHookGroup } from '../generics/withHooks';
import { locationPinIconStyle, todayIconStyle } from '../gallery/Gallery';
import useCompanyRidesCalendar, { IRidesCalendar } from './CompanyRidesCalendar';
import {
    CalendarCompanyImageStyle, CalendarControlsStyle,
    CalendarListStyle, CalendarListWrapperStyle,
    CalendarWelcomeStyle, CompanyNameHeaderStyle,
    ControlStyle, HeaderParagpraphCalendar,
    RidesCalendarStackStyle,
    CalendarShowingWeekStyle,
    SubmitConfirmationStyle,
    ToolTipStyle, WeekDaysRideList, ColorSquareSelected, ColorSquareSelectedToRemove, ColorSquareConfirmed, ColorSquareMap
} from './InvitationUIProver';
import { showingWeek } from './invitationsWorkerHelper';
import PNPList, { CollapsingList } from '../generics/PNPList';
import { PNPWorkersRide } from '../../store/external/types';


// this page was written bad when i just started front-end development, but im too lazy to update it



const Context = createContext<IRidesCalendar | null>(null)
export const useIWContextConsumer = () => {
    const context = useContext(Context);
    return context
}
const Provider = (props: Hooks & { children: any }) => {
    const { id } = useParams()
    const calendar = useCompanyRidesCalendar(props, id)
    return <Context.Provider value={calendar}>
        {props.children}
    </Context.Provider>
}
function InvitationCardWorkers(props: Hooks) {
    const calendar = useIWContextConsumer()
    if (!calendar) return null
    const companyDoesNotExist = !calendar?.company
    const companyValid = calendar?.company != null
    if (companyDoesNotExist) {
        return <div style={{ padding: '32px' }}>Event Does not exist</div>
    } else if (companyValid) {
        return <PageHolder style={{ direction: SIDE(props.language.lang), marginTop: '0px' }}>

            {calendar.company && calendar.company.logo ? <img alt='No image for this event'
                style={CalendarCompanyImageStyle}
                src={calendar.company.logo} /> : null}
            <Stack spacing={1}>
                <span style={CompanyNameHeaderStyle}>{calendar.company?.name}</span>
                <Stack direction={'row'} columnGap={2}>
                    <p style={HeaderParagpraphCalendar}><LocationOnIcon className="img_pin_location" style={locationPinIconStyle} />{calendar.company?.name}</p>
                    <p style={HeaderParagpraphCalendar}><CalendarTodayIcon style={todayIconStyle} />{new Date().getUTCDay()} </p>
                </Stack>
            </Stack>
            <div style={CalendarListWrapperStyle}>
                <List style={CalendarListStyle}>
                    {/* Arriving to rides Check box */}
                    <List style={{ width: '100%' }} dir={SIDE(props.language.lang)}>
                        {props.user.appUser && <Typography
                            style={CalendarWelcomeStyle} >
                            {props.language.lang === 'heb' ? `היי ${props.user.appUser.name}, אנא בחר את התחנה הרצויה וסמן את הימים שבהם תגיע להסעה. לאחר מכן לחץ ״אשר הגעה״.`: `Hello ${props.user.appUser.name}, choose the station and mark the days on which you will arrive for the shuttle, then click confirm arrival`}
                        </Typography>}
                        <br />

                        <Stack direction={'row'} justifyContent={'space-between'} style={CalendarControlsStyle}>
                            <ArrowForwardIosIcon style={ControlStyle} onClick={() => calendar?.weekForwards()} />
                            <div style={CalendarShowingWeekStyle}>{showingWeek(calendar.today)}</div>
                            <ArrowBackIosIcon style={ControlStyle} onClick={() => calendar?.weekBackwards()} />
                        </Stack>
                        <PNPList<PNPWorkersRide>
                            renderRow={(ride) => <WeekDaysRideList {...{ props, ride }} />}
                            items={calendar.rides!}
                            ElementWrapper={Stack}
                            inlineCenter />
                    </List>
                    <Stack spacing={1}
                        style={RidesCalendarStackStyle}>

                        {/* {!event.registrationRequired && <TextField classes={classes}
                            onChange={(e) => updateConfirmationName(e.target.value)}
                            name='fullname'
                            placeholder={FULL_NAME(props.language.lang)} />}
                        {!event.registrationRequired && <TextField classes={classes}
                            name='phone'
                            type='tel'
                            onChange={(e) => updateConfirmationPhone(e.target.value)}
                            place holder={PHONE_NUMBER(props.language.lang)} />} */}
                    </Stack>
                    {/*!props.user.appUser
                        ? <RegistrationForm
                            externalRegistration
                            registerButtonText={CONFIRM_EVENT_ARRIVAL(props.language.lang)}
                            style={{
                                width: 'fit-content',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }} registrationSuccessAction={(user: User) => {
                                let unsub: Unsubscribe | undefined;
                                unsub = StoreSingleton.get().realTime.getUserById(user.uid, ((u: PNPUser) => {
                                    if (u && u.name) {
                                        props.loading.cancelLoad()
                                        calendar.saveConfirmation(user, u)
                                        unsub && (unsub as Unsubscribe) && unsub()
                                    }
                                }))
                            }} /> :*/ <HtmlTooltip sx={ToolTipStyle} arrow title={calendar.selectedRides.length === 0 ? CHOOSE_RIDE(props.language.lang) : 'אשר הגעה'}>
                            <span>
                          

                                <div style={ColorSquareMap}>
                                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                        <div style={ColorSquareConfirmed} />
                                        <span>הסעה מאושרת</span>
                                    </Stack>
                                    <Stack direction={'row'} alignItems={'center'} spacing={1}>

                                        <div style={ColorSquareSelected} />
                                        <span>הסעה מסומנת לאישור</span>
                                    </Stack>
                                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                        <div style={ColorSquareSelectedToRemove} />
                                        <span>הסעה מסומנת לביטול</span>
                                    </Stack>
                                </div>
                            </span>
                        </HtmlTooltip>}
                </List>
            </div>
        </PageHolder >
    } else return null
}

export default withHookGroup((props: Hooks) => {
    return <Provider {...props}>
        <InvitationCardWorkers {...props} />
    </Provider>
}, [...CommonHooks, 'cookies'])