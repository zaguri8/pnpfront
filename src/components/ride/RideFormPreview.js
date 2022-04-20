import { RideFormItem } from "./RideFormItem";
import '../../App.css'
import $ from 'jquery'
import { useLayoutEffect } from "react";
import { FormElementType } from "./RideFormItem";
import { useState } from "react";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { DARKER_BLACK_SELECTED, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import { useLoading } from "../../context/Loading";
import { Stack, Button } from '@mui/material'
import { COMMENTS, CONTINUE, CREATE_RIDE, CREATE_RIDE_INFO, DESTINATION_POINT, PASSENGERS, SIDE, STARTING_POINT_SINGLE } from "../../settings/strings";
import { useLanguage } from "../../context/Language";
import { useNavigate } from "react-router";
import { HtmlTooltip } from "../utilities/HtmlTooltip";




export function RideFormPreview() {

    const { lang } = useLanguage()
    const { openDialog, closeDialog, isDialogOpened } = useLoading()
    const nav = useNavigate()
    function FormHeader() {

        return (<div id='form_header' style={{
            margin: lang === 'heb' ? '4px' : '8px',
            fontSize: lang === 'heb' ? '18px' : '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            columnGap: '16px',
            color: 'whitesmoke'
        }}>

            <InfoRoundedIcon
                onClick={() => {
                    openDialog({
                        content: <Stack style = {{padding:'12px'}}> <span style={{ color: SECONDARY_WHITE }}>{CREATE_RIDE_INFO(lang)}</span><Button

                            onClick={() => {
                                nav('/createride', { state: ride })
                                closeDialog()
                            }}
                            style={{textTransform:'none', fontFamily: 'Open Sans Hebrew', margin: '16px', fontWeight: 'bold', background: DARK_BLACK, color: SECONDARY_WHITE, width: '75%', alignSelf: 'center' }}
                        >
                            {lang === 'heb' ? 'המשך ליצירת הסעה' : 'Continue to ride creation'}
                        </Button></Stack>
                    })
                }}
                style={{ width: '17px', height: '17px' }} /></div>);
    }


    const formstyle = {
        overflow: 'hidden',
        justifyContent: 'center',
        position: 'relative',

        marginTop: '0px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row'
    }
    const [ride, setRide] = useState({
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
    const updateRideComments = (comments) => {
        setRide({ ...ride, ...{ comments: comments } })
    }
    const updateRideDestination = (destination) => {
        setRide({ ...ride, ...{ rideDestination: destination } })
    }
    const updateRideStartingPoint = (startingPoint) => {
        setRide({ ...ride, ...{ rideStartingPoint: startingPoint } })
    }
    const updateRidePassengers = (passengers) => {
        setRide({ ...ride, ...{ passengers: passengers } })
    }
    function resize() {
        const windowWidth = window.outerWidth
        if (windowWidth < 800) {
            // $('#ride_form').css('padding', '8px')
            // $('#ride_form').css('marginTop', '0px')
            // $('#ride_form').css('marginBottom', '0px')
            // $('#dest_start_input').css('flexDirection', 'column')
            // $('#dest_start_input').css('width', '100%')
            // $('#form_item_1').css('width', '100%')
            // $('#form_item_5').css('width', '35%')
            // $('#form_item_2').css('width', '100%')
            // $('#form_header').css('maxWidth', '100%')
            $('#form_item_5').css({'width':'100%'})
        } else {
            $('#form_item_5').css('width','80%')
            // $('#ride_form').css('padding', '32px')
            // $('#dest_start_input').css('flexDirection', 'row')
            // $('#dest_start_input').css('width', 'auto')
            // $('#form_item_5').css('width', '100%')
            // $('#form_header').css('maxWidth', '50px')
        }
    }
    useLayoutEffect(() => {
        // Change ride form for small screen
        window.addEventListener('resize', resize)
        resize()

        return () => { window.removeEventListener('resize', resize) }
    })
    return <div dir={SIDE(lang)} style={formstyle}>
        <div id='ride_form' style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50%',
            marginTop: '16px',
            height: 'auto',
        }}>

            <FormHeader />
            {/* <div id='dest_start_input' style={{
                columnGap: '8px',
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <RideFormItem
                    placeSelectedHandler={updateRideDestination}
                    id='form_item_1' style={{}} elem={FormElementType.place} text={DESTINATION_POINT(lang)} type={'text'} />
                <br />
                <RideFormItem
                    placeSelectedHandler={updateRideStartingPoint}
                    id='form_item_2' style={{}} elem={FormElementType.place} text={STARTING_POINT_SINGLE(lang)} type={'text'} />

            </div>
            <div style={{
                columnGap: '8px',
                display: 'flex',
                justifyContent: 'center',
                maxHeight: '50px'
            }}>

                <RideFormItem
                    action={(e) => { updateRidePassengers($(e.target).val()) }}
                    id='form_item_3'
                    style={{ width: '50%', border: 'none' }} elem={FormElementType.input} text={PASSENGERS(lang)} type={'number'} />

                <RideFormItem
                    action={(e) => {
                        updateRideComments($(e.target).val())
                    }} id='form_item_4' style={{ width: '50%', border: 'none' }} elem={FormElementType.input} text={COMMENTS(lang)} type='text' />
            </div> */}


            <RideFormItem actionButton={() => {
                nav('/createride', { state: ride })
            }} id='form_item_5' style={{ textTransform: 'none', width: '100%', fontWeight: 'bold', fontSize: '22px', borderRadius: '8px', background: DARKER_BLACK_SELECTED, border: '1px solid white', color: 'white' }} elem={FormElementType.button} text={lang === 'heb' ? 'צור הסעה' : 'Create ride'} type={'text'} />

        </div>
    </div>
}