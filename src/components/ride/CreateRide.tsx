import { ChangeEvent, useState } from "react"
import { PNPPrivateRide } from "../../store/external/types"
import { useFirebase } from '../../context/Firebase'
import { useLoading } from '../../context/Loading'
import { isValidPrivateRide } from '../../store/validators'
import $ from 'jquery'
import { InnerPageHolder, PageHolder } from "../utilities/Holders"
import { Checkbox, InputLabel, TextFieldProps } from "@mui/material"
import SectionTitle from "../SectionTitle"
import { useLocation } from "react-router"
import { LocalizationProvider, TimePicker } from "@mui/lab"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { DatePicker } from "@mui/lab"

import { ACCEPT_TERMS_REQUEST, COMMENTS, CONTINUE_TO_CREATE, CREATE_RIDE, DESTINATION_POINT, FILL_ALL_FIELDS, LEAVE_HOUR, PASSENGERS, RETURN_HOUR, RIDE_DATE, STARTING_POINT_SINGLE, TERMS_OF_USE } from "../../settings/strings"
import { useLanguage } from "../../context/Language"
import { FormControl, TextField, Stack, Button } from "@mui/material"
import { FormElementType, RideFormItem } from "./RideFormItem"
import { HtmlTooltip } from "../utilities/HtmlTooltip"
import { submitButton } from "../../settings/styles"
import { ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, SECONDARY_WHITE } from "../../settings/colors"
import { makeStyles } from "@mui/styles"
import { dateStringFromDate, reverseDate, unReverseDate } from "../utilities/functions"
import Spacer from "../utilities/Spacer"



