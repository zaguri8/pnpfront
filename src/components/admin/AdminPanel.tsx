import { Button, Stack, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { v4 } from "uuid"
import { useFirebase } from "../../context/Firebase"
import { useHeaderBackgroundExtension } from "../../context/HeaderContext"
import { useLoading } from "../../context/Loading"
import { PNPPage } from "../../cookies/types"
import { BLACK_ELEGANT, BLACK_ROYAL, DARKER_BLACK_SELECTED, DARK_BLACK, PRIMARY_BLACK, RED_ROYAL, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors"
import { flex, textFieldStyle } from "../../settings/styles"
import { getEventTypeFromString } from "../../store/external/converters"
import { PNPEvent, UserEnterStatistics } from "../../store/external/types"
import { getCurrentDate } from "../../utilities"
import SectionTitle from "../SectionTitle"
import { dateStringFromDate, hyphenToMinus, reverseDate, unReverseDate } from "../utilities/functions"
import { InnerPageHolder, PageHolder } from "../utilities/Holders"
import Spacer from "../utilities/Spacer"
import PNPChart from "./PNPChart"


export default function AdminPanel() {
    const [publicEvents, setPublicEvents] = useState<{ [type: string]: { waiting: PNPEvent[], events: PNPEvent[] } }>()
    const [waitingEvents, setWaitingEvents] = useState<PNPEvent[]>()
    const [userStatistics, setUserStatistics] = useState<UserEnterStatistics>()
    const { firebase } = useFirebase()
    const nav = useNavigate()
    const { doLoad, cancelLoad } = useLoading()
    // const useStyles = makeStyles(() => textFieldStyle(SECONDARY_WHITE))
    // const classes = useStyles()

    const [selectedDate, setSelectedDate] = useState<string>(dateStringFromDate(getCurrentDate()))
    const { hideHeader, showHeader } = useHeaderBackgroundExtension()
    useEffect(() => {
        hideHeader()
        return () => showHeader()
    }, [])
    useEffect(() => {
        doLoad()
        const unsubStats = firebase.realTime.addListenerToUserStatistics(setUserStatistics)
        const unsub = firebase.realTime.addListenerToPublicEvents((publicEv) => {

            const newHash: { [type: string]: { waiting: PNPEvent[], events: PNPEvent[] } } = {}

            Object.entries(publicEv).forEach(entry => {
                if (entry[0] === 'waiting') {
                    entry[1].forEach(waitingEvent => {
                        if (!newHash[waitingEvent.eventType!]) {
                            newHash[waitingEvent.eventType!] = { waiting: [waitingEvent], events: [] }
                        } else {
                            newHash[waitingEvent.eventType!].waiting.push(waitingEvent)
                        }
                    })
                } else {
                    if (!newHash[entry[0]]) {
                        newHash[entry[0]] = { waiting: [], events: entry[1] }
                    } else {
                        newHash[entry[0]].events.push(...entry[1])
                    }
                }
            })
            setPublicEvents(newHash)
            cancelLoad()
        }, true)

        return () => {
            unsubStats()
            unsub()
        }
    }, [])




    function AdminPanelNavButton(props: { page: string, path: string }) {
        return <React.Fragment>
            <SectionTitle title={props.page} style={{ background: 'none' }} />
            <InnerPageHolder style={{ background: BLACK_ELEGANT, borderRadius: '8px' }}>
                <Button
                    style={{ border: '.1px solid white', fontWeight: 'bold', background: BLACK_ELEGANT, minWidth: '110px' }}
                    onClick={() => { nav(props.path) }}
                    sx={{
                        ... {
                            width: 'fit-content',
                            fontSize: '14px',
                            maxHeight: '40px',
                            fontFamily: 'Open Sans Hebrew',
                            margin: '4px',
                            padding: '12px',
                            color: 'white',
                            background: '#007AFF'
                        }
                    }}>
                    {`עבור ל${props.page}`}
                </Button>
            </InnerPageHolder>
        </React.Fragment>
    }


    const Attendaces = () => {
        if (!userStatistics)
            return <span dir={'rtl'} style={{ fontWeight: 'bold', color: SECONDARY_WHITE }}>{'טוען נתונים..'}</span>;
        const selectedStat = userStatistics.stats.find(stat => stat.date === hyphenToMinus(selectedDate))
        if (selectedStat === undefined)
            return <span dir={'rtl'} style={{
                padding: '4px',
                fontWeight: 'bold', color: SECONDARY_WHITE
            }}>{'אין נתונים לתאריך זה'}</span>

        const labelStyle = { margin: '0px', color: SECONDARY_WHITE }
        const spanStyle = { color: SECONDARY_WHITE, fontWeight: 'bold' }
        return <Stack spacing={1} marginTop={'16px'}>

            <Stack padding='4px'>
                <label style={labelStyle}>{'מציג נתונים לתאריך'}</label>
                <span style={spanStyle}>{selectedStat.date}</span>
            </Stack>
            <Stack padding={'4px'}>
                <label style={labelStyle}>{'כניסות ממכשירים שונים'}</label>
                <span style={spanStyle}>{selectedStat.numberOfUserAttended}</span>
            </Stack>
        </Stack>
    }



    return <PageHolder style={{ background: PRIMARY_BLACK, overflowX: 'hidden' }} >
        <SectionTitle title={'ניהול קטגוריות'} style={{ background: 'none' }} />
        <InnerPageHolder style={{ background: BLACK_ELEGANT, borderRadius: '8px', overflowX: 'hidden' }} >

            {function categoryManagerTable() {
                return <table dir={'rtl'} >
                    {function tableHead() {
                        return <thead>
                            <tr>
                                <th>
                                    <div style={{ fontSize: '20px', color: SECONDARY_WHITE }}>{`קטגורייה`}</div>
                                </th>
                                <th>
                                    <div style={{ fontSize: '20px', color: SECONDARY_WHITE }}>{'פעולות'}</div>
                                </th>
                            </tr>
                        </thead>
                    }()}

                    {function tableBody() {
                        return <tbody>
                            {publicEvents && Object.entries(publicEvents).map(entry => <tr key={v4()} style={{ margin: '8px' }}>
                                <th style={{ width: '50%' }}>  <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px', color: SECONDARY_WHITE }}>{getEventTypeFromString(entry[0])}</div></th>
                                <th style={{ width: '50%' }}><Button
                                    style={{ backgroundImage: BLACK_ELEGANT, border: '.1px solid white', minWidth: '110px' }}
                                    onClick={() => { nav('/adminpanel/specificevent', { state: { waitingEvents: entry[1].waiting, events: entry[1].events } }) }}
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
                                    {'ניהול אירועים'}
                                </Button></th>
                            </tr>)}
                        </tbody>
                    }()}
                </table>
            }()}

        </InnerPageHolder>
        {function invitationManagerSection() {
            return <AdminPanelNavButton page='ניהול הזמנות' path='/adminpanel/invitations' />
        }()}

        {function userManagerSection() {
            return <AdminPanelNavButton page='ניהול משתמשים' path='/adminpanel/users' />
        }()}

        {function websiteEditorSection() {
            return <AdminPanelNavButton page='עריכת אתר' path='/adminpanel/editweb' />
        }()}


        {function trafficManagerSection() {
            return <React.Fragment><SectionTitle title={'נתוני כניסה'} style={{ background: 'none' }} />
                <InnerPageHolder style={{ background: 'rgb(0,0,0,0.5)', overflowX: 'hidden' }}>
                    <label style={
                        {
                            fontWeight: 'bold',
                            color: SECONDARY_WHITE
                        }
                    }>{'נתוני כניסה לפי תאריך'}</label>

                    <Spacer offset={1} />
                    <input
                        min={new Date('2022-04-29').toJSON().split('T')[0]}
                        value={unReverseDate(selectedDate)}
                        onChange={(e) => {
                            let reverse = reverseDate(e.target.value)
                            setSelectedDate(reverse)
                        }}
                        type='date' />
                    <Attendaces />

                    <br />
                    <label style={
                        {
                            fontWeight: 'bold',
                            color: SECONDARY_WHITE
                        }
                    }>{'נתוני דף הרשמה'}</label>

                    <PNPChart page={PNPPage.register} date={selectedDate} />
                </InnerPageHolder>

            </React.Fragment>
        }()}


    </PageHolder >

}