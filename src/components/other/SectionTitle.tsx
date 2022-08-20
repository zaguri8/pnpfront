import { PRIMARY_WHITE } from "../../settings/colors";
import { CSSProperties } from "react";

export default function SectionTitle(props: { title: string, withBg?: boolean, style: CSSProperties }) {
    return (<h1 style={{
        ...{
            alignSelf: 'center',
            color: PRIMARY_WHITE,
            fontWeight: '100',
            background: 'none',
            marginLeft: 'auto',
            marginTop: '32px',
            marginBottom: '0px',
            marginRight: 'auto',
            dir: 'rtl',
            fontFamily: 'Open Sans Hebrew'
        }, ...props.style
    }}>{props.title}</h1>)
}