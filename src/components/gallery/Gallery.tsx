import React, { CSSProperties, useEffect, useLayoutEffect } from "react"
import { v4 } from "uuid"
import { BLACK_ELEGANT, BLACK_ROYAL, DARK_BLACK, PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_WHITE, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import { useNavigate } from 'react-router'
import $ from 'jquery'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { motion } from 'framer-motion'
import loadingGif from '../../assets/gifs/loading.gif'
import { PNPEvent } from "../../store/external/types";
import { useLanguage } from "../../context/Language";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import pin from '../../assets/images/pin-location.png'
import './Gallery.css'
import { Stack } from "@mui/material";
export type GalleryProps = {
    header: string
    events: PNPEvent[]
    privateEvents: PNPEvent[]
}

function GalleryItemTitleOld(props: { event: PNPEvent }) {
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


const paragraphStyle = {
    fontSize: '12px',
    margin: '0px'
} as CSSProperties

function GalleryItemTitle(props: { event: PNPEvent }) {

    return <div style={{
        marginBottom: '8px',
        minWidth: 'fit-content',
        transform: 'translateX(4px)'
    }} className="gallery_item_decoration">
        <Stack display="flex" direction={'row'} alignItems="center" >
            <div className='c_square'></div>
            <p style={paragraphStyle}>
                {props.event.eventName}
            </p>
        </Stack>
    </div>
}
function GalleryItemBottom(props: { event: PNPEvent }) {

    const todayIconStyle = {
        width: '12px',
        height: '12px',
        color: 'orange',
        paddingLeft: '4px'
    } as CSSProperties
    const locationPinIconStyle = {
        paddingLeft: '2px',
        width: '12.5px',
        color: 'orange',
        height: '12.5px'
    } as CSSProperties

    return <div >
        <Stack display={'flex'} alignItems={'flex-start'} className="gallery_item_decoration">

            <p style={paragraphStyle}><CalendarTodayIcon style={todayIconStyle} />{props.event.eventDate} </p>
            <p style={paragraphStyle}><LocationOnIcon className="img_pin_location" style={locationPinIconStyle} />{props.event.eventLocation}</p>
        </Stack>
    </div>
}


function Gallery(props: GalleryProps) {
    const { lang } = useLanguage()


    const imageContainer: CSSProperties = {
        display: 'flex',
        columnGap: '8px',
        width: 'fit-content',
        textAlign: 'center'
    }
    const headerStyle: CSSProperties = {
        textAlign: lang === 'heb' ? 'right' : 'left',
        fontWeight: '300',
        fontFamily: 'Open Sans Hebrew ',
        position: 'relative',
        border: '1px solid solid black',
        padding: '32px',
        transform: 'translateY(10px)',
        paddingBottom: '0px',
        fontSize: '16px',
        margin: '0px',
        color: PRIMARY_ORANGE
    }

    const nav = useNavigate()
    const handleOpen = (pnpEvent: PNPEvent) => {
        nav(`/event/${pnpEvent.eventId}`)
    }


    useEffect(() => {
        setTimeout(() => {
            $('.loadingDivStyle').css('display', 'none')
        }, 550)
        props.events.forEach(event => {
            const imageId = (event as any).imageId
            $(`#gallery_img_${imageId}`).css('background-image', `url('${event.eventMobileImageURL ?? event.eventImageURL}')`)
        })
        props.privateEvents.forEach(event => {
            const imageId = (event as any).imageId
            $(`#gallery_img_${imageId}`).css('background-image', `url('${event.eventMobileImageURL ?? event.eventImageURL}')`)
        })
    },[])

    const loadingDivStyle = {
        background: `url('${loadingGif}')`,
        width: '100%',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        backgroundSize: 'cover',
        height: '100%'
    }

    const animations = {
        initial: { opacity: 0, transform: 'translateX(200px)' },
        animate: { opacity: 1, transform: 'translateX(0px)' },
        exit: { opacity: 0 }
    }

    return <div >
        {<h3 className='gallery_header' style={headerStyle}>{props.header}</h3>}
        <motion.div
            variants={animations}
            initial={'initial'}
            animate={'animate'}
            exit={'exit'}
            transition={{ duration: 0.5 }} id='gallery_container' >
            <div className='gallery' style={imageContainer} >

                {props.events.map(pnpEvent => {
                    const imageId = (pnpEvent as any).imageId
                    return (<div key={v4()} style={{ transform: 'scale(0.9)' }}>
                        <GalleryItemTitle event={pnpEvent} />
                        <div
                            className="gallery_img"
                            id={`gallery_img_${imageId}`}
                            onClick={() => handleOpen(pnpEvent)}>
                            <div className='loadingDivStyle'
                                style={loadingDivStyle} />
                        </div>
                        <GalleryItemBottom event={pnpEvent} />
                    </div>)
                })}
            </div>
        </motion.div>
        {<h3 className='gallery_header' style={headerStyle}>{lang === 'heb' ? 'אירועים פרטיים' : 'Private event'}</h3>}
        <motion.div
            variants={animations}
            initial={'initial'}
            animate={'animate'}
            exit={'exit'}
            transition={{ duration: 1 }} id='gallery_container' >
            <div className='gallery' style={imageContainer}>

                {props.privateEvents.map(pnpEvent => {
                    const imageId = (pnpEvent as any).imageId

                    return (<div key={v4()} style={{ transform: 'scale(0.9)', marginLeft: '4px', marginRight: '4px' }}>
                        <GalleryItemTitle event={pnpEvent} />
                        <div
                            className="gallery_img"
                            id={`gallery_img_${imageId}`}
                            onClick={() => handleOpen(pnpEvent)}>
                            <div className='loadingDivStyle'
                                style={loadingDivStyle} />
                        </div>
                        <GalleryItemBottom event={pnpEvent} />
                    </div>)
                })}
            </div>
        </motion.div>
    </div>
}
export default  React.memo(Gallery)