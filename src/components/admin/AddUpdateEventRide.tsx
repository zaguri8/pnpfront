import { PNPPublicRide, PNPEvent } from "../../store/external/types"
import { isValidPublicRide } from "../../store/validators"
import { useLoading } from "../../context/Loading"
import { useFirebase } from "../../context/Firebase"
import { useLanguage } from "../../context/Language"
import { useState } from "react"

import { Stack, TextField, Button, MenuItem, Checkbox, Select } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { submitButton } from "../../settings/styles"
import { SECONDARY_WHITE, PRIMARY_BLACK } from "../../settings/colors"
import { SAME_SPOT } from "../../settings/strings"
import { getDefaultPublicRide } from "../../store/external/helpers"

const AddUpdateEventRide = (props: { ride?: PNPPublicRide, event: PNPEvent }) => {



    // context
    const { cancelLoad, doLoad, closeDialog } = useLoading()
    const { lang } = useLanguage()
    const { firebase } = useFirebase()

    const [ride, setRide] = useState<PNPPublicRide>(props.ride ? props.ride : getDefaultPublicRide(props.event, lang))

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
                firebase.realTime.updatePublicRide(props.event.eventId, ride.rideId, ride)
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

                firebase.realTime.addPublicRide(ride.eventId, ride)
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
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><label style={{ color: SECONDARY_WHITE }}>{'הסעה דו כיוונית'}</label>
            <Checkbox
                style={{ width: 'fit-content', alignSelf: 'center' }}
                checked={ride.extras.twoWay}
                onChange={(e) => {
                    changeRideWays(e.target.checked)
                }}
                inputProps={{ 'aria-label': 'controlled' }}
            /></div>
   
        {!ride.extras.twoWay &&
            <Stack direction='column' spacing={2}>
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
                </Select></Stack>}

        {(ride.extras.twoWay || ride.extras.rideDirection === '2') &&
            <Stack direction='column' spacing={2}>
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
            </Stack>}

        {(ride.extras.twoWay || ride.extras.rideDirection === '1') && <Stack direction='column' spacing={2}>
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
        </Stack>}
        <label style={{ color: SECONDARY_WHITE }}>{'הכנס מחיר'}</label>
        <TextField
            required
            classes={{ root: classes.root }}
            InputLabelProps={{

                style: { color: SECONDARY_WHITE },
            }}
            placeholder={props.ride ? props.ride.ridePrice : 'מחיר'}
            name='price'
            style={{ color: SECONDARY_WHITE }}
            inputProps={{ inputMode: 'decimal', max: 500, min: 1 }}
            type='number'
            onChange={(e) => changeRidePrice(e.target.value)}
        />
        <label style={{ color: SECONDARY_WHITE }}> {'הכנס שעת יציאה'}</label>
        <TextField
            classes={{ root: classes.root }}
            InputLabelProps={{
                style: { color: SECONDARY_WHITE },
            }}
            required
            type='time'
            style={{ color: SECONDARY_WHITE }}

            placeholder={props.ride ? props.ride.rideTime : '00:00'}
            name='time'
            onChange={(e) => changeRideTime(e.target.value)}
        />
        <label style={{ color: SECONDARY_WHITE }}> {'הכנס שעת חזרה'}</label>
        <TextField
            classes={{ root: classes.root }}
            InputLabelProps={{
                style: { color: SECONDARY_WHITE },
            }}
            required
            type='time'
            style={{ color: SECONDARY_WHITE }}

            placeholder={props.ride ? props.ride.backTime : '00:00'}
            name='time'
            onChange={(e) => changeRideBackTime(e.target.value)}
        />

        <label style={{ color: SECONDARY_WHITE }}> {'הגבל מספר מקומות'}</label>
        <TextField
            classes={{ root: classes.root }}
            InputLabelProps={{
                style: { color: SECONDARY_WHITE },
            }}
            required
            type='number'
            inputProps={{ inputMode: 'numeric', min: 0, max: 250 }}
            style={{ color: SECONDARY_WHITE }}

            placeholder={props.ride && props.ride.extras.rideMaxPassengers ? props.ride.extras.rideMaxPassengers : 'הכנס מספר מקומות'}
            name='number of'
            onChange={(e) => changeRidePassengerLimit(e.target.value)}
        />
        <Button sx={{ ...submitButton(false), ...{ width: '100%', maxHeight: '50px' } }}
            onClick={() => createNewRide()}
        >{props.ride ? 'שמור שינויים' : 'הוסף הסעה'}</Button>
    </Stack>
}


export default AddUpdateEventRide