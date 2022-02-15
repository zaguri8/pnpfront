import { boxShadow, flex } from "../styles";
import { RideFormItem } from "./RideFormItem";
import '../App.css'
import $ from 'jquery'
import { CSSProperties, useEffect, useLayoutEffect } from "react";
import { FormElementType } from "./RideFormItem";
import { colorPrimary, colorSecondary } from "../colors";
export function RideForm() {


    const formstyle: CSSProperties = {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white',
        marginBottom: '32px',
        display: 'flex',
        flexDirection: 'row'
    }

    useLayoutEffect(() => {
        function resize() {
            const windowWidth = window.outerWidth
            if (windowWidth < 726) {
                $('.ride_form_item').css({ 'borderRadius': '0px' })
                $('#ride_form').css('padding', '8px')
                $('#ride_form').css('marginTop', '0px')
                $('#ride_form').css('marginLeft', '0px')
                $('#ride_form').css('marginRight', '0px')
                $('#ride_form').css('marginBottom', '0px')
                $('#ride_form').css('flexDirection', 'column')
                $('#ride_form').css('borderRadius', '0px')
                $('#form_header').css('display', 'block')
            } else {
                $('.ride_form_item').css({ 'borderRadius': '16px' })
                $('#ride_form').css('borderRadius', '16px')
                $('#ride_form').css('marginTop', '32px')
                $('#ride_form').css('marginLeft', '16px')
                $('#ride_form').css('marginRight', '16px')
                $('#ride_form').css('marginBottom', '32px')
                $('#ride_form').css('padding', '32px')
                $('#ride_form').css('flexDirection', 'row')
            }

            if (windowWidth > 726 && windowWidth < 800) {
                $('#form_item_1').css('display', 'block')
                $('#form_item_2').css('display', 'block')
                $('#form_item_3').css('display', 'none')
                $('#form_header').css('display', 'none')
                $('#form_item_4').css('display', 'none')
                $('#form_header').css('display', 'none')
            } else if (windowWidth > 800 && windowWidth < 1000) {
                $('#form_item_1').css('display', 'block')
                $('#form_item_2').css('display', 'block')
                $('#form_item_3').css('display', 'block')
                $('#form_item_4').css('display', 'none')
                $('#form_header').css('display', 'none')
            }

            if (windowWidth < 560 || windowWidth >= 1000) {
                $('#form_item_1').css('display', 'block')
                $('#form_item_2').css('display', 'block')
                $('#form_item_3').css('display', 'block')
                $('#form_item_4').css('display', 'block')
            }
        }
        // Change ride form for small screen
        $(window).on('resize', resize)
        resize()
    }, [null])

    return <div dir="rtl" style={formstyle}>
        <div id='ride_form' style={{
            display: 'flex',
            background: colorSecondary,
            flexDirection: 'column',
            justifyContent: 'center',
            columnGap: '8px',
            margin: '0px',
            width: '100vw',
            height: 'auto',
            rowGap: '16px',
        }}>

            <h4 id='form_header' style={{ margin: '0px', color: 'whitesmoke' }}>היי, חפש הסעה ל</h4>
            <RideFormItem id='form_item_1' style={{}} elem={FormElementType.selector} options={["Tel Aviv", "Rosh pina"]} text={'בחר יעד'} type={'text'} />
            <RideFormItem id='form_item_2' style={{}} elem={FormElementType.selector} text={'נקודת יציאה'} options={["Tel Aviv", "Rosh pina"]} type={'text'} />
            <div style={{ columnGap: '8px', display: 'flex', justifyContent: 'center' }}>


                <RideFormItem id='form_item_3' style={{ width: '50%' }} elem={FormElementType.input} text={'מספר נוסעים'} type={'text'} />
                <RideFormItem id='form_item_4' style={{ width: '50%' }} elem={FormElementType.input} text={'שם'} type='text' />
            </div>
            <div>

                <RideFormItem id='form_item_5' style={{}} elem={FormElementType.button} text={'המשך'} type={'text'} />
            </div>
        </div>
    </div>
}