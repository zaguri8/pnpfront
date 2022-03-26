import './SearchRide.css'
import { InnerPageHolder, PageHolder } from '../utilities/Holders'
import { Input, Stack, MenuItem } from '@mui/material'
import { DARK_BLACK, PRIMARY_WHITE, SECONDARY_WHITE } from '../../settings/colors'
import { useEffect, useState } from 'react'
import { PNPPublicRide } from '../../store/external/types'
import { useLoading } from '../../context/Loading'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { useFirebase } from '../../context/Firebase'
import { useLocation, useNavigate } from 'react-router'

import { SIDE } from '../../settings/strings'
import { useLanguage } from '../../context/Language'
import SectionTitle from '../SectionTitle'
import Spacer from '../utilities/Spacer'
export default function SearchRide() {


    const { lang } = useLanguage()
    const location = useLocation()
    const [searchQuery, setSearchQuery] = useState<string | undefined>()
    const [secondQuery, setSecondQuery] = useState<string>()
    const [rides, setRides] = useState<PNPPublicRide[]>()

    const nav = useNavigate()
    const { doLoad, cancelLoad } = useLoading()
    const { firebase, appUser } = useFirebase()


    useEffect(() => {
        doLoad()
        firebase.realTime.addListersForRideSearch(rides => {
            setRides(rides)
            cancelLoad()
        }, () => { cancelLoad() })

    }, [])


    const handleOpenRide = (ride: PNPPublicRide) => {
        nav('/event/' + ride.eventId, { state: ride })
    }

    function Results() {
        const filterFunction = () => {
            if (searchQuery && secondQuery) {
                return rides!.filter(ride => ride.rideDestination.includes(searchQuery) &&
                    ride.rideStartingPoint.includes(secondQuery))
            } else if (searchQuery) {
                return rides!.filter(ride => ride.rideDestination.includes(searchQuery))
            } else if (secondQuery) {
                return rides!.filter(ride => ride.rideStartingPoint.includes(secondQuery))
            }
            return []
        }
        return (<Stack spacing={2}>
            {function filter() {

                if (!searchQuery && !secondQuery) {
                    return <span style={{ fontSize: '12px', color: PRIMARY_WHITE }} dir={SIDE(lang)}>{lang === 'heb' ? 'חפש משהו..' : 'Search something..'}</span>
                }
                const filter = filterFunction()
                if (filter.length < 1) {
                    return <span style={{ fontSize: '12px', color: PRIMARY_WHITE }} dir={SIDE(lang)}>{lang === 'heb' ? 'אין תוצאות..' : 'Search something..'}</span>
                } else {
                    return filter.map(ride => <MenuItem
                        key={ride.rideDestination + ride.rideId + ride.ridePrice}
                        disabled={ride.extras
                            && ride.extras.isRidePassengersLimited
                            && Number(ride.passengers) >= Number(ride.extras.rideMaxPassengers)} onClick={() => {
                                handleOpenRide(ride)
                            }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = DARK_BLACK
                            e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = SECONDARY_WHITE
                            e.currentTarget.style.color = 'black'
                        }}
                        style={{
                            background: 'white',
                            width: '100%',
                            maxWidth: '400px',
                            color: 'black',
                            border: '.1px solid gray',
                            borderRadius: '4px',
                            padding: '8px',
                            display: 'flex',
                        }} value={ride.rideId}>
                        <div style={{
                            display: 'flex',
                            width: '100%',
                            columnGap: '8px'
                        }}>
                            <DirectionsBusIcon /> <span style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'Open Sans Hebrew' }}>
                                {ride.rideStartingPoint + " :  " + ride.rideDestination}</span>
                        </div>
                        {window.outerWidth > 400 && <span style={{ paddingLeft: '32px', fontSize: '10px' }}>{ride.rideTime}</span>}
                    </MenuItem>)
                }
            }()}

        </Stack>)
    }

    const onSearchQuery = (query: string) => {
        setSearchQuery(query)
    }
    const onSecondQuery = (query: string) => {
        setSecondQuery(query)
    }
    return <PageHolder>
        <SectionTitle title={lang === 'heb' ? 'חיפוש הסעה' : 'Ride Search'} style={{ fontSize: '24px' }} />
        <Spacer offset={3} />
        <Stack direction="row" spacing={3}>

            <Stack style={{ width: '50%' }}>

                <label style={{ color: SECONDARY_WHITE }}>{lang === 'heb' ? 'חיפוש לפי יעד' : 'Search by start point'}</label>

                <Input
                    dir='rtl'
                    style={
                        {
                            border: '2px solid whitesmoke',
                            padding: '8px',
                            marginTop: '16px',
                            borderRadius: '32px',
                            outline: 'none',
                            color: PRIMARY_WHITE,
                            background: DARK_BLACK
                        }
                    }
                    color={'primary'}
                    name={'ride'}
                    placeholder='יעד'
                    onChange={(e) => onSearchQuery(e.target.value)}
                />

            </Stack>
            <Stack style={{ width: '50%' }}>


                <label style={{ color: SECONDARY_WHITE }}>{lang === 'heb' ? 'חיפוש לפי נקודת יציאה' : 'Search by start point'}</label>


                <Input
                    dir='rtl'
                    style={
                        {
                            border: '2px solid whitesmoke',
                            padding: '8px',
                            marginTop: '16px',
                            borderRadius: '32px',
                            outline: 'none',
                            color: PRIMARY_WHITE,
                            background: DARK_BLACK
                        }
                    }
                    color={'primary'}
                    name={'ride'}
                    placeholder='נקודת יציאה'
                    onChange={(e) => onSecondQuery(e.target.value)}
                />
            </Stack>

        </Stack>

        <SectionTitle title={lang === 'heb' ? 'תוצאות' : 'Search results'} style={{ fontSize: '32px' }} />
        <InnerPageHolder style={{ width: '60%' }}>
            {rides && <Results />}
        </InnerPageHolder>
    </PageHolder>
}