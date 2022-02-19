import { ORANGE_GRADIENT_PRIMARY } from "../../colors"

export type WhyUsItemProps = {
    title: string,
    icon: string,
    content: string
}

function ContainerTitle(props: { title: string }) {
    return (<p style={{
        marginTop: '0px',
        marginBottom: '0px',
        fontSize: '24px'
    }}>{props.title}</p>);
}



function ContainerImage(props: { icon: string }) {
    return (<img src={props.icon} style={{
        padding: '8px',
        width: '40px',
        height: '40px'
    }} alt='no image found' />);
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
        color: 'white',
        padding: '1rem',
        alignSelf: 'center',
        width: '50%',
        maxWidth:'600px',
        marginBottom: '16px',
        margin: '8px',
        borderRadius: '12px',
        backgroundImage: ORANGE_GRADIENT_PRIMARY
    }}>
        <ContainerImage icon={props.icon} />
        <ContainerTitle title={props.title} />
        <ContainerContent content={props.content} />

    </div>
}