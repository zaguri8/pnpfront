import { Button, Stack } from '@mui/material'
import React, { CSSProperties, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { v4 } from 'uuid'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { PRIMARY_PINK, PRIMARY_WHITE } from '../../../settings/colors'
import { submitButton } from '../../../settings/styles'
import { StoreSingleton } from '../../../store/external'
import { PNPCompany, PNPCompanyRideConfirmation } from '../../../store/external/types'
import { CompanyConfirmationsMapping, CompanyDateConfirmations } from '../../../store/external/types_2'
import { getDateString, getDateStringShort } from '../../../utilities'
import PNPList from '../../generics/PNPList'
import { Hooks } from '../../generics/types'
import { withHookGroup } from '../../generics/withHooks'
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
const ConfirmationsComponent = ({ ride,
    confirmations, showingMonthYear }: ConfirmationRow & {
        showingMonthYear: [number, number]
    }) => {

    const organizedByWeeks = useMemo(() => {
        let byMonth = {} as WeekMapping
        for (let confirmation of confirmations) {
            const year = Number(confirmation.date.split('-')[2])
            const month = Number(confirmation.date.split('-')[1])
            if (!byMonth[year])
                byMonth[year] = {}
            byMonth[year][month] = byMonth[year][month] ? [...byMonth[year][month], ...confirmation.confirmations] : confirmation.confirmations
        }
        return byMonth
    }, [])

    const getConfirmationsAmount = () => {
        if (!organizedByWeeks[showingMonthYear[0]]) return 0
        if (!organizedByWeeks[showingMonthYear[0]][showingMonthYear[1]]) return 0
        return organizedByWeeks[showingMonthYear[0]][showingMonthYear[1]].length
    }
    const confirmationsForShowingMonth = useMemo(() => organizedByWeeks[showingMonthYear[0]] ? organizedByWeeks[showingMonthYear[0]][showingMonthYear[1]] ?? [] : [], [showingMonthYear])
    const getDay = (c: PNPCompanyRideConfirmation) => Number(c.date.split('/')[0])
    const confirmationsDevidedToWeeks = useMemo(() => {
        let array: PNPCompanyRideConfirmation[][] = []
        confirmationsForShowingMonth.forEach(conf => {
            const day = getDay(conf)
            let metReq = true;
            let i = 0;
            let j = 0;
            for (; i < array.length; i++) {
                for (let el of array[i]) {
                    if (Math.abs(getDay(el) - day) >= 6) {
                        metReq = false
                        j++;
                        array[j] = [conf]
                        break;
                    }
                }
            }
            if (metReq)
                if (!array[j]) array[j] = [conf]
                else array[j].push(conf)
        })
        return array
    }, [confirmationsForShowingMonth])
    return <Stack style={ConfirmationListStackStyle}>
        <span style={{ ...ConfirmationRideTitleStyle }}>{ride}</span>

        <Stack key={v4()} style={ConfirmationStackStyle}>
            <Stack style={{ ...SubListStyle, padding: '16px', maxHeight: '400px', overflowY: 'scroll' }}>
                <label style={{ ...ConfirmationTitleStyle2, fontSize: '24px' }}>{getConfirmationsAmount()} {'אישורים'}</label>
                <Stack spacing={1}>
                    {React.Children.toArray(confirmationsDevidedToWeeks.map((weekDays, index) =>
                        <Stack>
                            <label style={{ ...ConfirmationTitleStyle2, textAlign: 'center' }}>{"שבוע " + getDayLetter(index + 1)}</label>
                            <PNPList<PNPCompanyRideConfirmation>
                                items={weekDays}
                                ElementWrapper={Stack}
                                renderRow={toConfirmationRow} />
                        </Stack>))}
                </Stack>
            </Stack>
        </Stack>
    </Stack>
}

enum ShowingCompanyManagerPage {
    Confirmations = "confs",
    AddRide = "add"
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

    const [showingMonthYear, setShowingMonthYear] = useState<[number, number]>([2022, 10])

    const monthForward = () => {
        if (showingMonthYear[1] >= 12)
            setShowingMonthYear([showingMonthYear[0] + 1, 1])
        else
            setShowingMonthYear([showingMonthYear[0], showingMonthYear[1] + 1])
    }
    const monthBackward = () => {
        if (showingMonthYear[1] <= 1)
            setShowingMonthYear([showingMonthYear[0] - 1, 12])
        else
            setShowingMonthYear([showingMonthYear[0], showingMonthYear[1] - 1])
    }


    const ConfirmationList = useCallback(() => {
        if (!confirmationMapping) return null
        const List = React.Children.toArray(Object.entries(confirmationMapping).map(([k, v]) => <ConfirmationsComponent
            showingMonthYear={showingMonthYear}
            ride={k} confirmations={v} />))
        return <React.Fragment>
            <Stack direction={'row'} justifyContent={'space-between'} style={CalendarControlsStyle}>
                <ArrowBackIosIcon style={ControlStyle} onClick={monthBackward} />
                <div style={CalendarShowingWeekStyle}>{getMonthName(showingMonthYear[1]) + " " + showingMonthYear[0]}</div>
                <ArrowForwardIosIcon style={ControlStyle} onClick={monthForward} />
            </Stack>
            <Spacer offset={1} />
            {List}
        </React.Fragment>
    }, [confirmationMapping, showingMonthYear])


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
                return <div>Hello World</div>
            default:
                return null
        }
    }, [showingPage, confirmationMapping, showingMonthYear])

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
        </Stack>

    </PageHolder>
}, ['loading', 'nav', 'headerExt'])