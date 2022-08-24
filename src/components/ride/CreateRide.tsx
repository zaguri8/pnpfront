import React, { ChangeEvent, CSSProperties, useCallback, useEffect, useRef, useState } from "react"
import { PNPExplicitPrivateRide, PNPPrivateRide } from "../../store/external/types"
import { useFirebase } from '../../context/Firebase'
import { useLoading } from '../../context/Loading'
import { isValidPrivateRide } from '../../store/validators'
import $ from 'jquery'
import axios from "axios"
import { InnerPageHolder, PageHolder } from "../utilityComponents/Holders"
import { Checkbox } from "@mui/material"
import { useLocation, useNavigate } from "react-router"
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddIcon from '@mui/icons-material/Add';
import bus from '../../assets/images/appmenu/pink/bus.svg'
import { ACCEPT_TERMS_REQUEST, COMMENTS, CONTINUE_TO_CREATE, CREATE_RIDE, CREATE_RIDE_2, DESTINATION_POINT, FILL_ALL_FIELDS, FULL_NAME, LEAVE_HOUR, PASSENGERS, PHONE_NUMBER, RETURN_HOUR, RETURN_HOUR_2, RETURN_POINT, RIDE_DATE, SIDE, STARTING_POINT, STARTING_POINT_SINGLE, TERMS_OF_USE } from "../../settings/strings"
import { useLanguage } from "../../context/Language"
import { FormControl, TextField, Stack, Button } from "@mui/material"
import { HtmlTooltip } from "../utilityComponents/HtmlTooltip"
import { submitButton, textFieldStyle } from "../../settings/styles"
import { ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_PINK, SECONDARY_WHITE } from "../../settings/colors"
import { makeStyles } from "@mui/styles"
import { dateStringFromDate, reverseDate, unReverseDate } from "../utilityComponents/functions"
import Spacer from "../utilityComponents/Spacer"
import { getCurrentDate } from "../../utilities"
import { useHeaderBackgroundExtension } from "../../context/HeaderContext"
import Places from "../utilityComponents/Places"



