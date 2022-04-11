import { CSSProperties, useEffect } from "react"
import { v4 } from "uuid"
import { PRIMARY_WHITE } from "../../settings/colors";
import { useNavigate } from 'react-router'
import $ from 'jquery'
import { PNPEvent } from "../../store/external/types";
import { useLanguage } from "../../context/Language";
import './Gallery.css'
export type GalleryProps = {
    header: string
    events: PNPEvent[]
}

function GalleryItemTitle(props: { event: PNPEvent }) {

    const { lang } = useLanguage()
    return (<div style={{
        margin: '0px',
        marginTop: 'auto',
        background: 'white',
        textAlign: 'start',
        marginBottom: '8px',
        display: 'flex',
        height: '26%',
        flexDirection: 'column',
        color: 'black',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px'
    }}><h4 style={{ margin: '0px', padding: '6px', paddingBottom: '0px', paddingTop: '2px' }} >{props.event.eventName}</h4>
        <span style={{ fontSize: '10px', background: 'white', margin: '0px', paddingBottom: '1px', paddingTop: '0px', marginRight: '8px' }} >{props.event.eventLocation}</span>
        <hr style={{ width: '98%', borderWidth: '.1px', borderColor: 'white', margin: '0px' }} />
        <span dir={'ltr'} style={{ fontSize: '12px', fontWeight: '600', padding: '1px', marginLeft: '8px', marginTop: '0px', color: 'gray' }}>{props.event.eventDate}</span></div>);
}


export function Gallery(props: GalleryProps) {
    const { lang } = useLanguage()
    const containerStyle: CSSProperties = {
        overflow: 'scroll',

        display: 'flex',
        direction: 'rtl',
        paddingBottom: '32px',
    }

    const cardStyle: CSSProperties = {

        maxWidth: '225px',
        border: '.1px solid gray',
        marginLeft: '8px',
        marginRight: '8px',
        minWidth: '225px',
        minHeight: '190px',
        borderRadius: '16px',

        background: 'white'
    }
    const imageContainer: CSSProperties = {
        display: 'flex',
        width: 'fit-content',
        padding: '8px',
        textAlign: 'center'
    }
    const headerStyle: CSSProperties = {
        textAlign: lang === 'heb' ? 'right' : 'left',
        fontWeight: '300',
        fontFamily: 'Open Sans Hebrew ',
        position: 'relative',
        border: '1px solid solid black',
        padding: '32px',
        fontSize: '28px',
        margin: '0px',
        color: PRIMARY_WHITE
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

                    return (<div key={v4()}
                        style={{
                            ...cardStyle, ...{
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                                background: `url('${pnpEvent.eventImageURL}') `,
                                backgroundSize: '100% 75%',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'top center'
                            }
                        }}
                        className="gallery_img"
                        onClick={() => handleOpen(pnpEvent)}>

                        <GalleryItemTitle event={pnpEvent} />

                    </div>)
                })}
            </div>
        </div>
    </div >
}