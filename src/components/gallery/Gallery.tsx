import { CSSProperties, useEffect } from "react"
import { v4 } from "uuid"
import { BLACK_ELEGANT, BLACK_ROYAL, DARK_BLACK, PRIMARY_BLACK, PRIMARY_WHITE, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import { useNavigate } from 'react-router'
import $ from 'jquery'
import loadingGif from '../../assets/gifs/loading.gif'
import { PNPEvent } from "../../store/external/types";
import { useLanguage } from "../../context/Language";
import pin from '../../assets/images/pin-location.png'
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
        background: SECONDARY_WHITE,
        textAlign: 'start',
        display: 'flex',
        height: '26%',
        color: PRIMARY_BLACK,
        flexDirection: 'column',
        paddingBottom: '6px',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px'
    }}><h4 style={{ margin: '0px', padding: '6px', paddingBottom: '0px', paddingTop: '2px' }} >{props.event.eventName}</h4>
        <span style={{ display: 'flex', alignItems: 'center', fontSize: '10px', background: 'none', margin: '0px', paddingBottom: '1px', paddingTop: '0px', marginRight: '8px' }} >

            <img src={pin} style={{ paddingLeft: '2px', width: '12.5px', height: '12.5px' }} />

            {props.event.eventLocation}

        </span>
        <span dir={'ltr'} style={{
            fontSize: '10px',
            fontWeight: '600',
            padding: '1px',
            marginLeft: '8px',
            marginTop: '0px', color: BLACK_ROYAL
        }}>{props.event.eventDate}</span></div>);
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


    useEffect(() => {
        setTimeout(() => {
            $('.loadingDivStyle').css('display', 'none')
        }, 550)
    }, [])


    const loadingDivStyle = {
        background: `url('${loadingGif}')`,
        width: '100%',
        borderTopLeftRadius:'16px',
        borderTopRightRadius:'16px',
        backgroundSize:'cover',
        height: '100%'
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
                                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 1px, rgba(0, 0, 0, 0.05) 0px 4px 2px, rgba(0, 0, 0, 0.05) 0px 8px 4px, rgba(0, 0, 0, 0.05) 0px 16px 8px, rgba(0, 0, 0, 0.05) 0px 32px 16px',
                                cursor: 'pointer',
                                backgroundClip: 'border-box',
                                backgroundColor: 'white',
                                background:  `url('${pnpEvent.eventImageURL}') `,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center center',
                                backgroundRepeat: 'no-repeat',
                            }
                        }}
                        className="gallery_img"
                        onClick={() => handleOpen(pnpEvent)}>
                        <div className='loadingDivStyle'

                            style={loadingDivStyle} />
                        <GalleryItemTitle event={pnpEvent} />

                    </div>)
                })}
            </div>
        </div>
    </div >
}