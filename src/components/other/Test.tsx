import { Button, Stack } from "@mui/material"
import React, { CSSProperties, ReactElement, ReactNode } from "react"
import SimpleForm from "../simpleForm/SimpleForm"

export default function Test() {

    return <div>
        <SimpleForm
            standAloneFields={
                [{
                    name: 'email',
                    label: 'אימייל',
                    type: 'email',
                    initialValue: '',
                    mandatory: true,
                    placeHolder: 'הכנס כתובת אימייל'
                }, {
                    name: 'password',
                    label: 'סיסמא',
                    type: 'password',
                    initialValue: '',
                    mandatory: true,
                    placeHolder: 'הכנס סיסמא'
                }, {
                    name: 'phone',
                    label: 'טלפון',
                    type: 'tel',
                    initialValue: '',
                    mandatory: true,
                    placeHolder: 'הכנס טלפון נייד'
                }]
            }
            coupledFields={[
                [{
                    name: 'returnTime',
                    label: 'שעת חזרה',
                    type: 'time',
                    initialValue: '00:00:00',
                    mandatory: true,
                    placeHolder: ''
                }, {
                    label: 'נקודת יציאה',
                    name: 'startPoint',
                    type: 'text',
                    initialValue: '',
                    mandatory: true,
                    placeHolder: "הכנס נקודת יציאה"
                }]
            ]}
            layout={'grid'}
            onSubmit={(e) => console.log(e)}
             />

    </div>
}