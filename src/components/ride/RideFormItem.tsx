import { Button, TextField } from "@mui/material"
import { ChangeEventHandler, CSSProperties, HTMLInputTypeAttribute } from "react"
import { makeStyles } from "@mui/styles"
import Places from "../utilities/Places"
import { InputBaseComponentProps } from "@mui/material"

export enum FormElementType {
    button, input, selector, place
}

export type RideFormProps = {
    text: string,
    name?: string,
    value?: any,
    elem: FormElementType,
    inputProps?: InputBaseComponentProps
    id?: string,
    action?: ChangeEventHandler,
    placeSelectedHandler?: (place: string) => void,
    actionButton?: () => void
    type: HTMLInputTypeAttribute,
    style: CSSProperties,
    options?: string[]
}



export function RideFormItem(props: RideFormProps) {
    const useStyles = makeStyles(() => ({
        root: {
            "& .MuiOutlinedInput-root": {
                background: "white",
                borderRadius:'32px'
            }
        }, noBorder: {
            border: "1px solid red",
            outline: 'none'
        }
    }));
    const classes = useStyles()
    const getElem = () => {
        switch (props.elem) {
            case FormElementType.place:
                return <Places value={props.value} handleAddressSelect={props.placeSelectedHandler} types={['address']} className='ride_form_item' id={props.id} fixed={false} placeHolder={props.text} style={{ ...{ padding: '0px', margin: '0px', width: '100%', borderRadius: '32px' }, ...{ cursor: 'pointer' } }} />
            case FormElementType.button:
                return <Button variant="outlined" id={props.id} onClick={() => { props.actionButton && props.actionButton() }} className={props.id === 'form_item_5' ? '' : 'ride_form_item'} style={{
                    ...props.style, ...{
                        cursor: 'pointer',
                        fontFamily: 'Open Sans Hebrew',
                        alignSelf: 'center',
                        margin: '8px',
                        padding: '8px'
                    }
                }}>{props.text}</Button>
            case FormElementType.input:
                return <TextField
                    value={props.value}
                    onChange={props.action}
                    name={props.name}
                    inputProps={props.inputProps}
                    className={classes.root}
                    variant="outlined"
                    id={props.id}
                    sx={{ ...props.style}} type={props.type} placeholder={props.text} />
            default:
                return <div></div>
        }

    }
    return getElem()
}