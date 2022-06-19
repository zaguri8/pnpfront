import { PNPPublicRide, PNPEvent, PNPPrivateEvent } from "../../store/external/types"
import { isValidPublicRide } from "../../store/validators"
import { useLoading } from "../../context/Loading"
import { useFirebase } from "../../context/Firebase"
import { useLanguage } from "../../context/Language"
import { useState } from "react"
import React from 'react'
import { Stack, TextField, Button, MenuItem, Checkbox, Select } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { submitButton } from "../../settings/styles"
import { SECONDARY_WHITE, PRIMARY_BLACK } from "../../settings/colors"
import { SAME_SPOT } from "../../settings/strings"
import { getDefaultPublicRide, getDefaultPublicRide2 } from "../../store/external/helpers"

const AddUpdatePrivateEventRide = (props: { ride?: PNPPublicRide, event: PNPPrivateEvent }) => {

    const { cancelLoad, doLoad, closeDialog } = useLoading()
    const { lang } = useLanguage()
    const { firebase } = useFirebase()
    const [ride, setRide] = useState<PNPPublicRide>(props.ride ? props.ride : getDefaultPublicRide2(props.event, lang))

    const useStyles = makeStyles(() => (
        {
            root: {
                "& .MuiOutlinedInput-root": {
                    background: SECONDARY_WHITE,
                    borderRadius: '32px',
                    padding: '0px',
                    border: '.1px solid white',
                    color: PRIMARY_BLACK,
                    WebkitAppearance: 'none'
                    , ...{
                        '& input[type=number]': {
                            '-moz-appearance': 'textfield'
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0
                        }
                    }
                }
            }

        }
    ))

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
            doLoad()

            if (props.ride) {
                firebase.realTime.updatePublicRide(props.event.eventId, ride.rideId, ride, true)
                    .then(() => {
                        cancelLoad()
                        closeDialog()
                        alert(`ערכת נסיעה בהצלחה : \n נסיעה מ ${ride.rideStartingPoint} ל ${ride.rideDestination} \n בשעה : ${ride.rideTime}`)
                    }).catch((e) => {
                        cancelLoad()
                        closeDialog()
                        alert('אירעתה שגיאה בעריכת ההסעה, אנא יידע את המתכנת')
                    })
            } else {

                firebase.realTime.addPublicRide(ride.eventId, ride, true)
                    .then(() => {
                        cancelLoad()
                        closeDialog()
                        alert(`הוספת נסיעה נוספת בהצלחה : \n נסיעה מ ${ride.rideStartingPoint} ל ${ride.rideDestination} \n בשעה : ${ride.rideTime}`)
                    }).catch(() => {
                        cancelLoad()
                        closeDialog()
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
                <label style={{ color: SECONDARY_WHITE }}>{'הסעה דו כיוונית'}</label>
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
                <label style={{ color: SECONDARY_WHITE }}>{'הסעה דו כיוונית בלבד'}</label>
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
                    <label style={{ color: SECONDARY_WHITE }}>{'בחר כיוון נסיעה'}</label>
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
                    <label style={{ color: SECONDARY_WHITE }}>{'הכנס נקודת יציאה'}</label>
                    <TextField
                        autoComplete=""
                        InputLabelProps={{
                            style: { color: SECONDARY_WHITE },
                        }}
                        classes={{ root: classes.root }}

                        style={{ color: SECONDARY_WHITE }}
                        placeholder={props.ride ? props.ride.rideStartingPoint : 'נקודת יציאה'}
                        onChange={(e) => changeRideStartingPoint(e.target.value)}
                    />
                    <label style={{ color: SECONDARY_WHITE }}>{'הכנס נקודת יציאה מדויקת'}</label>
                    <TextField
                        autoComplete=""
                        InputLabelProps={{
                            style: { color: SECONDARY_WHITE },
                        }}
                        classes={{ root: classes.root }}

                        style={{ color: SECONDARY_WHITE }}
                        placeholder={props.ride ? props.ride.extras.exactStartPoint : 'נקודת יציאה מדויקת'}
                        onChange={(e) => changeRideExactStartPoint(e.target.value)}
                    />
                </Stack>
            else return null
        }()}


        {function backPointField() {
            if (ride.extras.twoWay || ride.extras.rideDirection === '1')
                return <Stack direction='column' spacing={2}>
                    <label style={{ color: SECONDARY_WHITE }}>{'הכנס נקודת חזרה מדויקת'}</label>
                    <TextField
                        autoComplete=""
                        InputLabelProps={{
                            style: { color: SECONDARY_WHITE },
                        }}
                        classes={{ root: classes.root }}

                        style={{ color: SECONDARY_WHITE }}
                        placeholder={props.ride ? props.ride.extras.exactBackPoint : ride.extras.twoWay && ride.extras.exactBackPoint ? ride.extras.exactBackPoint : 'נקודת חזרה מדויקת'}
                        onChange={(e) => changeRideExactBackPoint(e.target.value)}
                    />
                </Stack>
            else return null
        }()}


        {function rideTimeField() {
            return <React.Fragment>
                <label style={{ color: SECONDARY_WHITE }}> {'הכנס שעת יציאה'}</label>
                <TextField
                    classes={{ root: classes.root }}
                    InputLabelProps={{
                        style: { color: SECONDARY_WHITE },
                    }}
                    required
                    type='text'
                    style={{ color: SECONDARY_WHITE }}

                    placeholder={props.ride ? props.ride.rideTime : '00:00'}
                    name='time'
                    onChange={(e) => changeRideTime(e.target.value)}
                />
            </React.Fragment>
        }()}

        {function backTimeField() {
            return <React.Fragment>
                <label style={{ color: SECONDARY_WHITE }}> {'הכנס שעת חזרה'}</label>
                <TextField
                    classes={{ root: classes.root }}
                    InputLabelProps={{
                        style: { color: SECONDARY_WHITE },
                    }}
                    required
                    type='text'
                    style={{ color: SECONDARY_WHITE }}

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


export default AddUpdatePrivateEventRide