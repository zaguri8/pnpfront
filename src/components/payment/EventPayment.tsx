
import { CSSProperties, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useHeaderBackgroundExtension } from '../../context/HeaderContext'
import { PNPEvent, PNPPublicRide } from '../../store/external/types'
import { PageHolder } from '../utilities/Holders'
import './EventPayment.css'
import { PaymentForm } from './Payment'
export default function EventPayment() {
    const location = useLocation()

    const [paymentInfo, setPaymentInfo] = useState<{ ride: PNPPublicRide, event: PNPEvent } | undefined>();


    const { setHeaderBackground } = useHeaderBackgroundExtension()


    useEffect(() => {
        let stt = location.state as { ride: PNPPublicRide, event: PNPEvent }
        if (stt && !paymentInfo) {
            setHeaderBackground(`url('${stt.event.eventMobileImageURL ?? stt.event.eventImageURL}')`)
            setPaymentInfo(stt)
        }
    }, [location.state])
    useEffect(() => {
        window.scrollTo({
            top: 128,
            left: 0,
            behavior: "smooth"
        })
    }, [])

    function getTicketsLeft() {
        return !paymentInfo ? 0 : (Number(paymentInfo.ride.extras.rideMaxPassengers) - Number(paymentInfo.ride.passengers));
    }
    function getIsSoldOut() {
        return paymentInfo && paymentInfo.ride.extras.rideStatus === 'sold-out'
    }
    return <PageHolder style={{
        position: 'relative',
        fontFamily: 'Open Sans Hebrew',
        transform: `translateY(-200px)`,
    }}>
        <div className='dim_payment'></div>
        {(paymentInfo && paymentInfo.ride && paymentInfo.event) ? <PaymentForm
            product={{
                name: `${paymentInfo.event.eventName}`,
                desc: paymentInfo.event.eventDetails,
                ticketsLeft: getTicketsLeft(),
                soldOut: getIsSoldOut(),
                eventLocation: paymentInfo.event.eventLocation,
                startPoint: paymentInfo.ride.rideStartingPoint,
                rideTime: paymentInfo.ride.rideTime ?? "00:00",
                backTime: paymentInfo.ride.backTime ?? "00:00",
                exactStartPoint: paymentInfo.ride.extras.exactStartPoint ?? "",
                exactBackPoint: paymentInfo.ride.extras.exactBackPoint ?? "",
                direction: paymentInfo.ride.extras.rideDirection, // 2 - first way , 1 second way
                twoWay: paymentInfo.ride.extras.twoWay,
                price: paymentInfo.ride.ridePrice,
                eventId: paymentInfo.event.eventId,
                eventDate: paymentInfo.event.eventDate,
                rideId: paymentInfo.ride.rideId
            }} /> : <div className='mistake'>
            You must have gotten here by mistake.
        </div>}
    </PageHolder>
}