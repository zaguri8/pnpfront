import { BLACK_ELEGANT, BLACK_ROYAL, ORANGE_GRADIENT_PRIMARY, SECONDARY_BLACK } from "../../settings/colors";
import { boxShadow } from "../../settings/styles";

export type WhyUsItemProps = {
    title: string,
    icon: string,
    content: string
}

function ContainerTitle(props: { title: string }) {
    return (<p style={{
        direction: props.title === `don't drink and drive` ? 'rtl' : 'ltr',
        marginTop: '0px',
        marginBottom: '0px',
        fontWeight: '550',
        fontSize: '24px'
    }}>{props.title}</p>);
}



function ContainerImage(props: { icon: string }) {
    return (<img alt='' src={props.icon} style={{
        padding: '8px',
        width: '40px',
        height: '40px'
    }} />);
}



function ContainerContent(props: { content: string }) {
    return (<p style={{
        marginTop: '8px',
        textAlign: 'center',
        padding: '4px',
        fontWeight: '550',
        color:'#ff7a3c',
        marginLeft: 'auto',
        marginRight: 'auto'
    }}><br /> {props.content}</p>);
}


export default function WhyUsItem(props: WhyUsItemProps) {
    return <div key={props.content} style={{
        ...{

            padding: '1rem',
            alignSelf: 'center',
            width: '50%',
            maxWidth: '600px',
            marginBottom: '16px',
            margin: '8px',
            borderRadius: '12px',
            background: 'linear-gradient(180deg,#333333 55%,#333333 45%)'
        }
    }}>
        <ContainerImage icon={props.icon} />
        <ContainerTitle title={props.title} />
        <ContainerContent content={props.content} />

    </div >
}