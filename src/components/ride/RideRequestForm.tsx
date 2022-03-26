import { Stack, FormControl, Button, TextField } from "@mui/material";
import { useLanguage } from "../../context/Language";
import { FILL_ALL_FIELDS, FULL_NAME, PASSENGERS, PHONE_NUMBER, SIDE, STARTING_POINT_SINGLE } from "../../settings/strings";
import { makeStyles } from "@mui/styles";
import { PNPEvent, PNPRideRequest } from "../../store/external/types";
import { useFirebase } from "../../context/Firebase";
import Places from "../utilities/Places";
import { HtmlTooltip } from "../utilities/HtmlTooltip";
import { useState } from "react";
import { submitButton } from "../../settings/styles";
import { useLoading } from "../../context/Loading";
import { PRIMARY_WHITE, SECONDARY_WHITE } from "../../settings/colors";

export default function RideRequestForm(props: { event: PNPEvent | undefined | null }) {
    const { lang } = useLanguage()
    const { appUser, user, firebase } = useFirebase()



    const { doLoad, cancelLoad, closeDialog, isLoading } = useLoading()
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

    const useStyles = makeStyles(() => ({
        root: {
            "& .MuiOutlinedInput-root": {
                background: "none",
                borderRadius: '32px',
                padding:'0px',
                border:'.1px solid white',
                color:PRIMARY_WHITE
            }
        }, noBorder: {
            border: "1px solid red",
            outline: 'none'
        }
    }));
    const classes = useStyles()
    return <Stack spacing={3} sx={{ width: '80%', padding: '16px' }}>
        <label style = {{color:SECONDARY_WHITE}}>{lang === 'heb' ? `בקשת פתיחת הסעה לאירוע : ${props.event?.eventName ?? ''}` : ` Request a ride for event:  ${props.event?.eventName ?? ''}`}</label>
        <FormControl>
            <label style = {{color:SECONDARY_WHITE}}>{FULL_NAME(lang)}</label>
            <TextField
                className={classes.root}
           
                onChange={(e) => setFullName(e.target.value)}
                placeholder={appUser?.name ?? ''} name="name" sx={{ direction: SIDE(lang) }} id="fn_input_ride_request" aria-describedby="fn_input_ride_request" />

        </FormControl>
        <FormControl>

        <label style = {{color:SECONDARY_WHITE}}>{PHONE_NUMBER(lang)}</label>
            <TextField
                className={classes.root}
          
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={appUser?.phone ?? ''} type='number' name='phone' sx={{ direction: SIDE(lang) }} id="phone_number_input_ride_request" aria-describedby="phone_number_helper_text" />

        </FormControl>
        <FormControl>
        <label style = {{color:SECONDARY_WHITE}}>{PASSENGERS(lang)}</label>
            <TextField
                className={classes.root}
             
                onChange={(e) => setPassengers(e.target.value)}
                placeholder={PASSENGERS(lang)} sx={{ direction: SIDE(lang) }} type='number' id="passenger_input_0" aria-describedby="passenger_input_0" />

        </FormControl>


        <label style = {{color:PRIMARY_WHITE}}>{lang === 'heb' ? 'הכנס שמות מלאים של כל הנוסעים, מופרדים בפסיק' : 'Enter full names of passenger seperated by comma'}</label>
        <FormControl>

            <TextField
                className={classes.root}
              
                onChange={(e) => setNames(e.target.value)}
                placeholder={lang === 'heb' ? 'שמות הנוסעים' : 'Passenger names'} sx={{ direction: SIDE(lang) }} type='text' id="passengers_input" aria-describedby="passengers_helper_text" />
        </FormControl>

        <FormControl>
        <label style = {{color:SECONDARY_WHITE}}>{STARTING_POINT_SINGLE(lang)}</label>
            <Places value={request.startingPoint} handleAddressSelect={setStartingPoint} types={['address']} className='ride_request_places' id={'ride_request_places'} fixed={false} placeHolder={lang === 'heb' ? 'בחר נקודת יציאה' : 'Choose starting point'} style={{ ...{ padding: '0px', margin: '0px', width: '100%' ,color:PRIMARY_WHITE}, ...{ cursor: 'pointer' } }} />
        </FormControl>
        <FormControl>
            <HtmlTooltip sx={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} title={!validateRequest() ? FILL_ALL_FIELDS(lang) : (lang === 'heb' ? 'צור ביקוש' : 'Create ride Request')} arrow>
                <span>
                    <Button
                        onClick={() => {
                            if (isLoading) return
                            const ride: PNPRideRequest = {
                                ...request,
                                eventId: props.event?.eventId ?? '',
                                requestUserId: user?.uid ?? '',
                                eventName: props.event?.eventName ?? ''
                            }
                            doLoad()
                            firebase.realTime.addRideRequest(ride)
                                .then(r => {
                                    alert(lang === 'heb' ? `בקשת התקבלה, הצוות שלנו ייצור עמך קשר בהקדם` : 'We got your request, our team will contact you in the next 24 hours')
                                    closeDialog()
                                    cancelLoad()
                                }).catch(e => {
                                    alert(lang === 'heb' ? 'הייתה בעיה ביצירת הביקוש, אנא נסה שוב מאוחר יותר' : 'There was a problem making a request, please try again later')
                                    closeDialog()
                                    cancelLoad()
                                })
                        }}
                        sx={{ ...submitButton(false), ... { margin: '0px', padding: '8px', width: lang === 'heb' ? '50%' : '80%' } }} disabled={!validateRequest()}>
                        {lang === 'heb' ? 'צור ביקוש' : 'Create ride Request'}
                    </Button>
                </span>
            </HtmlTooltip>
        </FormControl>
    </Stack>
}