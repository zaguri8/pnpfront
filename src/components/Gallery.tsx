import { CSSProperties } from "react"
import { v4 } from "uuid"
import { PRIMARY_WHITE } from "../settings/colors";
import { useNavigate } from 'react-router'
import { PNPEvent } from "../store/external/types";
import { useLanguage } from "../context/Language";
import { SIDE } from "../settings/strings";

export type GalleryProps = {
    header: string
    events: PNPEvent[]
}

function GalleryItemTitle(props: { eventName: string }) {
    return (<h4 style={{
        background: 'rgba(0,0,0,0.5)',
        margin: '0px',
        marginTop: 'auto',
        padding: '8px',
        color: 'white',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px'
    }}>{props.eventName}</h4>);
}


export function Gallery(props: GalleryProps) {
    const {lang} = useLanguage()
    const containerStyle: CSSProperties = {
        display: 'flex',
        overflow: 'scroll',
        justifyContent: 'center',
        paddingBottom: '32px',
        alignItems: lang === 'heb' ? 'end' : 'start',
        background: PRIMARY_WHITE,
        flexDirection: 'column'
    }

    const cardStyle: CSSProperties = {

        maxWidth: '200px',
        marginLeft: '32px',
        marginRight: '32px',
        minWidth: '200px',
        boxShadow: '0px 0px 6px 0px',
        minHeight: '150px',
        borderRadius: '4px'
    }
    const imageContainer: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        background: ' rgb(232,232,232)',
        overflow: 'auto',
        padding: '8px',
        justifyContent: 'center',
        textAlign: 'center'

    }
    const headerStyle: CSSProperties = {
        textAlign: lang === 'heb' ? 'right' : 'left',
        fontWeight: '300',
        fontFamily: 'Open Sans Hebrew ',
        position: 'relative',
        padding: '32px',
        fontSize: '28px',
        margin: '0px',
        color: 'black'
    }
    // POPUP VERSION //const dialogContext = useLoading()
    // PAGE VERSION
    const nav = useNavigate()
    const handleOpen = (pnpEvent: PNPEvent) => {
        // POPUP VERSION:   // dialogContext.openDialog({
        //     content: <ListItem>
        //         <img src={pnpEvent.eventImageURL} />
        //     </ListItem>, title: pnpEvent.eventName
        // })
        // PAGE VERSION
        nav(`/event/${pnpEvent.eventId}`)

    }

    return <div>
        {<h2 className='gallery_header' style={headerStyle}>{props.header}</h2>}
        <div id='gallery_container' style={containerStyle}>
            <div className='gallery' style={imageContainer}>
                {props.events.map(pnpEvent => {

                    return (<div key={v4()} className="gallery_img" style={{
                        ...cardStyle, ...{
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            background: `url('${pnpEvent.eventImageURL}') `,
                            backgroundSize: '100% 100%',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center'
                        }
                    }} onClick={() => handleOpen(pnpEvent)}>

                        <GalleryItemTitle eventName={pnpEvent.eventName} />

                    </div>)
                })}
            </div>
        </div>
    </div >
}