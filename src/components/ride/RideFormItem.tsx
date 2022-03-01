import { Button, TextField } from "@mui/material"
import { CSSProperties, HTMLInputTypeAttribute } from "react"
import { makeStyles } from "@mui/styles"
import Places from "../utilities/Places"

export enum FormElementType {
    button, input, selector, place
}

export type RideFormProps = {
    text: string,
    elem: FormElementType,
    id?: string,
    action?: () => void
    type: HTMLInputTypeAttribute,
    style: CSSProperties,
    options?: string[]
}

export function RideFormItem(props: RideFormProps) {
    const useStyles = makeStyles(() => ({
        root: {
            "& .MuiOutlinedInput-root": {
                background: "white"
            }
        }
    }));
    const classes = useStyles()
    const getElem = () => {
        switch (props.elem) {
            case FormElementType.place:
                return <Places className='ride_form_item' id={props.id} fixed={false} placeHolder={props.text} style={{ ...{ padding: '0px', margin: '0px', width: '100%' }, ...{ cursor: 'pointer' } }} />
            case FormElementType.button:
                return <Button id={props.id} onClick={props.action} className={props.id === 'form_item_5' ? '' : 'ride_form_item'} style={{
                    ...props.style, ...{
                        cursor: 'pointer',
                        fontFamily: 'Open Sans Hebrew', 
                        alignSelf:'center',
                        margin:'8px',
                        padding: '8px'
                    }
                }}>{props.text}</Button>
            case FormElementType.input:
                return <TextField className={classes.root} id={props.id} style={{ ...props.style }} type={props.type} placeholder={props.text} />
        }

    }
    return getElem()
}