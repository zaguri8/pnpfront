import { CSSProperties } from "react";
import { DARK_BLACK, PRIMARY_BLACK, PRIMARY_WHITE, SECONDARY_BLACK } from "../../settings/colors";

export const toolbarItemStyle = (props?: any) => ({
    paddingLeft: '8px',
    paddingRight: '8px',
    fontWeight: '400',
    fontSize: '14px',
    paddingTop: props.bold ? '24px' : props.image ? '8px' : '0px',
    cursor: 'pointer',
    textAlign: 'center',
    borderRadius: '8px',
    background: props.image ? 'none' : 'rgba(0,0,0,0.0)',
    color: PRIMARY_WHITE,
    maxHeight: 'inherit'
})
export default function ToolbarItem(props: {
    text?: string,
    action?: () => void,
    image?: string,
    icon?:JSX.Element,
    line?: boolean,
    bold?: boolean,
    style?: CSSProperties,
    id?: string
}) {
    return <span className={props.bold ? '' : 'toolbar_item'} onClick={props.action}
        style={{
            ...{
                paddingLeft: '8px',
                paddingRight: '8px',
                fontWeight: '400',
                fontSize: props.line ? '16px' : '14px',
                paddingTop: props.line ? '12px' : props.bold ? '24px' : props.image ? '8px' : '0px',
                cursor: 'pointer',
                justifyContent:'center',
                display:props.icon ? 'flex' : 'inline',
                alignItems:'center',
                paddingBottom: props.line ? '12px' : 'inherit',
                textAlign: 'center',
                borderRadius: '8px',
                border:props.line ? '.1px solid whitesmoke' : 'none',
                background: props.image ? 'none' : props.line ? 'rgb(40,38,55,1)' :  'rgba(0,0,0,0.0)',
                color: PRIMARY_WHITE,
                maxHeight: 'inherit'
            },
            ...props.style
        }}>
         {(props.icon) ? props.icon : null}   
        {props.text ? props.text : props.image ? <img alt="" id={props.id} style={{ height: props.bold ? '32px' : '18px' }} src={props.image} /> : ''}
     
    </span>
}