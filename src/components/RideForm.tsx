import { flex } from "../styles";
import { RideFormItem } from "./RideFormItem";
import '../App.css'
import $ from 'jquery'
import { useEffect } from "react";
import { FormElementType } from "./RideFormItem";
export function RideForm() {


    return <div id='ride_form' style={{margin:'16px',padding:'16px'}}>

        <RideFormItem elem={FormElementType.input} text={'בחר יעד'} type={'text'} />
        <RideFormItem elem={FormElementType.input} text={'נקודת יציאה'} type={'text'} />
        <RideFormItem elem={FormElementType.input} text={'מספר נוסעים'} type={'text'} />
        <RideFormItem elem={FormElementType.input} text={'שם'} type='text' />

        <div>

            <RideFormItem elem={FormElementType.button} text={'המשך'} type={'text'} />
        </div>
    </div>
}