export default function CreateRide() {


    const { lang } = useLanguage()
    const { firebase, appUser } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()
    const [termsOfUser, setTermsOfUse] = useState<boolean>(false)
    const location = useLocation()

    const [ride, setRide] = useState<PNPPrivateRide>((location.state as PNPPrivateRide) ? location.state as PNPPrivateRide : {
        rideCreatorId: '',
        rideName: '',
        rideId: '',
        rideDestination: 'null',
        rideStartingPoint: 'null',
        extraStopPoints: [],
        backTime: 'null',
        rideTime: '00:00',
        passengers: 'null',
        date: dateStringFromDate(new Date()),
        comments: 'null'
    })

    const handleTermsOfUseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTermsOfUse(e.target.checked)
    }

    const updateRideName = (name: string) => {
        setRide({ ...ride, ...{ rideName: name } })
    }
    const updateRideDestination = (destination: string) => {
        setRide({ ...ride, ...{ rideDestination: destination } })
    }
    const updateRideStartingPoint = (startingPoint: string) => {
        setRide({ ...ride, ...{ rideStartingPoint: startingPoint } })
    }
    const addExtraStopPoint = (point: string) => {
        setRide({ ...ride, ...{ extraStopPoints: [...ride.extraStopPoints, point] } })
    }
    const removeExtraStopPoint = (point: string) => {
        const cur = ride.extraStopPoints
        const i = cur.findIndex(p => p === point)
        cur.splice(i, 1)
        setRide({ ...ride, ...{ extraStopPoints: cur } })

    }
    const updateRideTime = (rideTime: string) => {
        setRide({ ...ride, ...{ rideTime: rideTime } })
    }
    const updateBackTime = (backTime: string) => {
        setRide({ ...ride, ...{ backTime: backTime } })
    }

    const updateRidePassengers = (passengers: any) => {
        setRide({ ...ride, ...{ passengers: passengers } })
    }
    const updateRideDate = (date: string) => {
        setRide({ ...ride, ...{ date: reverseDate(date) } })
    }
    const updateRideComments = (comments: any) => {
        setRide({ ...ride, ...{ comments: comments } })
    }


    const useStyles = makeStyles(() => ({
        root: {
            "& .MuiOutlinedInput-root": {
                background: SECONDARY_WHITE,
                borderRadius: '32px',
                padding: '0px',
                border: '.1px solid white',
                color: PRIMARY_BLACK, ...{
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
        }, noBorder: {
            border: "1px solid red",
            outline: 'none'
        }
    }));
    const classes = useStyles()
    const transformNull = (s: string) => s === 'null' ? '' : s
    const labelStyle = { padding: '8px', fontSize: '14px', color: SECONDARY_WHITE }


    function createRide() {
        const inflate = () => {
            const entries = Object.entries(ride)
            const elms: any[] = []
            entries.forEach(entry => {
                elms.push(<Stack  spacing={1} direction={'row'}>
                    <span>
                        {entry[0]}
                    </span>
                    <Spacer offset={1} />
                    <span>
                        { entry[1]}
                    </span>)</Stack>)
            })
            return <Stack spacing={1}>{elms}</Stack>
        }
        doLoad()
        firebase.realTime.addPrivateRide(ride)
            .then(() => {
                alert('בקשה לנסיעה חדשה נשלחה בהצלחה, הצוות שלנו ייצור עמך קשר בהקדם')
                setConfirmation(inflate())
                cancelLoad()
            }).catch(() => {
                alert('אירעתה שגיאה בשליחת הבקשה להסעה, אנא נסא שוב מאוחר יותר')
            })
    }
    const [confirmation, setConfirmation] = useState<JSX.Element | undefined>()
    return <PageHolder>
        <SectionTitle style={{}} title={CREATE_RIDE(lang)} />
        <InnerPageHolder >
            {!confirmation ? <Stack spacing={2} style={{ width: '100%' }}>
                <FormControl>
                    <label style={labelStyle}>{STARTING_POINT_SINGLE(lang)}</label>
                    <RideFormItem
                        type={'text'}
                        value={transformNull(ride.rideStartingPoint)}
                        placeSelectedHandler={updateRideStartingPoint}
                        style={{}}
                        elem={FormElementType.place}
                        text={STARTING_POINT_SINGLE(lang)} />
                </FormControl>
                <FormControl>
                    <label style={labelStyle}>{DESTINATION_POINT(lang)}</label>
                    <RideFormItem
                        type={'text'}
                        value={transformNull(ride.rideDestination)}
                        style={{}}
                        placeSelectedHandler={updateRideDestination}
                        elem={FormElementType.place}
                        text={DESTINATION_POINT(lang)} />
                </FormControl>




                <FormControl style={{ width: '80%', alignSelf: 'center' }}>
                    <label style={labelStyle}>{RIDE_DATE(lang)}</label>
                    <TextField
                        value={unReverseDate(ride.date)}
                        classes={{ root: classes.root }}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: SECONDARY_WHITE }
                        }}
                        type='date'
                        onChange={(e) => e && updateRideDate(e.target.value)}
                        required />
                </FormControl>
                <FormControl style={{ width: '80%', alignSelf: 'center' }}>

                    <label style={labelStyle}>{LEAVE_HOUR(lang)}</label>
                    <TextField
                        value={ride.rideTime}
                        onChange={(e) => e && updateRideTime(e.target.value)}
                        classes={classes}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: SECONDARY_WHITE }
                        }}

                        type='time'
                        required />
                </FormControl>
                <FormControl style={{ width: '80%', alignSelf: 'center' }}>

                    <label style={labelStyle}>{RETURN_HOUR(lang)}</label>
                    <TextField
                        value={ride.backTime}
                        onChange={(e) => e && updateBackTime(e.target.value)}
                        classes={classes}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: SECONDARY_WHITE }
                        }}

                        type='time'
                        required />
                </FormControl>
                <FormControl>
                    <label style={labelStyle}>{PASSENGERS(lang)}</label>
                    <RideFormItem
                        type={'number'}
                        value={transformNull(ride.passengers)}
                        action={(e: ChangeEvent) => { e.target && updateRidePassengers($(e.target).val()) }}
                        inputProps={{ inputMode: 'numeric', min: 1, max: 250 }}
                        style={{}}

                        elem={FormElementType.input}
                        text={PASSENGERS(lang)} />
                </FormControl>

                <FormControl>
                    <label style={labelStyle}>{COMMENTS(lang)}</label>
                    <RideFormItem
                        type={'text'}
                        value={transformNull(ride.comments)}
                        action={(e: ChangeEvent) => { e.target && updateRideComments($(e.target).val()) }}
                        style={{}}
                        elem={FormElementType.input}
                        text={COMMENTS(lang)} />
                </FormControl>
                <FormControl>
                    <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!isValidPrivateRide(ride) ? FILL_ALL_FIELDS(lang) : !termsOfUser ? ACCEPT_TERMS_REQUEST(lang) : CONTINUE_TO_CREATE(lang)} arrow>
                        <span>
                            <Button

                                onClick={() => { createRide() }}
                                sx={{ ...submitButton(false), ... { padding: '8px', width: '90%', marginTop: '16px' } }} variant="outlined" disabled={!isValidPrivateRide(ride) || !termsOfUser} >{CREATE_RIDE(lang)}</Button>
                        </span>
                    </HtmlTooltip>
                </FormControl>
                <Stack >


                    <label style={{ paddingTop: '16px', fontSize: '14px', color: SECONDARY_WHITE }}>{TERMS_OF_USE(lang)}</label>
                    <Checkbox
                        style={{ width: 'fit-content', alignSelf: 'center', background: ORANGE_GRADIENT_PRIMARY, color: SECONDARY_WHITE, margin: '8px' }}
                        onChange={handleTermsOfUseChange}
                        name={TERMS_OF_USE(lang)} value={TERMS_OF_USE(lang)} />
                </Stack>
            </Stack> : confirmation}
        </InnerPageHolder>
    </PageHolder >
}
