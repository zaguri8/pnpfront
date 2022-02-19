import { PRIMARY_WHITE } from "../colors";

export default function SectionTitle({ title, style }) {
    return (<h1 style={{
        ...{
            alignSelf: 'center',
            color: 'black',
            fontWeight:'100',
            background:PRIMARY_WHITE,
            marginLeft: 'auto',
            marginTop:'32px',
            marginBottom:'0px',
            marginRight: 'auto',
            dir: 'rtl',
            fontFamily: 'Open Sans Hebrew'
        }, ...style
    }}>{title}</h1>)
}