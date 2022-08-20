import './SearchRide.css'
import { InnerPageHolder, PageHolder } from '../utilities/Holders'
import { Input, Stack, TextField, MenuItem } from '@mui/material'
import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_WHITE, SECONDARY_WHITE } from '../../settings/colors'
import { useEffect, useState } from 'react'
import { PNPPublicRide } from '../../store/external/types'
import { useLoading } from '../../context/Loading'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { useFirebase } from '../../context/Firebase'
import { useLocation, useNavigate } from 'react-router'

import React from 'react'
import { v4 } from 'uuid'
import { DESTINATION_POINT, SIDE, STARTING_POINT_SINGLE } from '../../settings/strings'
import { useLanguage } from '../../context/Language'
import SectionTitle from '../other/SectionTitle'
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

        if (location.state) {
            setSearchQuery(location.state as string)
        }
    }, [])


    const handleOpenRide = (ride: PNPPublicRide) => {
        nav('/event/' + ride.eventId, { state: ride })
    }

    function Results() {
        const filterFunction = () => {
            const isValid = (ride: PNPPublicRide) => !ride.extras.rideStatus || ride.extras.rideStatus !== 'sold-out'
            if (searchQuery && secondQuery) {
                return rides!.filter(ride => ride.rideDestination.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    ride.rideStartingPoint.includes(secondQuery) && isValid(ride))
            } else if (searchQuery) {
                return rides!.filter(ride => (ride.rideDestination.toLowerCase().includes(searchQuery.toLowerCase())) && isValid(ride))
            } else if (secondQuery) {
                return rides!.filter(ride => ride.rideStartingPoint.toLowerCase().includes(secondQuery.toLowerCase()) && isValid(ride))
            }
            return []
        }
        const ridesLeft = (ride: PNPPublicRide) => {
            return Number(ride.extras.rideMaxPassengers) - Number(ride.passengers)
        }
        const SoldOutLabel = ({ ride }: { ride: PNPPublicRide }) => {
            const left = ridesLeft(ride)
            const showLeft = ride.extras.rideStatus === 'running-out'
            const soldOut = ride.extras.rideStatus === 'sold-out'
            const labelText = soldOut ? (lang === 'heb' ? 'כרטיסים אזלו' : 'Sold out') : (showLeft ? left + (lang === 'heb' ? (' כרטיסים' + (left <= 10 ? ' אחרונים' : ' זמינים')) : ' Tickets Available') : (lang === 'heb' ? 'כרטיסים זמינים' : 'Tickets Available'))
            return (<div className={'sold_out_item_label'} style={{
                direction: 'rtl',
                textAlign: 'end',
                color: (showLeft && !soldOut) ? '#EE1229' : soldOut ? 'gray' : SECONDARY_WHITE,
                margin: '0px',
                fontWeight: 'bold',
                padding: '0px',
                fontSize: '12px'
            }}>{labelText}</div>)
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
                    return filter.map(ride => <React.Fragment key={ride.rideDestination + ride.rideId + ride.ridePrice}><MenuItem
                        onMouseEnter={e => {
                            e.currentTarget.style.background = DARK_BLACK
                            e.currentTarget.style.color = 'white'
                        }}
                        onClick={() => handleOpenRide(ride)}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = SECONDARY_WHITE
                            e.currentTarget.style.color = 'black'
                        }}
                        style={{
                            background: 'white',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: '350px',
                            color: 'black',
                            border: '.1px solid gray',
                            borderRadius: '4px',
                            padding: '8px',
                            display: 'flex',
                        }} value={ride.rideId}>
                        <div style={{
                            display: 'flex',
                            columnGap: '8px'
                        }}>
                            <DirectionsBusIcon /> <span style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'Open Sans Hebrew' }}>
                                {ride.rideStartingPoint + " :  " + ride.rideDestination}</span>
                        </div>

                    </MenuItem>
                        <SoldOutLabel ride={ride} />
                    </React.Fragment>)
                }

            }()}

        </Stack >)
    }

    const onSearchQuery = (query: string) => {
        setSearchQuery(query)
    }
    const onSecondQuery = (query: string) => {
        setSecondQuery(query)
    }
    return <PageHolder>
        <SectionTitle title={lang === 'heb' ? 'חיפוש הסעה' : 'Ride Search'} style={{ fontSize: '32px' }} />
        <Spacer offset={3} />
        <Stack direction="row" spacing={3} style={{ marginLeft: '8px', marginRight: '8px', width: '90%', maxWidth: '100%' }}>

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
                            color: PRIMARY_BLACK,
                            background: PRIMARY_WHITE
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
                            color: PRIMARY_BLACK,
                            background: PRIMARY_WHITE
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
        <InnerPageHolder style={{ width: '80%', background: 'none', border: 'none' }}>
            {rides && <Results />}
        </InnerPageHolder>
    </PageHolder>
}