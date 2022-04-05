import { RideFormItem } from "./RideFormItem";
import '../../App.css'
import $ from 'jquery'
import { useLayoutEffect } from "react";
import { FormElementType } from "./RideFormItem";
import { useState } from "react";
import { DARKER_BLACK_SELECTED, DARK_BLACK, PRIMARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import { useLoading } from "../../context/Loading";

import { COMMENTS, CONTINUE, CREATE_RIDE, DESTINATION_POINT, PASSENGERS, SIDE, STARTING_POINT_SINGLE } from "../../settings/strings";
import { useLanguage } from "../../context/Language";
import { useNavigate } from "react-router";

function FormHeader() {
    const { lang } = useLanguage()
    return (<h4 id='form_header' style={{
        margin: '0px',
        fontSize: lang === 'heb' ? '18px' : '16px',
        maxHeight: lang === 'heb' ? 'inherit' : '10px',
        fontWeight: '600',
        maxWidth: '50px',
        padding: '8px',
        color: 'whitesmoke'
    }}>{CREATE_RIDE(lang)}</h4>);
}


export function RideFormPreview() {


    const nav = useNavigate()
    const formstyle = {
        overflow: 'hidden',
        justifyContent: 'center',
        position: 'relative',
        marginTop: '0px',
        alignItems: 'center',
        background: PRIMARY_BLACK,
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
    useLayoutEffect(() => {
        function resize() {
            const windowWidth = window.outerWidth
            if (windowWidth < 726) {
                $('#ride_form').css('padding', '8px')
                $('#ride_form').css('marginTop', '0px')
                $('#ride_form').css('marginBottom', '0px')
                $('#dest_start_input').css('flexDirection', 'column')
                $('#ride_form').css('flexDirection', 'column')
                $('#dest_start_input').css('width', '100%')
                $('#form_item_1').css('width', '100%')
                $('#form_item_5').css('width', '35%')
                $('#form_item_2').css('width', '100%')
                $('#form_header').css('maxWidth', 'inherit')
            } else {

                $('#ride_form').css('padding', '32px')
                $('#dest_start_input').css('flexDirection', 'row')
                $('#ride_form').css('flexDirection', 'row')
                $('#dest_start_input').css('width', 'auto')
                $('#form_item_5').css('width', '100%')
                $('#form_header').css('maxWidth', '50px')
            }
        }
        // Change ride form for small screen
        window.addEventListener('resize', resize)
        resize()

        return () => { window.removeEventListener('resize', resize) }
    }, [])


    const { lang } = useLanguage()
    const dialogContext = useLoading()

    return <div dir={SIDE(lang)} style={formstyle}>
        <div id='ride_form' style={{
            display: 'flex',
            backgroundImage: DARK_BLACK,
            flexDirection: 'column',
            justifyContent: 'center',
            columnGap: '8px',
            width: '100%',
            margin: '0px',
            height: 'auto',
            rowGap: '16px'
        }}>

            <FormHeader />
            <div id='dest_start_input' style={{
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
                    bgColorInput={SECONDARY_WHITE}
                    action={(e) => { updateRidePassengers($(e.target).val()) }}
                    id='form_item_3'
                    style={{ width: '50%' }} elem={FormElementType.input} text={PASSENGERS(lang)} type={'number'} />

                <RideFormItem
                    bgColorInput={SECONDARY_WHITE}
                    action={(e) => {
                        updateRideComments($(e.target).val())
                    }} id='form_item_4' style={{ width: '50%' }} elem={FormElementType.input} text={COMMENTS(lang)} type='text' />
            </div>

            <div>

                <RideFormItem actionButton={() => {
                    nav('/createride', { state: ride })
                }} id='form_item_5' style={{ textTransform: 'none', fontWeight: 'bold', fontSize: '22px', width: '50%', borderRadius: '8px', background: DARKER_BLACK_SELECTED, border: '1px solid white', color: 'white' }} elem={FormElementType.button} text={CONTINUE(lang)} type={'text'} />
            </div>
        </div>
    </div>
}