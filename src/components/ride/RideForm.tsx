import { RideFormItem } from "./RideFormItem";
import '../../App.css'
import $ from 'jquery'
import { CSSProperties, useLayoutEffect } from "react";
import { FormElementType } from "./RideFormItem";
import { ORANGE_GRADIENT_PRIMARY } from "../../settings/colors";
import { useLoading } from "../../context/Loading";
import { ListItem, TextField } from "@mui/material";
function FormHeader() {
    return (<h4 id='form_header' style={{
        margin: '0px',
        fontSize: '22px',
        fontWeight: '500',
        padding: '8px',
        color: 'whitesmoke'
    }}>צור הסעה</h4>);
}


export function RideForm() {


    const formstyle: CSSProperties = {
        overflow: 'hidden',
        justifyContent: 'center',

        alignItems: 'center',
        background: 'white',
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
                $('#ride_form').css('marginBottom', '0px')
                $('#ride_form').css('flexDirection', 'column')
                $('#form_header').css('display', 'block')
            } else {
                $('.ride_form_item').css({ 'borderRadius': '16px' })
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

            if (windowWidth < 726 || windowWidth >= 1000) {
                $('#form_item_1').css('display', 'block')
                $('#form_item_2').css('display', 'block')
                $('#form_item_3').css('display', 'block')
                $('#form_item_4').css('display', 'block')
                $('#form_header').css('display', 'block')
            }
        }
        // Change ride form for small screen
        $(window).on('resize', resize)
        resize()
    }, [])
    const dialogContext = useLoading()
    return <div dir="rtl" style={formstyle}>
        <div id='ride_form' style={{
            display: 'flex',
            backgroundImage: ORANGE_GRADIENT_PRIMARY,
            flexDirection: 'column',
            justifyContent: 'center',
            columnGap: '8px',
            margin: '0px',
            width: '100vw',
            height: 'auto',
            rowGap: '16px'
        }}>

            <FormHeader />
            <RideFormItem id='form_item_1' style={{}} elem={FormElementType.selector} options={["Tel Aviv", "Rosh pina"]} text={'בחר יעד'} type={'text'} />
            <RideFormItem id='form_item_2' style={{}} elem={FormElementType.selector} text={'נקודת יציאה'} options={["Tel Aviv", "Rosh pina"]} type={'text'} />
            <div style={{ columnGap: '8px', display: 'flex', justifyContent: 'center' }}>

                <RideFormItem id='form_item_3' style={{ width: '50%' }} elem={FormElementType.input} text={'מספר נוסעים'} type={'text'} />
                <RideFormItem id='form_item_4' style={{ width: '50%' }} elem={FormElementType.input} text={'שם'} type='text' />
            </div>

            <div>

                <RideFormItem action={() => {
                    dialogContext.openDialog({
                        content: <ListItem>
                            <TextField>Hello</TextField>
                        </ListItem>, title: 'Hello'
                    })
                }} id='form_item_5' style={{ borderRadius: '24px' }} elem={FormElementType.button} text={'המשך'} type={'text'} />
            </div>
        </div>
    </div>
}