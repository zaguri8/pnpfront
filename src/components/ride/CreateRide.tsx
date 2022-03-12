import { ChangeEvent, useEffect, useState } from "react"
import { PNPPrivateRide } from "../../store/external/types"
import { useFirebase } from '../../context/Firebase'
import { useLoading } from '../../context/Loading'
import { isValidPrivateRide } from '../../store/validators'
import PhoneInput from 'react-phone-number-input'
import $ from 'jquery'
import { InnerPageHolder, PageHolder } from "../utilities/Holders"
import { Checkbox, InputLabel, TextFieldProps } from "@mui/material"
import SectionTitle from "../SectionTitle"
import { useLocation } from "react-router"
import { LocalizationProvider, TimePicker } from "@mui/lab"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { DatePicker } from "@mui/lab"

import { ACCEPT_TERMS_REQUEST, COMMENTS, CONTINUE_TO_CREATE, CREATE_RIDE, DESTINATION_POINT, EMAIL, EVENT_START, FILL_ALL_FIELDS, FULL_NAME, LEAVE_HOUR, PASSENGERS, PHONE_NUMBER, RETURN_HOUR, RIDE_DATE, STARTING_POINT, STARTING_POINT_SINGLE, TERMS_OF_USE } from "../../settings/strings"
import { useLanguage } from "../../context/Language"
import { FormControl, TextField, Stack, Button } from "@mui/material"
import { FormElementType, RideFormItem } from "./RideFormItem"
import { HtmlTooltip } from "../utilities/HtmlTooltip"
import { submitButton } from "../../settings/styles"



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
        rideTime: 'null',
        passengers: 'null',
        date: 'null',
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
        let cur = ride.extraStopPoints
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
        setRide({ ...ride, ...{ date: date } })
    }
    const updateRideComments = (comments: any) => {
        setRide({ ...ride, ...{ comments: comments } })
    }

    const save = () => {

        if (isValidPrivateRide(ride)) {
            doLoad()
            
            firebase.realTime.addPrivateRide(ride)
            .then((an) => (an as object) != null)
        } else {

        }

    }
    const transformNull = (s: string) => s === 'null' ? '' : s
    const labelStyle = { padding: '8px', fontSize: '14px' }

    return <PageHolder>
        <SectionTitle style={{}} title={CREATE_RIDE(lang)} />
        <InnerPageHolder >
            <Stack spacing={2} style={{ width: '100%' }}>
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

                <FormControl >
                    <label style={labelStyle}>{RIDE_DATE(lang)}</label>
                    <div
                        style={{ background: 'white' }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker

                                label={RIDE_DATE(lang)}
                                value={transformNull(ride.date)}
                                onChange={(e) => e && updateRideDate(e)}
                                renderInput={(params: TextFieldProps) => <TextField style={{ textAlign: 'center', width: '100%' }} required disabled {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                </FormControl>
                <FormControl sx={{ background: 'white' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label={LEAVE_HOUR(lang)}
                            value={ride.rideTime}
                            onChange={(e) => e && updateRideTime(e!)}
                            renderInput={(params: TextFieldProps) => <TextField required disabled {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl>
                    <label style={{ padding: '8px', fontSize: '14px' }}>{PASSENGERS(lang)}</label>
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
                            <Button sx={{ ...submitButton(false), ... { margin: '0px', padding: '8px' } }} disabled={!isValidPrivateRide(ride) || !termsOfUser} >{CREATE_RIDE(lang)}</Button>
                        </span>
                    </HtmlTooltip>
                </FormControl>
                <span ><InputLabel style={{ paddingTop: '16px', fontSize: '14px' }}>{TERMS_OF_USE(lang)}</InputLabel>
                    <Checkbox
                        onChange={handleTermsOfUseChange}
                        name={TERMS_OF_USE(lang)} value={TERMS_OF_USE(lang)} />
                </span>
            </Stack>
        </InnerPageHolder>
    </PageHolder >
}
