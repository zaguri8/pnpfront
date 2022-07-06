import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { v4 } from 'uuid'
import { getEventTypeFromString } from '../../store/external/converters'
import './ImageSlider.css'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Stack } from '@mui/material'

export default function ImageSlider(props) {

    const [showingEvent, setShowingEvent] = useState(0)
    const nav = useNavigate()
    const openEventPage = () => { nav(`/event/${props.events[showingEvent].eventId}`) }
    const slide = () => { setShowingEvent(Math.floor(Math.random() * props.events.length)) }

    useEffect(() => {
        console.log(props.events[showingEvent])
    }, [showingEvent])

    useEffect(() => {
        let slidingInterval = setInterval(slide, 7000)
        return () => clearInterval(slidingInterval)
    }, [])


    return props.events.length > 0 ? <div className='image_container'
        onClick={openEventPage}
        style={{
            backgroundImage: `url(${props.events[showingEvent].eventImageURL})`
        }}>
        <div className = 'shade'/>
        <p className='bottom_left_rides'>הסעות</p>

        <p className='slider_bottom_text_right'>{props.events[showingEvent].eventName}<br /><span className='type_slider'>{getEventTypeFromString(props.events[showingEvent].eventType)}</span></p>
        <p className='slider_bottom_text_left'>{props.events[showingEvent].eventDate} <CalendarTodayIcon style={{width:'15px',paddingLeft:'8px'}}/></p>
    </div> : null
}