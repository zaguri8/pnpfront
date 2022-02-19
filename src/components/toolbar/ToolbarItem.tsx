import { CSSProperties } from "react";

export default function ToolbarItem(props: {
    text?: string,
    action?: () => void,
    image?: string,
    line?: boolean,
    bold?: boolean,
    style?: CSSProperties,
    id?: string
}) {
    return <span className={props.bold ? '' : 'toolbar_item'} onClick={props.action} style={{
        ...{
            paddingLeft: '16px',
            paddingRight: '16px',
            fontWeight: '400',
            fontSize: '18px',
            paddingTop: props.bold ? '24px' : props.image ? '8px' : '0px',
            cursor: 'pointer',
            textAlign: 'center',
            borderRadius: '8px',
            background: props.image ? 'none' : 'rgba(0,0,0,0.0)',
            color: 'black',
            maxHeight: 'inherit'
        }, ...props.style
    }}>
        {props.text ? props.text : props.image ? <img id={props.id} style={{ height: props.bold ? '32px' : '18px' }} src={props.image} /> : ''}
        {props.line && <hr style={{ borderWidth: '.1px' }} />}
    </span>
}