import { Stack, FormControl, Button, TextField } from "@mui/material";
import { FILL_ALL_FIELDS, FULL_NAME, PASSENGERS, PHONE_NUMBER, SIDE, STARTING_POINT_SINGLE } from "../../settings/strings";
import { makeStyles } from "@mui/styles";
import { PNPEvent, PNPRideRequest } from "../../store/external/types";
import Places from "../utilityComponents/Places";
import { HtmlTooltip } from "../utilityComponents/HtmlTooltip";
import { useState } from "react";
import { submitButton } from "../../settings/styles";
import { PRIMARY_BLACK, PRIMARY_PINK, PRIMARY_WHITE, SECONDARY_WHITE } from "../../settings/colors";
import { CommonHooks, withHookGroup } from "../generics/withHooks";
import { Hooks } from "../generics/types";
import { StoreSingleton } from "../../store/external";

type RideRequestFormProps = { event: PNPEvent | undefined | null }
function RideRequestForm(props: RideRequestFormProps & Hooks) {

    const [request, setRequest] = useState<{
        names: string[],
        startingPoint: string,
        fullName: string,
        passengers: string,
        phoneNumber: string
    }>({
        names: [],
        startingPoint: '',
        fullName: props.user.appUser ? props.user.appUser.name : '',
        passengers: '',
        phoneNumber: (props.user.appUser && props.user.appUser.phone) ? props.user.appUser.phone : '',

    })

    const setPassengers = (passengers: string) => {
        setRequest({
            ...request,
            passengers: passengers
        })
    }
    const setFullName = (fullName: string) => {
        setRequest({
            ...request,
            fullName: fullName
        })
    }


    const setStartingPoint = (sp: string) => {
        setRequest({
            ...request,
            startingPoint: sp
        })
    }

    const setPhoneNumber = (pn: string) => {
        setRequest({
            ...request,
            phoneNumber: pn
        })
    }
    const setNames = (names: string) => {
        setRequest({
            ...request,
            names: names.split(',')
        })
    }


    const validateRequest = () => {
        return request.names.length > 0
            && request.startingPoint.length > 0
            && request.phoneNumber.length > 0
            && request.passengers.length > 0

    }

    const useStyles = makeStyles(() => ({
        root: {
            "& .MuiOutlinedInput-root": {
                background: "none",
                borderRadius: '32px',
                padding: '0px',
                border: '.1px solid white',
                color: PRIMARY_WHITE
            }
        }, noBorder: {
            border: "1px solid red",
            outline: 'none'
        }
    }));
    const classes = useStyles()
    return <Stack spacing={3} sx={{ width: '80%', padding: '16px' }}>
        <label style={{ color: PRIMARY_PINK }}>{props.language.lang === 'heb' ? `בקשת פתיחת הסעה לאירוע : ${props.event?.eventName ?? ''}` : ` Request a ride for event:  ${props.event?.eventName ?? ''}`}</label>
        <FormControl>
            <label style={{ color: PRIMARY_PINK }}>{FULL_NAME(props.language.lang)}</label>
            <TextField
                className={classes.root}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={props.user.appUser?.name ?? ''}
                name="name" sx={{ direction: SIDE(props.language.lang) }} id="fn_input_ride_request" aria-describedby="fn_input_ride_request" />

        </FormControl>
        <FormControl>

            <label style={{ color: PRIMARY_PINK }}>{PHONE_NUMBER(props.language.lang)}</label>
            <TextField
                className={classes.root}

                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={props.user.appUser?.phone ?? ''} type='number' name='phone' sx={{ direction: SIDE(props.language.lang) }} id="phone_number_input_ride_request" aria-describedby="phone_number_helper_text" />

        </FormControl>
        <FormControl>
            <label style={{ color: PRIMARY_PINK }}>{PASSENGERS(props.language.lang)}</label>
            <TextField
                className={classes.root}

                onChange={(e) => setPassengers(e.target.value)}
                placeholder={PASSENGERS(props.language.lang)} sx={{ direction: SIDE(props.language.lang) }} type='number' id="passenger_input_0" aria-describedby="passenger_input_0" />

        </FormControl>


        <label style={{ color: PRIMARY_WHITE }}>{props.language.lang === 'heb' ? 'הכנס שמות מלאים של כל הנוסעים, מופרדים בפסיק' : 'Enter full names of passenger seperated by comma'}</label>
        <FormControl>

            <TextField
                className={classes.root}

                onChange={(e) => setNames(e.target.value)}
                placeholder={props.language.lang === 'heb' ? 'שמות הנוסעים' : 'Passenger names'} sx={{ direction: SIDE(props.language.lang) }} type='text' id="passengers_input" aria-describedby="passengers_helper_text" />
        </FormControl>

        <FormControl>
            <label style={{ color: PRIMARY_PINK }}>{STARTING_POINT_SINGLE(props.language.lang)}</label>
            <Places value={request.startingPoint} handleAddressSelect={setStartingPoint} types={['address']} className='ride_request_places' id={'ride_request_places'} fixed={false} placeHolder={props.language.lang === 'heb' ? 'בחר נקודת יציאה' : 'Choose starting point'} style={{ ...{ padding: '0px', margin: '0px', width: '100%', color: PRIMARY_BLACK }, ...{ cursor: 'pointer' } }} />
        </FormControl>
        <FormControl>
            <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!validateRequest() ? FILL_ALL_FIELDS(props.language.lang) : (props.language.lang === 'heb' ? 'צור ביקוש' : 'Create ride Request')} arrow>
                <span>
                    <Button
                        onClick={() => {
                            const ride: PNPRideRequest = {
                                ...request,
                                eventId: props.event?.eventId ?? '',
                                requestUserId: props.user.user?.uid ?? '',
                                eventName: props.event?.eventName ?? ''
                            }
                            props.loading.doLoad()
                            StoreSingleton.getTools().realTime.addRideRequest(ride)
                                .then(r => {
                                    alert(props.language.lang === 'heb' ? `בקשת התקבלה, הצוות שלנו ייצור עמך קשר בהקדם` : 'We got your request, our team will contact you in the next 24 hours')
                                    props.loading.closeDialog()
                                    props.loading.cancelLoad()
                                }).catch(e => {
                                    alert(props.language.lang === 'heb' ? 'הייתה בעיה ביצירת הביקוש, אנא נסה שוב מאוחר יותר' : 'There was a problem making a request, please try again later')
                                    props.loading.closeDialog()
                                    props.loading.cancelLoad()
                                })
                        }}
                        sx={{ ...submitButton(false), ... { margin: '0px', textTransform: 'none', padding: '8px', width: props.language.lang === 'heb' ? '50%' : '80%' } }} disabled={!validateRequest() || props.loading.isLoading}>
                        {props.language.lang === 'heb' ? 'צור ביקוש' : 'Create Request'}
                    </Button>
                </span>
            </HtmlTooltip>
        </FormControl>
    </Stack>
}

export default withHookGroup<RideRequestFormProps>(RideRequestForm, CommonHooks)