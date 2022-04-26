
import { PNPEvent } from "../../store/external/types"
import { Button, Stack } from '@mui/material'
import { SECONDARY_WHITE, DARKER_BLACK_SELECTED, ORANGE_GRADIENT_PRIMARY, SECONDARY_BLACK, BLACK_ELEGANT, BLACK_ROYAL } from "../../settings/colors"
import { useNavigate } from "react-router"
import HTMLFromText from '../utilities/HtmlFromText'
import { v4 } from 'uuid'
import SectionTitle from '../SectionTitle'
import { useLocation } from 'react-router-dom'
import { PageHolder, InnerPageHolder } from '../utilities/Holders'
import { useLoading } from "../../context/Loading"
import { useFirebase } from "../../context/Firebase"
const AdminEventPanel = () => {

    const location = useLocation()
    const { openDialog, doLoad, cancelLoad } = useLoading()
    const { firebase } = useFirebase()

    const nav = useNavigate()
    return <PageHolder style={{ background: BLACK_ELEGANT }}>
        <SectionTitle title={'ניהול אירועים'} style={{ background: 'none' }} />
        <InnerPageHolder style={{ background: BLACK_ROYAL }} >

            <table dir={'rtl'} >

                <thead>
                    <tr>
                        <th>
                            <div style={{ color: SECONDARY_WHITE }}>{`שם האירוע`}</div>
                        </th>
                        <th>
                            <div style={{ color: SECONDARY_WHITE }}>{'פעולות'}</div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {location.state && (location.state as any).events && (location.state as { waitingEvents: PNPEvent[], events: PNPEvent[] }).events.map((event: PNPEvent) => <tr key={v4()} style={{ margin: '8px' }}>
                        <th style={{ width: '50%' }}>  <div style={{ fontSize: '12px', margin: '4px', color: SECONDARY_WHITE }}>{event.eventName}</div></th>
                        <th style={{ width: '50%' }}><Button
                            style={{ backgroundImage: DARKER_BLACK_SELECTED, minWidth: '110px' }}
                            onClick={() => { nav('/adminpanel/specificevent/eventstatistics', { state: event }) }}
                            sx={{ ... { width: 'fit-content', fontSize: '14px', margin: '4px', padding: '4px', color: 'white', background: '#007AFF' } }}>
                            {'עבור לניהול אירוע'}
                        </Button></th>
                    </tr>)}
                </tbody>
            </table>
        </InnerPageHolder>

        <SectionTitle title={'אירועים ממתינים'} style={{ background: 'none' }} />
        <InnerPageHolder style={{ background: BLACK_ROYAL }} >

            {location.state && (location.state as any).waitingEvents && (location.state as any).waitingEvents.length > 0 ? <table dir={'rtl'}>

                <thead>
                    <tr>
                        <th>
                            <div style={{ color: SECONDARY_WHITE }}>{`שם האירוע`}</div>
                        </th>
                        <th>
                            <div style={{ color: SECONDARY_WHITE }}>{'פעולות'}</div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {location.state && (location.state as any).waitingEvents && (location.state as { waitingEvents: PNPEvent[], events: PNPEvent[] }).waitingEvents.map(event => <tr key={v4()} style={{ margin: '8px' }}>
                        <th style={{ width: '50%' }}>  <div style={{ fontSize: '12px', margin: '4px', color: SECONDARY_WHITE }}>{event.eventName}</div></th>
                        <th style={{ width: '50%' }}>
                            <Stack>
                                <Button
                                    onClick={() => {


                                        openDialog({
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
                                    }}
                                    style={{ width: 'fit-content', fontSize: '14px', margin: '4px', padding: '4px', color: 'white', background: '#007AFF' }}>
                                    {'פרטי אירוע'}
                                </Button>
                                <Button
                                    style={{ width: 'fit-content', fontSize: '14px', margin: '4px', padding: '4px', color: 'white', background: '#228B22' }}
                                    onClick={() => {
                                        doLoad()
                                        firebase.realTime.approveEvent(event.eventId)
                                            .then(() => {
                                                alert('אירוע אושר בהצלחה')
                                                nav('/adminpanel')
                                                cancelLoad()
                                            }).catch(() => {
                                                alert('קרתה שגיאה בעת אישור האירוע, אנא פנא אל מתכנת האתר')
                                                cancelLoad()
                                            })
                                    }}
                                >
                                    {'אשר אירוע'}
                                </Button>
                            </Stack>
                        </th>
                    </tr>)}
                </tbody>
            </table> : <span style={{ color: SECONDARY_WHITE }}>{'אין אירועים ממתינים'}</span>}
        </InnerPageHolder>
    </PageHolder>
}
export default AdminEventPanel