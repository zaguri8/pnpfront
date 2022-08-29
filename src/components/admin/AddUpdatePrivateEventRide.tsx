import { PNPPublicRide, PNPEvent, PNPPrivateEvent } from "../../store/external/types"
import { isValidPublicRide } from "../../store/validators"
import { useLoading } from "../../context/Loading"
import { useUser } from "../../context/Firebase"
import { useLanguage } from "../../context/Language"
import { useState } from "react"
import React from 'react'
import { Stack, TextField, Button, MenuItem, Checkbox, Select } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { submitButton, textFieldStyle } from "../../settings/styles"
import { SECONDARY_WHITE, PRIMARY_BLACK, PRIMARY_PINK } from "../../settings/colors"
import { SAME_SPOT } from "../../settings/strings"
import { getDefaultPublicRide, getDefaultPublicRide2 } from "../../store/external/helpers"
import { Hooks } from "../generics/types"
import { CommonHooks, withHookGroup } from "../generics/withHooks"
import { StoreSingleton } from "../../store/external"

type AddUpdatePrivateRide = { ride?: PNPPublicRide, event: PNPPrivateEvent }
const AddUpdatePrivateEventRide = (props: AddUpdatePrivateRide & Hooks) => {
    const [ride, setRide] = useState<PNPPublicRide>(props.ride ? props.ride : getDefaultPublicRide2(props.event, props.language.lang))
    const useStyles = makeStyles(() => textFieldStyle(SECONDARY_WHITE, { background: PRIMARY_BLACK }))

    const classes = useStyles()
    const changeRideStartingPoint = (newStartPoint: string) => {
        setRide({
            ...ride,
            rideStartingPoint: newStartPoint
        })
    }

    const changeRideExactStartPoint = (newStartPoint: string) => {
        setRide({
            ...ride,
            extras: { ...ride.extras, exactStartPoint: newStartPoint }
        })
    }

    const changeRideExactBackPoint = (newBackPoint: string) => {
        setRide({
            ...ride,
            extras: { ...ride.extras, exactBackPoint: newBackPoint }
        })
    }

    const changeRideWays = (twoWay: boolean) => {
        setRide({
            ...ride,
            extras: { ...ride.extras, twoWay: twoWay }
        })
    }

    const changeTwoWayOnly = (twoWay: boolean) => {
        setRide({
            ...ride,
            extras: { ...ride.extras, twoWayOnly: twoWay }
        })
    }

    const changeRideDirections = (directions: '1' | '2') => {
        setRide({
            ...ride,
            extras: { ...ride.extras, rideDirection: directions }
        })

    }



    const changeRidePassengerLimit = (max: string) => {
        setRide({
            ...ride,
            extras: { ...ride.extras, rideMaxPassengers: max }
        })
    }



    const changeRidePrice = (newPrice: string) => {
        setRide({
            ...ride,
            ridePrice: newPrice
        })
    }
    const changeRideTime = (newTime: string) => {
        setRide({
            ...ride,
            rideTime: newTime
        })
    }
    const changeRideBackTime = (newTime: string) => {
        setRide({
            ...ride,
            backTime: newTime
        })
    }

    const createNewRide = () => {

        if (isValidPublicRide(ride)) {
            props.loading.doLoad()

            if (props.ride) {
                StoreSingleton.getTools().realTime.updatePublicRide(props.event.eventId, ride.rideId, ride, true)
                    .then(() => {
                        props.loading.cancelLoad()
                        props.loading.closeDialog()
                        alert(`ערכת נסיעה בהצלחה : \n נסיעה מ ${ride.rideStartingPoint} ל ${ride.rideDestination} \n בשעה : ${ride.rideTime}`)
                    }).catch((e) => {
                        props.loading.cancelLoad()
                        props.loading.closeDialog()
                        alert('אירעתה שגיאה בעריכת ההסעה, אנא יידע את המתכנת')
                    })
            } else {

                StoreSingleton.getTools().realTime.addPublicRide(ride.eventId, ride, true)
                    .then(() => {
                        props.loading.cancelLoad()
                        props.loading.closeDialog()
                        alert(`הוספת נסיעה נוספת בהצלחה : \n נסיעה מ ${ride.rideStartingPoint} ל ${ride.rideDestination} \n בשעה : ${ride.rideTime}`)
                    }).catch(() => {
                        props.loading.cancelLoad()
                        props.loading.closeDialog()
                        alert('אירעתה שגיאה בהוספת ההסעה, אנא יידע את המתכנת')
                    })
            }

        } else {
            alert('אנא וודא שמילאת נכון את כל השדות הדרושים')
        }

    }


    return <Stack spacing={2} style={{ padding: '16px', minWidth: '250px' }}>
        {function twoWayRideCheckBoxField() {
            return <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <label style={{ color: PRIMARY_PINK }}>{'הסעה דו כיוונית'}</label>
                <Checkbox
                    style={{ width: 'fit-content', alignSelf: 'center' }}
                    checked={ride.extras.twoWay}
                    onChange={(e) => {
                        changeRideWays(e.target.checked)
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                /></div>
        }()}

        {function onlyTwoWayRideCheckBoxField() {
            return <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <label style={{ color: PRIMARY_PINK }}>{'הסעה דו כיוונית בלבד'}</label>
                <Checkbox
                    style={{ width: 'fit-content', alignSelf: 'center' }}
                    checked={ride.extras.twoWayOnly}
                    onChange={(e) => {
                        changeTwoWayOnly(e.target.checked)
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                /></div>
        }()}

        {function rideDirectionField() {
            if (!ride.extras.twoWay)
                return <Stack direction='column' spacing={2}>
                    <label style={{ color: PRIMARY_PINK }}>{'בחר כיוון נסיעה'}</label>
                    <Select
                        value={ride.extras.rideDirection}
                        style={{ color: PRIMARY_BLACK, borderRadius: '32px', background: SECONDARY_WHITE }}
                        onChange={(e) => {
                            if (e.target.value === '1' || e.target.value === '2')
                                changeRideDirections(e.target.value)
                        }}>
                        <MenuItem value={'1'}>{'חזור בלבד'}</MenuItem>
                        <MenuItem value={'2'}>{'הלוך בלבד'}</MenuItem>
                    </Select></Stack>
            else return null
        }()}


        {function startPointField() {
            if (ride.extras.twoWay || ride.extras.rideDirection === '2')
                return <Stack direction='column' spacing={2}>
                    <label style={{ color: PRIMARY_PINK }}>{'הכנס נקודת יציאה'}</label>
                    <TextField
                        autoComplete=""
                        InputLabelProps={{
                            style: { color: SECONDARY_WHITE },
                        }}
                        classes={{ root: classes.root }}

                        style={{ color: PRIMARY_PINK }}
                        placeholder={props.ride ? props.ride.rideStartingPoint : 'נקודת יציאה'}
                        onChange={(e) => changeRideStartingPoint(e.target.value)}
                    />
                    <label style={{ color: PRIMARY_PINK }}>{'הכנס נקודת יציאה מדויקת'}</label>
                    <TextField
                        autoComplete=""
                        InputLabelProps={{
                            style: { color: SECONDARY_WHITE },
                        }}
                        classes={{ root: classes.root }}

                        style={{ color: PRIMARY_PINK }}
                        placeholder={props.ride ? props.ride.extras.exactStartPoint : 'נקודת יציאה מדויקת'}
                        onChange={(e) => changeRideExactStartPoint(e.target.value)}
                    />
                </Stack>
            else return null
        }()}


        {function backPointField() {
            if (ride.extras.twoWay || ride.extras.rideDirection === '1')
                return <Stack direction='column' spacing={2}>
                    <label style={{ color: PRIMARY_PINK }}>{'הכנס נקודת חזרה מדויקת'}</label>
                    <TextField
                        autoComplete=""
                        InputLabelProps={{
                            style: { color: SECONDARY_WHITE },
                        }}
                        classes={{ root: classes.root }}

                        style={{ color: PRIMARY_PINK }}
                        placeholder={props.ride ? props.ride.extras.exactBackPoint : ride.extras.twoWay && ride.extras.exactBackPoint ? ride.extras.exactBackPoint : 'נקודת חזרה מדויקת'}
                        onChange={(e) => changeRideExactBackPoint(e.target.value)}
                    />
                </Stack>
            else return null
        }()}


        {function rideTimeField() {
            return <React.Fragment>
                <label style={{ color: PRIMARY_PINK }}> {'הכנס שעת יציאה'}</label>
                <TextField
                    classes={{ root: classes.root }}
                    InputLabelProps={{
                        style: { color: SECONDARY_WHITE },
                    }}
                    required
                    type='text'
                    style={{ color: PRIMARY_PINK }}

                    placeholder={props.ride ? props.ride.rideTime : '00:00'}
                    name='time'
                    onChange={(e) => changeRideTime(e.target.value)}
                />
            </React.Fragment>
        }()}

        {function backTimeField() {
            return <React.Fragment>
                <label style={{ color: PRIMARY_PINK }}> {'הכנס שעת חזרה'}</label>
                <TextField
                    classes={{ root: classes.root }}
                    InputLabelProps={{
                        style: { color: SECONDARY_WHITE },
                    }}
                    required
                    type='text'
                    style={{ color: PRIMARY_PINK }}

                    placeholder={props.ride ? props.ride.backTime : '00:00'}
                    name='time'
                    onChange={(e) => changeRideBackTime(e.target.value)}
                />
            </React.Fragment>
        }()}



        {function submitField() {
            return <Button sx={{ ...submitButton(false), ...{ width: '100%', maxHeight: '50px' } }}
                onClick={() => createNewRide()}
            >{props.ride ? 'שמור שינויים' : 'הוסף הסעה'}</Button>
        }()}
    </Stack>
}


export default withHookGroup<AddUpdatePrivateRide>(AddUpdatePrivateEventRide, CommonHooks)