
import { PNPEvent } from "../../store/external/types"
import { Button, Stack } from '@mui/material'
import { SECONDARY_WHITE, DARKER_BLACK_SELECTED, ORANGE_GRADIENT_PRIMARY, SECONDARY_BLACK, BLACK_ELEGANT, BLACK_ROYAL, RED_ROYAL, PRIMARY_BLACK } from "../../settings/colors"
import { useNavigate } from "react-router"
import HTMLFromText from '../utilityComponents/HtmlFromText'
import { v4 } from 'uuid'
import SectionTitle from "../other/SectionTitle"
import { useLocation } from 'react-router-dom'
import { PNPPrivateEvent } from '../../store/external/types'
import { PageHolder, InnerPageHolder } from '../utilityComponents/Holders'
import { useLoading } from "../../context/Loading"
import { useUser } from "../../context/Firebase"
import { CSSProperties, useEffect, useState } from "react"
import Spacer from "../utilityComponents/Spacer"
import { useHeaderBackgroundExtension } from "../../context/HeaderContext"
import { Hooks } from "../generics/types"
import { CommonHooks, withHookGroup } from "../generics/withHooks"
import { StoreSingleton } from "../../store/external"
const ManageInvitations = (props: Hooks) => {
    const [privateEvents, setPrivateEvents] = useState<{ [type: string]: PNPPrivateEvent[] }>()
    useEffect(() => {
        props.headerExt.hideHeader()
        return () => props.headerExt.showHeader()
    },[])
    const rowStyle = {
        flexDirection: 'row',
        display: 'flex',
        columnGap:'16px',
        marginLeft: 'auto',
        background:'none',
        marginRight: 'auto'
    } as CSSProperties

    const tHeadStyle = {
        textAlign:'center',
        alignSel:'center',
    } as CSSProperties
    useEffect(() => {
        const unsub = StoreSingleton.get().realTime.addListenerToPrivateEvents(setPrivateEvents, true)
        return () => { unsub() }
    }, [])
    return <PageHolder style={{ background: PRIMARY_BLACK }}>
        <SectionTitle title={'ניהול אירועים עם הזמנות'} style={{ background: 'none' }} />
        <InnerPageHolder style={{ background: BLACK_ELEGANT }} >

            <table dir={'rtl'}>

                <thead>
                    <tr>
                        <th>
                            <div style={{ color: SECONDARY_WHITE, fontSize: '20px' }}>{`אירוע`}</div>
                        </th>
                        <th >
                            <div style={{ color: SECONDARY_WHITE, fontSize: '20px' }}>{'פעולות'}</div>
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
                            onClick={() => { props.nav('/adminpanel/invitations/specificinvitation', { state: event }) }}
                            sx={{
                                ... {
                                    width: 'fit-content',
                                    fontSize: '14px',
                                    margin: '4px',
                                    fontFamily: 'Open Sans Hebrew',
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

                <thead >
                    <tr  style={rowStyle}>
                        <th style ={tHeadStyle}>
                            <div style={{ color: SECONDARY_WHITE, fontSize: '20px' }}>{`אירוע`}</div>
                        </th>
                        <th style ={tHeadStyle}>
                            <div style={{ color: SECONDARY_WHITE, fontSize: '20px' }}>{'פעולות'}</div>
                        </th>
                    </tr>
                </thead>

                <tbody style= {{background:'none'}}>
                    {privateEvents && privateEvents['waiting'] && privateEvents['waiting'].length > 0 ? privateEvents['waiting'].map(event => <tr
                        style={rowStyle}
                        key={v4()}>
                        <th style={{ display: 'flex',color:SECONDARY_WHITE, alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>  <div style={{ fontSize: '12px', color: SECONDARY_WHITE }}>{event.eventTitle}</div><br /></th>
                        <th style={{ display: 'flex',color:SECONDARY_WHITE, alignItems: 'center', borderRadius: '8px' }}>
                            <Stack>
                                <Button
                                    onClick={() => {


                                        props.loading.openDialog({
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
                                        props.loading.doLoad()
                                        StoreSingleton.get().realTime.approvePrivateEvent(event.eventId)
                                            .then(() => {
                                                alert('האירוע אושר בהצלחה')
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
                                <Spacer offset={1} />
                            </Stack>
                        </th>
                    </tr>) : null}
                </tbody>
            </table> : <span style={{ color: SECONDARY_WHITE }}>{'אין אירועים ממתינים'}</span>}
        </InnerPageHolder>
    </PageHolder>
}
export default withHookGroup(ManageInvitations,CommonHooks)