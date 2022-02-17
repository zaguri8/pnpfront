import { colorSecondary, orangeGradient } from "../../colors"

export type SayNoMoreItemProps = {
    icon: string,
    content: string
}
export default function SayNoMoreItem(props: SayNoMoreItemProps) {

    const nMore = "No more"
    return <div key={props.content} style={{
        boxShadow:'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
        minWidth: '120px',
        color: 'white',
        width: '16.6%',
        marginBottom:'16px',
        margin:'8px',
        borderRadius: '12px',
        background: '#282c34'
    }}>
        <img src={props.icon} style={{
            padding: '8px',
            width: '40px',
            height: '40px'
        }} alt='no image found' />
        <p style={{

            textAlign: 'center',
            maxWidth: '120px',
            marginLeft: 'auto',
            marginRight: 'auto'
        }}><b>{nMore + " "}</b><br /> {props.content}</p>

    </div>
}