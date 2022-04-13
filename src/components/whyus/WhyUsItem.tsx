import { ORANGE_GRADIENT_PRIMARY, SECONDARY_BLACK } from "../../settings/colors";

export type WhyUsItemProps = {
    title: string,
    icon: string,
    content: string
}

function ContainerTitle(props: { title: string }) {
    return (<p style={{
        direction:props.title === `don't drink and drive` ? 'rtl' : 'ltr',
        marginTop: '0px',
        marginBottom: '0px',
        color:'#ff6a3c',
        fontWeight:'550',
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
        marginTop: '0px',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    }}><br /> {props.content}</p>);
}


export default function WhyUsItem(props: WhyUsItemProps) {
    return <div key={props.content} style={{

        padding: '1rem',
        alignSelf: 'center',
        width: '50%',
        maxWidth: '600px',
        marginBottom: '16px',
        margin: '8px',
        borderRadius: '12px',
        background: 'linear-gradient(#414345,#232526)'
    }}>
        <ContainerImage icon={props.icon} />
        <ContainerTitle title={props.title} />
        <ContainerContent content={props.content} />

    </div>
}