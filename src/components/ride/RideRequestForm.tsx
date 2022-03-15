import { Stack, FormControl, Button, InputLabel, Input, TextField } from "@mui/material";
import { useLanguage } from "../../context/Language";
import { CONTINUE_TO_CREATE, FILL_ALL_FIELDS, FULL_NAME, PASSENGERS, PHONE_NUMBER, SIDE, STARTING_POINT } from "../../settings/strings";
import { makeStyles } from "@mui/styles";
import { PNPEvent, PNPRideRequest } from "../../store/external/types";
import { useFirebase } from "../../context/Firebase";
import Places from "../utilities/Places";
import { HtmlTooltip } from "../utilities/HtmlTooltip";
import { useState } from "react";
import { submitButton } from "../../settings/styles";
import { useLoading } from "../../context/Loading";

export default function RideRequestForm(props: { event: PNPEvent | undefined | null }) {
    const { lang } = useLanguage()
    const { appUser, user, firebase } = useFirebase()



    const { doLoad, cancelLoad, closeDialog } = useLoading()
    const [request, setRequest] = useState<{
        names: string[],
        startingPoint: string,
        fullName: string,
        passengers: string,
        phoneNumber: string
    }>({
        names: [],
        startingPoint: '',
        fullName: '',
        passengers: '',
        phoneNumber: '',

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
    return <Stack spacing={3} sx={{ width: '80%', padding: '16px' }}>
        <label>{lang === 'heb' ? `בקשת פתיחת הסעה לאירוע : ${props.event?.eventName ?? ''}` : ` Request a ride for event:  ${props.event?.eventName ?? ''}`}</label>
        <FormControl>
            <TextField
                onChange={(e) => setFullName(e.target.value)}
                placeholder={appUser?.name ?? ''} name="name" sx={{ direction: SIDE(lang) }} id="fn_input_ride_request" aria-describedby="fn_input_ride_request" />

        </FormControl>
        <FormControl>

            <TextField
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={appUser?.phone ?? ''} type='number' name='phone' sx={{ direction: SIDE(lang) }} id="phone_number_input_ride_request" aria-describedby="phone_number_helper_text" />

        </FormControl>
        <FormControl>
            <TextField
                onChange={(e) => setPassengers(e.target.value)}
                placeholder={PASSENGERS(lang)} sx={{ direction: SIDE(lang) }} type='number' id="passenger_input_0" aria-describedby="passenger_input_0" />

        </FormControl>


        <label>{lang === 'heb' ? 'הכנס שמות מלאים של כל הנוסעים, מופרדים בפסיק' : 'Enter full names of passenger seperated by comma'}</label>
        <FormControl>

            <TextField
                onChange={(e) => setNames(e.target.value)}
                placeholder={lang === 'heb' ? 'שמות נוסעים' : 'Passenger names'} sx={{ direction: SIDE(lang) }} type='text' id="passengers_input" aria-describedby="passengers_helper_text" />
        </FormControl>

        <FormControl>

            <Places value={setStartingPoint} handleAddressSelect={() => { }} types={['address']} className='ride_request_places' id={'ride_request_places'} fixed={false} placeHolder={lang === 'heb' ? 'בחר נקודת יציאה' : 'Choose starting point'} style={{ ...{ padding: '0px', margin: '0px', width: '100%' }, ...{ cursor: 'pointer' } }} />
        </FormControl>
        <FormControl>
            <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!validateRequest() ? FILL_ALL_FIELDS(lang) : (lang === 'heb' ? 'צור ביקוש' : 'Create ride Request')} arrow>
                <span>
                    <Button

                        onClick={() => {
                            let ride: PNPRideRequest = {
                                ...request,
                                eventId: props.event?.eventId ?? '',
                                requestUserId: user?.uid ?? '',
                                eventName: props.event?.eventName ?? ''
                            }
                            doLoad()
                            firebase.realTime.addRideRequest(ride)
                                .then(r => {
                                    closeDialog()
                                    alert(lang === 'heb' ? `בקשת התקבלה, הצוות שלנו ייצור עמך קשר בהקדם` : 'We got your request, our team will contact you in the next 24 hours')
                                }).catch(e => {
                                    closeDialog()
                                    alert(lang === 'heb' ? 'הייתה בעיה ביצירת הביקוש, אנא נסה שוב מאוחר יותר' : 'There was a problem making a request, please try again later')
                                })
                        }}
                        sx={{ ...submitButton(false), ... { margin: '0px', padding: '8px',width:lang === 'heb' ? '50%' : '80%' } }} disabled={!validateRequest()}>
                        {lang === 'heb' ? 'צור ביקוש' : 'Create ride Request'}
                    </Button>
                </span>
            </HtmlTooltip>
        </FormControl>
    </Stack>
}