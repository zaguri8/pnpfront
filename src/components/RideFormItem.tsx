import { CSSProperties, HTMLInputTypeAttribute } from "react"

export enum FormElementType {
    button, input, selector
}
export type RideFormProps = {
    text: string,
    elem: FormElementType,
    type: HTMLInputTypeAttribute
}
export function RideFormItem(props: RideFormProps) {
    const elemStyle: CSSProperties = {
        direction: 'rtl',
        fontSize: '18px',
        padding: '8px',
        width: 'fit-content',
        color: 'whitesmoke',
        background: 'rgba(0,0,0,0.2',
        border: '1px solid white',
        borderRadius: '8px'
    }
    const getElem = () => {
        switch (props.elem) {
            case FormElementType.button:
                return <button style={{ ...elemStyle, ...{ cursor: 'pointer' } }}>{props.text}</button>
            case FormElementType.input:
                return <input style={elemStyle} type={props.type} placeholder={props.text} />
            case FormElementType.selector:
                break;
        }
        return null
    }
    return <div style={{ padding: '8px', display: 'inline-block' }}>
        {getElem()}
    </div>
}