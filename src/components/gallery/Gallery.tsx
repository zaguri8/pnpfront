import React, { CSSProperties, useEffect } from "react"
import { v4 } from "uuid"
import { PRIMARY_ORANGE } from "../../settings/colors";
import $ from 'jquery'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { motion } from 'framer-motion'
import loadingGif from '../../assets/gifs/loading.gif'
import { PNPEvent } from "../../store/external/types";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import './Gallery.css'
import { Stack } from "@mui/material";
import { Hooks } from "../generics/types";
import { withHookGroup } from "../generics/withHooks";
import { getValidImageUrl } from "../../utilities";
export type GalleryProps = {
    header: string
    events: PNPEvent[]
    privateEvents: PNPEvent[]
}
const paragraphStyle = {
    fontSize: '12px',
    margin: '0px'
} as CSSProperties

type GalleryItemProps = { event: PNPEvent }
function GalleryItemTitle(props: GalleryItemProps) {
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
function GalleryItemBottom(props: GalleryItemProps) {

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


function Gallery(props: GalleryProps & Hooks) {


    const imageContainer: CSSProperties = {
        display: 'flex',
        columnGap: '8px',
        width: 'fit-content',
        textAlign: 'center'
    }
    const headerStyle: CSSProperties = {
        textAlign: props.language.lang === 'heb' ? 'right' : 'left',
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

    const handleOpen = (pnpEvent: PNPEvent) => {
        props.nav(`/event/${pnpEvent.eventId}`)
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
                    return (<div key={v4()} style={{ transform: 'scale(0.9)' }}>
                        <GalleryItemTitle event={pnpEvent} />
                        <img
                            className="gallery_img"
                            loading="lazy"
                            src={pnpEvent.eventMobileImageURL ?? pnpEvent.eventImageURL}
                            id={`gallery_img_${(pnpEvent as any).imageId}`}
                            onClick={() => handleOpen(pnpEvent)}>
                        </img>
                        <GalleryItemBottom event={pnpEvent} />
                    </div>)
                })}
            </div>
        </motion.div>
        {<h3 className='gallery_header' style={headerStyle}>{props.language.lang === 'heb' ? 'אירועים פרטיים' : 'Private event'}</h3>}
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
                        <img
                            className="gallery_img"
                            loading="lazy"
                            id={`gallery_img_${imageId}`}
                            src={pnpEvent.eventImageURL}
                            onClick={() => handleOpen(pnpEvent)}>
                        </img>
                        <GalleryItemBottom event={pnpEvent} />
                    </div>)
                })}
            </div>
        </motion.div>
    </div>
}
export default withHookGroup<GalleryProps>(React.memo(Gallery), ['language', 'nav'])