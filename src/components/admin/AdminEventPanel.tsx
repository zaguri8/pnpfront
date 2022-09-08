
import { PNPEvent } from "../../store/external/types"
import { Button, Stack } from '@mui/material'
import { SECONDARY_WHITE, DARKER_BLACK_SELECTED, ORANGE_GRADIENT_PRIMARY, SECONDARY_BLACK, BLACK_ELEGANT, BLACK_ROYAL, DARK_BLACK, PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_PINK } from "../../settings/colors"
import { useNavigate } from "react-router"
import HTMLFromText from '../utilityComponents/HtmlFromText'
import { v4 } from 'uuid'
import SectionTitle from "../other/SectionTitle"
import { useLocation } from 'react-router-dom'
import { PageHolder, InnerPageHolder } from '../utilityComponents/Holders'
import { useLoading } from "../../context/Loading"
import { useUser } from "../../context/Firebase"
import { CSSProperties, useEffect } from "react"
import { useHeaderBackgroundExtension } from "../../context/HeaderContext"
import { Hooks } from "../generics/types"
import { CommonHooks, withHookGroup } from "../generics/withHooks"
import { StoreSingleton } from "../../store/external"
const AdminEventPanel = (props: Hooks) => {
    const location = useLocation()
    const tableTitleStyle: CSSProperties = { fontSize: '20px', color: SECONDARY_WHITE }
    useEffect(() => {
        props.headerExt.hideHeader()
        return () => props.headerExt.showHeader()
    }, [])

    function openEditDialog(event: PNPEvent) {
        props.loading.openDialog({
            content: <InnerPageHolder style={{ padding: '8px', margin: '8px', background: SECONDARY_BLACK }}>
                <Stack spacing={2} style={{ padding: '8px', color: SECONDARY_WHITE, width: '100%' }}>

                    <Stack>
                        <label style={{ fontWeight: 'bold' }}>{'שם אירוע'}</label>
                        <span>{event.eventName}</span>
                    </Stack>

                    <Stack>
                        <label style={{ fontWeight: 'bold' }}>{'גרפיקה'}</label>
                        <img style={{ width: '120px', height: '120px', alignSelf: 'center' }} src={event.eventImageURL} />
                    </Stack>

                    <Stack> <label style={{ fontWeight: 'bold' }}>{'תאריך אירוע'}</label>
                        <span>{event.eventDate}</span>
                    </Stack>

                    <Stack>
                        <label style={{ fontWeight: 'bold' }}>{'שעת התחלה'}</label>
                        <span>{event.eventHours.startHour}</span>
                    </Stack>

                    <Stack>
                        <label style={{ fontWeight: 'bold' }}>{'שעת סיום'}</label>
                        <span>{event.eventHours.endHour}</span>
                    </Stack>

                    <Stack> <label style={{ fontWeight: 'bold' }}>{'מיקום'}</label>
                        <span>{event.eventLocation}</span>
                    </Stack>

                    <Stack>
                        <label style={{ fontWeight: 'bold' }}>{'כמות אנשים צפויה'}</label>
                        <span>{event.expectedNumberOfPeople}</span>
                    </Stack>

                    <Stack>
                        <label style={{ fontWeight: 'bold' }}>{'גיל מינ'}</label>
                        <span>{event.eventAgeRange.minAge}</span>
                    </Stack>

                    <Stack>
                        <label style={{ fontWeight: 'bold' }}>{'גיל מקס'}</label>
                        <span>{event.eventAgeRange.maxAge}</span>
                    </Stack>

                    <Stack>
                        <label style={{ fontWeight: 'bold' }}>{'סוג אירוע'}</label>
                        <span>{event.eventType}</span>
                    </Stack>

                    {event.eventAttention &&
                        <Stack>
                            {event.eventAttention.eventAttention1 && <Stack>
                                <label style={{ fontWeight: 'bold' }}>{'שימו לב 1'}</label>
                                <span>{event.eventAttention.eventAttention1}</span>
                            </Stack>}

                            {event.eventAttention.eventAttention2 && <Stack>
                                <label style={{ fontWeight: 'bold' }}>{'שימו לב 2'}</label>
                                <span>{event.eventAttention.eventAttention2}</span>
                            </Stack>}
                        </Stack>}


                    <Stack style={{ width: '100%' }}>
                        <label style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{'פרטים'}</label>
                        <div style={{ overflow: 'scroll', boxSizing: 'border-box' }}>
                            <HTMLFromText text={event.eventDetails} style={{ minHeight: '100px' }} />
                        </div>
                    </Stack>


                </Stack>
            </InnerPageHolder>
        })
    }
    return <PageHolder style={{ background: PRIMARY_BLACK }}>
        <SectionTitle title={'ניהול אירועים'} style={{ background: 'none' }} />
        <InnerPageHolder style={{ background: 'black' }} >

            {function eventManageTable() {
                return <table dir={'rtl'} >
                    {function tableHead() {
                        return <thead>
                            <tr>
                                <th>
                                    <div style={tableTitleStyle}>{`שם האירוע`}</div>
                                </th>
                                <th>
                                    <div style={tableTitleStyle}>{'פעולות'}</div>
                                </th>
                            </tr>
                        </thead>

                    }()}

                    {function tableBody() {
                        return <tbody>
                            {location.state && (location.state as any).events && (location.state as { waitingEvents: PNPEvent[], events: PNPEvent[] }).events.map((event: PNPEvent) => <tr key={v4()} style={{ margin: '8px' }}>
                                <th style={{ width: '50%' }}>  <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px', color: SECONDARY_WHITE }}>{event.eventName}</div></th>
                                <th style={{ width: '50%' }}><Button
                                    style={{ border: '.1px solid white', background: 'black', minWidth: 'max-content', paddingLeft: '8px', paddingRight: '8px' }}
                                    onClick={() => { props.nav('/adminpanel/specificevent/eventstatistics', { state: event }) }}
                                    sx={{ ... { width: 'fit-content', fontSize: '14px', margin: '4px', padding: '4px', fontWeight: 'bold', color: PRIMARY_PINK, background: '#007AFF' } }}>
                                    {'ניהול אירוע'}
                                </Button></th>
                            </tr>)}
                        </tbody>
                    }()}
                </table>
            }()}
        </InnerPageHolder>

        <SectionTitle title={'אירועים ממתינים'} style={{ background: 'none' }} />
        <InnerPageHolder style={{ background: 'black' }} >
            {function waitingEventsTable() {
                if (location.state && (location.state as any).waitingEvents && (location.state as any).waitingEvents.length > 0)
                    return (<table dir={'rtl'}>


                        {function tableHead() {
                            return <thead>
                                <tr>
                                    <th>
                                        <div style={{ color: SECONDARY_WHITE }}>{`שם האירוע`}</div>
                                    </th>
                                    <th>
                                        <div style={{ color: SECONDARY_WHITE }}>{'פעולות'}</div>
                                    </th>
                                </tr>
                            </thead>
                        }()}
                        <tbody>
                            {function tableBody() {
                                if (location.state && (location.state as any).waitingEvents)
                                    return (location.state as { waitingEvents: PNPEvent[], events: PNPEvent[] }).waitingEvents.map(event => <tr key={v4()} style={{ margin: '8px' }}>
                                        <th style={{ width: '50%' }}>  <div style={{ fontSize: '12px', margin: '4px', color: SECONDARY_WHITE }}>{event.eventName}</div></th>
                                        <th style={{ width: '50%' }}>
                                            <Stack>
                                                <Button
                                                    onClick={() => {
                                                        openEditDialog(event)
                                                    }}
                                                    style={{ width: '100px', fontSize: '14px', margin: '4px', padding: '4px', color: 'white', background: '#007AFF' }}>
                                                    {'פרטי אירוע'}
                                                </Button>
                                                <Button
                                                    style={{ width: '100px', fontSize: '14px', margin: '4px', padding: '4px', color: 'white', background: '#228B22' }}
                                                    onClick={() => {
                                                        props.loading.doLoad()
                                                        StoreSingleton.get().realTime.approveEvent(event.eventId)
                                                            .then(() => {
                                                                alert('אירוע אושר בהצלחה')
                                                                props.nav('/adminpanel')
                                                                props.loading.cancelLoad()
                                                            }).catch(() => {
                                                                alert('קרתה שגיאה בעת אישור האירוע, אנא פנא אל מתכנת האתר')
                                                                props.loading.cancelLoad()
                                                            })
                                                    }}
                                                >
                                                    {'אשר אירוע'}
                                                </Button>
                                            </Stack>
                                        </th>
                                    </tr>)
                                else return null
                            }()}</tbody>
                    </table>)
                else return <span style={{ color: SECONDARY_WHITE }}>{'אין אירועים ממתינים'}</span>
            }()}
        </InnerPageHolder>
    </PageHolder>
}
export default withHookGroup(AdminEventPanel, CommonHooks)