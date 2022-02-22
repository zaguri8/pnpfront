import { CSSProperties, HTMLInputTypeAttribute } from "react"
export enum FormElementType {
    button, input, selector
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
    const elemStyle: CSSProperties = {
        direction: 'rtl',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '500',
        marginLeft: '16px',
        fontFamily: 'Open Sans Hebrew',
        marginRight: '16px',
        borderRadius: '16px',
        background: 'white',
        color: 'black',
        textAlign: 'center',
        border: 'none'
    }
    const getElem = () => {
        switch (props.elem) {
            case FormElementType.button:
                return <button id={props.id} onClick={props.action} className={props.id === 'form_item_5' ? '' : 'ride_form_item'} style={{ ...elemStyle, ...props.style, ...{ cursor: 'pointer' } }}>{props.text}</button>
            case FormElementType.input:
                return <input id={props.id} className='ride_form_item' style={{ ...elemStyle, ...props.style }} type={props.type} placeholder={props.text} />
            case FormElementType.selector:
                return <select id={props.id} className='ride_form_item' style={{ ...elemStyle, ...props.style }}>
                    {props.options && props.options.map(option => <option id={props.id} value={option} key={option}>
                        {option}
                    </option>)}
                </select>
        }

    }
    return getElem()
}