export default function CreateRide() {


    const { lang } = useLanguage()
    const { firebase, appUser } = useFirebase()
    const { doLoad, cancelLoad, openDialog, closeDialog } = useLoading()
    const [termsOfUser, setTermsOfUse] = useState<boolean>(false)

    const [ride, setRide] = useState<PNPExplicitPrivateRide>({
        rideId: '',
        customerName: 'null',
        customerPhone: 'null',
        backPoint: 'null',
        rideStartingPoint: 'null',
        extraStopPoints: [],
        extraStopPointsBack: [],
        backTime: 'null',
        rideTime: '00:00',
        passengers: 'null',
        date: dateStringFromDate(getCurrentDate()),
        comments: 'null'
    })
    
    const [mandatory, setMandatory] = useState<{ [id: number]: string }>({
        1: '',
        3: '',
        4: '',
        5: '',
        6: '',
    })

    const handleTermsOfUseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTermsOfUse(e.target.checked)
    }

    const updateRideName = (name: string) => {
        setRide({ ...ride, ...{ customerName: name } })
    }
    const updateRidePhone = (phone: string) => {
        setRide({ ...ride, ...{ customerPhone: phone } })
    }
    const updateRideBackpoint = (backPoint: string) => {
        setRide({ ...ride, ...{ backPoint: backPoint } })
    }
    const updateRideDestinations = (destination: string) => {
        setRide({ ...ride, ...{ extraStopPoints: [...ride.extraStopPoints, destination] } })
    }
    const updateRideBackDestinations = (destination: string) => {
        setRide({ ...ride, ...{ extraStopPointsBack: [...ride.extraStopPointsBack, destination] } })
    }
    const updateRideStartingPoint = (startingPoint: string) => {
        setRide({ ...ride, ...{ rideStartingPoint: startingPoint } })
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
    const { hideHeader, showHeader } = useHeaderBackgroundExtension()

    useEffect(() => {
        hideHeader()
        return () => showHeader()
    }, [])
    const nav = useNavigate()
    const useStyles = makeStyles(() => textFieldStyle(PRIMARY_BLACK, { background: 'white', direction: SIDE(lang), width: '130px', maxHeight: '30px', alignSelf: 'center', fontSize: '12px', borderRadius: '10px' }));
    const classes = useStyles()
    const transformNull = (s: string) => s === 'null' ? '' : s
    const labelStyle = { padding: '0px', margin: '0px', fontSize: '14px', color: SECONDARY_WHITE }
    function createRide() {
        function isAllFieldsValid() {
            let allFieldValids = true
            mandatory && Object.entries(mandatory).forEach(entry => {
                if (!entry[1] || entry[1].length < 1) {
                    let el = ($("#arm_2" + entry[0]).children() as any).prevObject
                    el.css({ 'border': '2px solid red', 'borderRadius': '11px', height: '0px', padding: '14px', width: '130px' })
                    allFieldValids = false
                    console.log(entry[1])
                }
            })
            return allFieldValids
        }
        const valid = isAllFieldsValid()

        if (!valid || ride.extraStopPoints.length < 1) {
            alert(lang === 'heb' ? "יש למלא את כל השדות ולבחור לפחות נקודת עצירה אחת" : 'Please fill all the fields and pick at least 1 stop point')
            return
        }
        const send = {
            request: ride,
            credentials: { key: "N_O_R_M_M_A_C_D_O_N_A_L_D" },
        }

        if (ride.backPoint === 'null' || ride.backPoint.length < 1)
            ride.backPoint = 'ללא'

        if (ride.backTime === 'null' || ride.backTime.length < 1)
            ride.backTime = 'ללא'

        doLoad()
        axios.post('https://nadavsolutions.com/gserver/sendSMS/', send).catch(e => { })
        firebase.realTime.addPrivateRideExplicit(ride)
            .then(() => {
                cancelLoad()
                nav('/')
                alert('בקשה לנסיעה חדשה נשלחה בהצלחה, הצוות שלנו ייצור עמך קשר בהקדם')
            }).catch(() => {
                cancelLoad()
                alert('אירעתה שגיאה בשליחת הבקשה להסעה, אנא נסא שוב מאוחר יותר')
            })
    }

    const labelHeaderStyle = { color: 'white', fontSize: '22px' } as CSSProperties
    const iconStyle = { width: '32px', height: '32px' } as CSSProperties
    const [confirmation, setConfirmation] = useState<JSX.Element | undefined>()

    type FormFieldProps = {
        type: 'number' | 'text' | 'date' | 'time',
        id: number,
        prop: string,
        initialValue: any,
        action: (val: any) => void,
        name: string
        mandatory: boolean
        style?: CSSProperties
    }






    const openAddStopDialog = (back: boolean) => {
        let selectedRide = ""
        openDialog({
            content: <Stack>
                <Places value={''} handleAddressSelect={(selected: any) => selectedRide = selected} types={['address']} className='ride_request_places' id={'ride_request_places'} fixed={false} placeHolder={lang === 'heb' ? 'בחר נקודת יציאה' : 'Choose starting point'} style={{ ...{ padding: '0px', margin: '0px', width: '100%', color: SECONDARY_WHITE, background: 'none' }, ...{ cursor: 'pointer' } }} />
                <Button
                    onClick={() => {
                        if (!back) updateRideDestinations(selectedRide)
                        else updateRideBackDestinations(selectedRide)
                        closeDialog()
                    }}
                    style={{ ...submitButton(4), ...{ textTransform: 'none', maxHeight: '30px', background: PRIMARY_PINK } }}>
                    {lang === 'heb' ? 'בחר' : 'Select'}
                </Button>
            </Stack>
        })
    }

    const AddStopPointBtn = (props: { back: boolean }) => {
        return <Button
            onClick={() => openAddStopDialog(props.back)}
            style={{
                ...submitButton(4),
                background: 'transparent',
                border: '1px dashed white',
                letterSpacing: '4px',
                fontSize: '12px',
                maxWidth: '300px',
                width: '100%',
                borderRadius: '24px',
            }}>
            {lang === 'heb' ? 'הוסף נקודת עצירה' : 'Add Stop point'}
            <AddIcon style={{ transform: 'translateX(20px)' }} />
        </Button>
    }


    return <PageHolder>
        <img src={bus} style={iconStyle} />
        <label style={labelHeaderStyle}>{CREATE_RIDE_2(lang)}</label>
        <InnerPageHolder style={{ background: 'none', border: '.8px solid gray' }}>
            {!confirmation ? <Stack spacing={2} style={{ width: '300px' }} alignItems={'center'} justifyContent={'center'}>

                <Stack spacing={0.5} key={FULL_NAME(lang)}>
                    <label style={labelStyle}>{FULL_NAME(lang)}</label>
                    <TextField
                        type={'text'}
                        id={`arm_2${1}`}
                        onChange={(e) => {
                            updateRideName(e.target.value)
                            setMandatory({ ...mandatory, ...{ 1: e.target.value } })
                            $(`#arm_2${1}`).css('border', 'none')

                        }}
                        value={ride.customerName === 'null' ? '' : ride.customerName}
                        placeholder={FULL_NAME(lang)}
                        classes={classes} />
                </Stack>


                <Stack spacing={0.5} key={PHONE_NUMBER(lang)}>
                    <label style={labelStyle}>{PHONE_NUMBER(lang)}</label>
                    <TextField
                        type={'number'}
                        id={`arm_2${2}`}
                        value={ride.customerPhone === 'null' ? '' : ride.customerPhone}
                        onChange={(e) => {
                            updateRidePhone(e.target.value)
                            setMandatory({ ...mandatory, ...{ 2: e.target.value } })
                            $(`#arm_2${2}`).css('border', 'none')
                        }}
                        placeholder={PHONE_NUMBER(lang)}
                        classes={classes} />
                </Stack>

                <Stack direction={'row'} spacing={1}>


                    <Stack spacing={0.5} key={PASSENGERS(lang)}>
                        <label style={labelStyle}>{PASSENGERS(lang)}</label>
                        <TextField
                            type={'number'}
                            id={`arm_2${3}`}
                            onChange={(e) => {
                                updateRidePassengers(e.target.value)
                                setMandatory({ ...mandatory, ...{ 3: e.target.value } })
                                $(`#arm_2${3}`).css('border', 'none')

                            }}
                            value={ride.passengers === 'null' ? '' : ride.passengers}
                            placeholder={PASSENGERS(lang)}
                            classes={classes} />
                    </Stack>



                    <Stack spacing={0.5} key={RIDE_DATE(lang)}>
                        <label style={labelStyle}>{RIDE_DATE(lang)}</label>
                        <TextField
                            type={'date'}
                            id={`arm_2${4}`}
                            value={unReverseDate(ride.date)}
                            onChange={(e) => {
                                updateRideDate(e.target.value)
                                setMandatory({ ...mandatory, ...{ 4: e.target.value } })
                                $(`#arm_2${4}`).css('border', 'none')

                            }}
                            placeholder={RIDE_DATE(lang)}
                            classes={classes} />
                    </Stack>
                </Stack>
                <Stack>
                    <Stack direction={'row'} spacing={1}>


                        <Stack spacing={0.5} key={LEAVE_HOUR(lang)}>
                            <label style={labelStyle}>{LEAVE_HOUR(lang)}</label>
                            <TextField
                                type={'time'}
                                id={`arm_2${5}`}
                                value={ride.rideTime}
                                onChange={(e) => {
                                    updateRideTime(e.target.value)
                                    setMandatory({ ...mandatory, ...{ 5: e.target.value } })
                                    $(`#arm_2${5}`).css('border', 'none')

                                }}
                                placeholder={LEAVE_HOUR(lang)}
                                classes={classes} />
                        </Stack>




                        <Stack spacing={0.5} key={STARTING_POINT_SINGLE(lang)}>
                            <label style={labelStyle}>{STARTING_POINT_SINGLE(lang)}</label>
                            <TextField
                                type={'text'}
                                onChange={(e) => {
                                    updateRideStartingPoint(e.target.value)
                                    setMandatory({ ...mandatory, ...{ 6: e.target.value } })
                                    $(`#arm_2${6}`).css('border', 'none')

                                }}
                                id={`arm_2${6}`}
                                value={ride.rideStartingPoint === 'null' ? '' : ride.rideStartingPoint}
                                placeholder={STARTING_POINT_SINGLE(lang)}
                                classes={classes} />
                        </Stack>
                    </Stack>
                    <AddStopPointBtn back={false} />
                </Stack>

                {ride && ride.extraStopPoints && ride.extraStopPoints.length > 0 &&
                    <Stack spacing={0.5} maxWidth={'300px'} alignItems={'flex-start'} justifyContent={'flex-start'} style={{ direction: SIDE(lang) }}>
                        {ride.extraStopPoints.map((startPoint: any, index) => {
                            return <Stack key={startPoint + index} direction={'row'} spacing={2} maxWidth={'300px'} alignItems={'flex-start'}>
                                <HighlightOffIcon onClick={() => {
                                    let copy = Object.assign({}, ride)
                                    copy.extraStopPoints.splice(index, 1)
                                    setRide(copy)
                                }} style={{ width: '20px', height: '20px', cursor: 'pointer', color: '#bd3333', transform: 'translateX(10px)' }} />
                                <label style={labelStyle}>{lang === 'heb' ? `תחנה ${index + 1}: ` + startPoint : `Stop point ${index + 1}: ` + startPoint}</label>
                            </Stack>
                        })}</Stack>}
                <Stack>
                    <Stack direction={'row'} spacing={1}>


                        <Stack spacing={0.5} key={RETURN_HOUR_2(lang)}>
                            <label style={labelStyle}>{RETURN_HOUR_2(lang)}</label>
                            <TextField
                                type={'time'}
                                value={ride.backTime}
                                onChange={(e) => {
                                    updateBackTime(e.target.value)
                                }}
                                placeholder={RETURN_HOUR_2(lang)}
                                classes={classes} />
                        </Stack>


                        <Stack spacing={0.5} key={RETURN_POINT(lang)}>
                            <label style={labelStyle}>{RETURN_POINT(lang)}</label>
                            <TextField
                                type={'text'}
                                value={ride.backPoint === 'null' ? '' : ride.backPoint}
                                onChange={(e) => {
                                    updateRideBackpoint(e.target.value)
                                }}
                                placeholder={RETURN_POINT(lang)}
                                classes={classes} />
                        </Stack>
                    </Stack>
                    <AddStopPointBtn back={true} />
                </Stack>

                {ride && ride.extraStopPointsBack && ride.extraStopPointsBack.length > 0 &&
                    <Stack spacing={0.5} maxWidth={'300px'} alignItems={'flex-start'} justifyContent={'flex-start'} style={{ direction: SIDE(lang) }}>
                        {ride.extraStopPointsBack.map((startPoint: any, index) => {
                            return <Stack key={startPoint + index + 8000} direction={'row'} spacing={2} maxWidth={'300px'} alignItems={'flex-start'}>
                                <HighlightOffIcon onClick={() => {
                                    let copy = Object.assign({}, ride)
                                    copy.extraStopPointsBack.splice(index, 1)
                                    setRide(copy)
                                }} style={{ width: '20px', height: '20px', cursor: 'pointer', color: '#bd3333', transform: 'translateX(10px)' }} />
                                <label style={labelStyle}>{lang === 'heb' ? `תחנה ${index + 1}: ` + startPoint : `Stop point ${index + 1}: ` + startPoint}</label>
                            </Stack>
                        })}</Stack>}
                <Stack spacing={0.5} key={COMMENTS(lang)}>
                    <label style={labelStyle}>{COMMENTS(lang)}</label>
                    <TextField
                        type={'text'}
                        value={ride.comments === 'null' ? '' : ride.comments}
                        onChange={(e) => {
                            updateRideComments(e.target.value)
                        }}
                        placeholder={COMMENTS(lang)}
                        classes={classes} />
                </Stack>
                <Button
                    onClick={createRide}
                    style={{ ...submitButton(4), maxHeight: '30px', textTransform: 'none' }}>
                    {lang === 'heb' ? 'שליחה' : 'Send'}
                </Button>
            </Stack> : null}
        </InnerPageHolder>
    </PageHolder >
}
