import { Button, Stack } from '@mui/material'
import React, { CSSProperties, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { v4 } from 'uuid'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { PRIMARY_PINK, PRIMARY_WHITE, SECONDARY_WHITE } from '../../../settings/colors'
import { submitButton } from '../../../settings/styles'
import { StoreSingleton } from '../../../store/external'
import { PNPCompany, PNPCompanyRideConfirmation, PNPWorkersRide } from '../../../store/external/types'
import { CompanyConfirmationsMapping, CompanyDateConfirmations } from '../../../store/external/types_2'
import { getDateString, getDateStringShort } from '../../../utilities'
import PNPList from '../../generics/PNPList'
import { Hooks } from '../../generics/types'
import { withHook, withHookGroup, withHooks } from '../../generics/withHooks'
import { getDayLetter, getDayName, getMonthName } from '../../invitation/invitationsWorkerHelper'
import { CalendarControlsStyle, CalendarShowingWeekStyle, ControlStyle } from '../../invitation/InvitationUIProver'
import SectionTitle from '../../other/SectionTitle'
import { InnerPageHolder, PageHolder } from '../../utilityComponents/Holders'
import LoadingIndicator from '../../utilityComponents/LoadingIndicator'
import Spacer from '../../utilityComponents/Spacer'
import AddUpdateCompanyRide from '../AddUpdateCompanyRide'
import AddUpdateEventRide from '../AddUpdateEventRide'
import { ButtonStyle, HeaderStyle, ParagraphStyle, SmallTextStyle, SubHeaderStyle, SubListStyle } from '../EventStatistics'
import './InvitationWorkersManager.css'
import moment from 'moment';
import styled from '@emotion/styled';

const ControlStyleButton = {
    ...submitButton(), width: '80%',
    maxWidth: '250px',
    height: 'fit-content',
    marginBlock: '4px',
    padding: '8px',
    textTransform: 'none'
} as CSSProperties
const InnerPageStyle = {
    background: 'none'
} as CSSProperties
const ConfirmationRow = ({ confirmation }: { confirmation: PNPCompanyRideConfirmation }) => {
    return <Stack direction={'row'}
        key={v4()}
        width={'100%'}
        style={{ padding: '2px' }}
        justifyContent={'space-around'}>
        <p style={{ ...ParagraphStyle, fontSize: '16px', textAlign: 'left', minWidth: 'fit-content' }}>
            {`${confirmation.userName} `}
        </p>
        <div style={{ ...ConfirmationTitleStyle2, minWidth: 'fit-content' }}>{toDate(confirmation)}</div>
    </Stack>
}
type ConfirmationRow = { ride: string, confirmations: CompanyDateConfirmations[] }
const toConfirmationRow = (confirmation: PNPCompanyRideConfirmation) => <ConfirmationRow key={v4()} confirmation={confirmation} />
const ConfirmationRideTitleStyle = {
    ...HeaderStyle,
    textAlign: 'start',
    fontSize: '18px',
    padding: '4px',
    paddingRight: '0px'
} as CSSProperties
const ConfirmationTitleStyle1 = { ...SubHeaderStyle } as CSSProperties
const ConfirmationTitleStyle2 = { ...SmallTextStyle, fontWeight: 'bold', fontSize: '14px', color: PRIMARY_WHITE } as CSSProperties
const ConfirmationListStyle = {
    overflowY: 'scroll',
    maxHeight: '150px'
} as CSSProperties
const ConfirmationStackStyle = { marginBlock: '4px', padding: '4px' } as CSSProperties
const ConfirmationListStackStyle = { marginInline: 'center', padding: '8px', maxWidth: '650px', width: '100%', alignSelf: 'center' } as CSSProperties

type WeekMapping = {
    [year: number]:
    { [month: number]: PNPCompanyRideConfirmation[] }
}

const toDate = (confirmationMapping: { date: string }) => {
    const d = confirmationMapping.date.split('/')
    const day = Number(d[0])
    const month = Number(d[1]) - 1
    const year = Number(d[2])
    const date = new Date(year, month, day)
    return getDateStringShort(date, true) + " יום " + getDayLetter(date.getDay())
}
const toDateObject = (confirmationMapping: { date: string }) => {
    const d = confirmationMapping.date.split('/')
    const day = Number(d[0])
    const month = Number(d[1]) - 1
    const year = Number(d[2])
    const date = new Date(year, month, day)
    return date
}
const ConfirmationsComponent = ({ ride, confirmations }: ConfirmationRow) => {
    const findCorrectDate = (someDateString: string) => {
        let date = toDateObject({ date: someDateString })
        return date.getDay() + 1
    }
    const weekForwards = () => {
        setWeek(w => Math.min(w + 1, organizedByWeeks.length - 1))
    }
    const weekBackwards = () => {
        setWeek(w => Math.max(w - 1, 0))
    }

    const organizedByWeeks = useMemo(() => {
        const ret = confirmations.reduce((a, b) => {
            const d2 = moment(b.date, "DD/MM/YYYY")
            let added = false
            for (let ax of a) {
                if (ax.confs.length > 0) {
                    const d1 = moment(ax.confs[0].date, "DD/MM/YYYY");
                    if (d1.isSame(d2, 'week')) {
                        added = true
                        ax.confs.push(...b.confirmations)
                        break;
                    }
                }
            }
            if (!added) {
                console.log(b.date)
                a.push({ date: moment(b.date, 'DD/MM/YYYY'), confs: b.confirmations })
            }
            return a;
        }, [] as {
            date: moment.Moment,
            confs: PNPCompanyRideConfirmation[]
        }[])

        // ret.forEach(x => {
        //     x.confs.sort((a, b) => {
        //         let d1 = moment(a.date, "DD/MM/YY")
        //         let d2 = moment(b.date, 'DD/MM/YY')
        //         return d1.isBefore(d2) ? -1 : d2.isBefore(d1) ? 1 : 0
        //     })

        // })
        ret.forEach((a: any) => {
            let map = {} as any
            a.confs.forEach((conf: PNPCompanyRideConfirmation) => {
                let y = conf.date.split('/')
                conf.date = y[0] + "/" + y[1] + "/" + y[2].slice(-2);
                if (map[conf.date]) {
                    map[conf.date].confs.push(conf)
                } else {
                    map[conf.date] = { confs: [conf], weekDay: getDayLetter(findCorrectDate(conf.date)) }
                }
            })

            a.dayMap = map
        })
        return ret as {
            date: moment.Moment, confs: PNPCompanyRideConfirmation[],
            dayMap: { [id: string]: { confs: PNPCompanyRideConfirmation[], weekDay: string }[] }
        }[]
    }, [])

    const getDay = (c: PNPCompanyRideConfirmation) => Number(c.date.split('/')[0])
    const [week, setWeek] = useState(0)
    const TableLabel = styled.label<{ size: number }>`
        color:white;
        padding:0px;
        font-size:${x => x.size + "px"};
    `
    const RideControls = useMemo(() => <React.Fragment>
        <Stack direction={'row'} justifyContent={'space-between'} style={CalendarControlsStyle}>
            <ArrowBackIosIcon style={ControlStyle} onClick={weekForwards} />
            <div style={CalendarShowingWeekStyle}>שבוע {week + 1}</div>
            <ArrowForwardIosIcon style={ControlStyle} onClick={weekBackwards} />
        </Stack>
        <Spacer offset={1} />
    </React.Fragment>, [ride, week])

    const RideDaysConfirmations = useMemo(() => <Stack spacing={1}>
        {React.Children.toArray(Object.entries(organizedByWeeks[week].dayMap).map((entry: any) => {
            return <Stack direction={'row'} style={{ direction: 'rtl', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '4px' }} justifyContent={'space-around'}>
                <TableLabel size={20} style={{ fontWeight: 'bold' }}>יום {entry[1].weekDay}</TableLabel>
                <TableLabel size={20} >{entry[0]}</TableLabel>
                <TableLabel size={20}>נוסעים: <b style={{ fontSize: '20px' }}>{entry[1].confs.length}</b></TableLabel>
            </Stack>
        }))}
    </Stack>, [organizedByWeeks,week])
    return <Stack style={ConfirmationListStackStyle}>
        {RideControls}
        <span style={{ ...ConfirmationRideTitleStyle }}>{ride}</span>
        <Stack key={v4()} style={ConfirmationStackStyle}>
            <Stack style={{ ...SubListStyle, padding: '16px', maxHeight: '400px', overflowY: 'scroll' }}>
                <label style={{ ...ConfirmationTitleStyle2, fontSize: '24px' }}>{'סה"כ נוסעים: '} {organizedByWeeks.length > 0 ? organizedByWeeks[week].confs.length : 0}</label>
                <br />
                {RideDaysConfirmations}
            </Stack>
        </Stack>
    </Stack>
}

enum ShowingCompanyManagerPage {
    Confirmations = "confs",
    AddRide = "add"
}

const RideManageRow = withHookGroup<{ ride: PNPWorkersRide }>(({ ride, loading }: Hooks & { ride: PNPWorkersRide }) => {

    const deleteRide = async () => {
        loading.doLoad()
        const res = await StoreSingleton.get()
            .realTime.removeWorkersRide(ride.companyId, ride.id)
        loading.cancelLoad()
        alert('נסיעה נמחקה בהצלחה')
    }
    return <Stack>
        <label style={{ color: SECONDARY_WHITE, fontWeight: 'bold' }}>{ride.startPoint}</label>
        <Button
            onClick={deleteRide}
            style={{
                background: PRIMARY_PINK,
                color: SECONDARY_WHITE,
                marginInline: 'auto',
                maxWidth: '200px',
                minWidth: '200px'
            }}>מחק הסעה</Button>
    </Stack>
}, ['loading'])
const CompanyRidesManagementScreen = ({ cid }: { cid: string }) => {
    const [rides, setRides] = useState<PNPWorkersRide[]>([])

    useEffect(() => {
        const unsub = StoreSingleton.get().realTime.getCompanyRidesById(cid, setRides)
        return () => unsub()
    })

    return <Stack spacing={2}>
        {React.Children.toArray(rides.map(ride => <RideManageRow ride={ride} />))}
    </Stack>
}
export default withHookGroup((hooks: Hooks) => {
    const [confirmationMapping, setConfirmationMapping] = useState<CompanyConfirmationsMapping | undefined>()
    const [company, setCompany] = useState<PNPCompany | undefined>()
    const [showingPage, setShowingPage] = useState<ShowingCompanyManagerPage>(ShowingCompanyManagerPage.Confirmations)
    const { id } = useParams()

    useEffect(() => {
        if (!company) return
        const unsub = StoreSingleton.get().realTime.addListenerToCompanyConfirmations(company.id, setConfirmationMapping)
        return () => unsub()
    }, [company])
    useEffect(() => hooks.headerExt.hideHeader(), [])
    useEffect(() => {
        if (!id) return
        const unsub = StoreSingleton.get().realTime.getPrivateCompanyById(id, setCompany)
        return () => unsub()
    }, [])


    const ConfirmationList = useCallback(() => {
        if (!confirmationMapping) return null
        const List = React.Children.toArray(Object.entries(confirmationMapping).map(([k, v]) => <ConfirmationsComponent
            ride={k} confirmations={v} />))
        return <React.Fragment>
            {List}
        </React.Fragment>
    }, [confirmationMapping])


    const AddRideAction = useCallback(() => {
        if (!company) return null
        hooks.loading.openDialog({
            content: <div style={{ padding: '16px' }}>
                <h3 style={{
                    fontWeight: '14px',
                    color: PRIMARY_PINK,
                    padding: '4px',
                    textAlign: 'center'
                }}>{`הוסף הסעה ל ${company.name}`}</h3>
                <AddUpdateCompanyRide company={company} />
            </div>
        })
    }, [company])
    const ToggleScreen = () => {
        setShowingPage(showingPage === ShowingCompanyManagerPage.Confirmations ? ShowingCompanyManagerPage.AddRide : ShowingCompanyManagerPage.Confirmations)
    }
    const ShowingPage = useCallback(() => {
        switch (showingPage) {
            case ShowingCompanyManagerPage.Confirmations:
                return <Stack>{<ConfirmationList />}</Stack>
            case ShowingCompanyManagerPage.AddRide:
                return company ? <CompanyRidesManagementScreen cid={company.id} /> : null
            default:
                return null
        }
    }, [showingPage, confirmationMapping])

    if (!company)
        return <LoadingIndicator />
    if (!confirmationMapping)
        return <LoadingIndicator />

    return <PageHolder>
        <SectionTitle title={company.name} style={{ marginBlock: '16px' }} />
        <Stack style={{ width: '80%', marginInline: 'auto', alignSelf: 'center' }}>
            <ShowingPage />
            <Spacer offset={1} />
            <Button onClick={AddRideAction} style={ControlStyleButton}>{'הוסף נקודת יציאה'}</Button>
            <Button onClick={ToggleScreen} style={ControlStyleButton}>{showingPage === ShowingCompanyManagerPage.AddRide ? 'הצג נוסעים' : 'נהל תחנות'}</Button>
        </Stack>

    </PageHolder>
}, ['loading', 'nav', 'headerExt'])