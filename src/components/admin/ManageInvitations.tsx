
import { PNPEvent } from "../../store/external/types"
import { Button, Stack } from '@mui/material'
import { SECONDARY_WHITE, DARKER_BLACK_SELECTED, ORANGE_GRADIENT_PRIMARY, SECONDARY_BLACK, BLACK_ELEGANT, BLACK_ROYAL, RED_ROYAL, PRIMARY_BLACK } from "../../settings/colors"
import { useNavigate } from "react-router"
import HTMLFromText from '../utilities/HtmlFromText'
import { v4 } from 'uuid'
import SectionTitle from '../SectionTitle'
import { useLocation } from 'react-router-dom'
import { PNPPrivateEvent } from '../../store/external/types'
import { PageHolder, InnerPageHolder } from '../utilities/Holders'
import { useLoading } from "../../context/Loading"
import { useFirebase } from "../../context/Firebase"
import { useEffect, useState } from "react"
import Spacer from "../utilities/Spacer"
const ManageInvitations = () => {


    const { openDialog, doLoad, cancelLoad } = useLoading()
    const { firebase } = useFirebase()

    const [privateEvents, setPrivateEvents] = useState<{ [type: string]: PNPPrivateEvent[] }>()
    const nav = useNavigate()

    useEffect(() => {
        const unsub = firebase.realTime.addListenerToPrivateEvents(setPrivateEvents, true)
        return () => { unsub() }
    }, [])
    return <PageHolder style={{ background: PRIMARY_BLACK }}>
        <SectionTitle title={'ניהול אירועים עם הזמנות'} style={{ background: 'none' }} />
        <InnerPageHolder style={{ background: BLACK_ELEGANT }} >

            <table dir={'rtl'}>

                <thead>
                    <tr>
                        <th>
                            <div style={{ color: SECONDARY_WHITE,fontSize:'20px'  }}>{`אירוע`}</div>
                        </th>
                        <th>
                            <div style={{ color: SECONDARY_WHITE,fontSize:'20px'  }}>{'פעולות'}</div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {privateEvents && privateEvents['approved'] && privateEvents['approved'].map((event: PNPPrivateEvent) => <tr key={v4()} style={{ margin: '8px' }}>
                        <th style={{ width: '50%' }}>  <div style={{
                            fontSize: '16px',
                            margin: '4px',
                            color: SECONDARY_WHITE
                        }}>{event.eventTitle}
                        </div></th>
                        <th style={{ width: '50%' }}><Button
                            style={{ backgroundImage: BLACK_ELEGANT, minWidth: '110px' }}
                            onClick={() => { nav('/adminpanel/invitations/specificinvitation', { state: event }) }}
                            sx={{
                                ... {
                                    width: 'fit-content',
                                    fontSize: '14px',
                                    margin: '4px',
                                    fontFamily:'Open Sans Hebrew',
                                    padding: '4px',
                                    color: 'white',
                                    background: '#007AFF'
                                }
                            }}>
                            {'עבור לניהול'}
                        </Button></th>
                    </tr>)}
                </tbody>
            </table>
        </InnerPageHolder>

        <SectionTitle title={'אירועים ממתינים'} style={{ background: 'none' }} />
        <InnerPageHolder style={{ background: BLACK_ELEGANT }} >

            {privateEvents && privateEvents['waiting'] && privateEvents['waiting'].length > 0 ? <table dir={'rtl'}>

                <thead>
                    <tr>
                        <th>
                            <div style={{ color: SECONDARY_WHITE,fontSize:'20px' }}>{`אירוע`}</div>
                        </th>
                        <th>
                            <div style={{ color: SECONDARY_WHITE ,fontSize:'20px' }}>{'פעולות'}</div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {privateEvents && privateEvents['waiting'] && privateEvents['waiting'].length > 0 ? privateEvents['waiting'].map(event => <tr
                        key={v4()}>
                        <th style={{ width: '50%',display:'flex',alignItems:'center',justifyContent:'center', background: SECONDARY_WHITE,borderRadius:'8px' }}>  <div style={{ fontSize: '12px', color: PRIMARY_BLACK }}>{event.eventTitle}</div><br /></th>
                        <th style={{ width: '50%',display:'flex',alignItems:'center',justifyContent:'center', background: SECONDARY_WHITE ,borderRadius:'8px' }}>
                            <Stack>
                                <Button
                                    onClick={() => {


                                        openDialog({
                                            content: <InnerPageHolder style={{ padding: '8px', margin: '8px', background: SECONDARY_BLACK }}>
                                                <Stack spacing={2} style={{ padding: '8px', color: SECONDARY_WHITE, width: '100%' }}>

                                                    <Stack>
                                                        <label style={{ fontWeight: 'bold' }}>{'שם אירוע'}</label>
                                                        <span>{event.eventTitle}</span>
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
                                    style={{ fontSize: '14px', margin: '4px', width: '100px', padding: '4px', color: 'white', background: '#007AFF' }}>
                                    {'פרטי אירוע'}
                                </Button>
                                <Button
                                    style={{ fontSize: '14px', width: '100px', margin: '4px', padding: '4px', color: 'white', background: '#228B22' }}
                                    onClick={() => {
                                        doLoad()
                                        firebase.realTime.approvePrivateEvent(event.eventId)
                                            .then(() => {
                                                alert('האירוע אושר בהצלחה')
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
                                <Spacer offset={1} />
                            </Stack>
                        </th>
                    </tr>) : null}
                </tbody>
            </table> : <span style={{ color: SECONDARY_WHITE }}>{'אין אירועים ממתינים'}</span>}
        </InnerPageHolder>
    </PageHolder>
}
export default ManageInvitations