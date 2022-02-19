import { v4 } from "uuid"

export type SayNoMoreItemProps = {
    icon: string,
    content: string
}
export default function SayNoMoreItem(props: SayNoMoreItemProps) {

    const nMore = "No more"
    return <div key={v4()} style={{

        minWidth: '120px',
        background: 'rgb(232,232,232)',
        color: 'black',
        padding: '32px',
        width: '16.6%'
    }}>

        <p style={{
            marginTop: '0px',
            fontSize: '18px',
            marginBottom: '0px',
            fontWeight: '100',
            textAlign: 'center'
        }}><b style={{

            fontStyle: 'italic',
            color: 'orangered',
            fontSize: '26px'
        }}>{nMore + " "}</b><br /> {props.content}</p>

    </div>
}