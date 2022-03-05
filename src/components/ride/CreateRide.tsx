import { useState } from "react"
import { PNPPrivateRide } from "../../store/external/types"
import { useFirebase } from '../../context/Firebase'
import { useLoading } from '../../context/Loading'
import { isValidPrivateRide } from '../utilities/validators'


/* TODO: Create Ride  */
export default function CreateRide() {


    const { firebase } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()
    const [ride, setRide] = useState<PNPPrivateRide>({
        rideCreatorId: '',
        rideName: '',
        rideId: '',
        rideDestination: 'null',
        rideStartingPoint: 'null',
        extraStopPoints: [],
        backTime: 'null',
        rideTime: 'null',
        passengers: 'null',
        date: 'null',
        comments: 'null'
    })

    const updateRideName = (name: string) => {
        setRide({ ...ride, ...{ rideName: name } })
    }
    const updateRideDestination = (destination: string) => {
        setRide({ ...ride, ...{ rideDestination: destination } })
    }
    const updateRideStartingPoint = (startingPoint: string) => {
        setRide({ ...ride, ...{ rideStartingPoint: startingPoint } })
    }
    const addExtraStopPoint = (point: string) => {
        setRide({ ...ride, ...{ extraStopPoints: [...ride.extraStopPoints, point] } })
    }
    const removeExtraStopPoint = (point: string) => {
        let cur = ride.extraStopPoints
        const i = cur.findIndex(p => p === point)
        cur.splice(i, 1)
        setRide({ ...ride, ...{ extraStopPoints: cur } })

    }
    const updateRideTime = (rideTime: string) => {
        setRide({ ...ride, ...{ rideTime: rideTime } })
    }
    const updateBackTime = (backTime: string) => {
        setRide({ ...ride, ...{ backTime: backTime } })
    }
    const updateRidePassengers = (passengers: string) => {
        setRide({ ...ride, ...{ passengers: passengers } })
    }
    const updateRideDate = (date: string) => {
        setRide({ ...ride, ...{ date: date } })
    }
    const updateRideComments = (comments: string) => {
        setRide({ ...ride, ...{ comments: comments } })
    }

    const save = () => {

        if (isValidPrivateRide(ride)) {
            doLoad()
            firebase.realTime.addPublicRide
        } else {

        }

    }

    return <div></div>
}
