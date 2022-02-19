
import { DataSnapshot } from "firebase/database"
export const eventFromDict = (snap: DataSnapshot) => {
    return {
        eventId: snap.child('eventId').val(),
        eventProducerId: snap.child('eventProducerId').val(),
        eventGraphics: snap.child('eventGraphics').val(),
        eventHours: snap.child('eventHours').val(),
        eventAgeRange: snap.child('eventAgeRange').val(),
        eventPrice: snap.child('eventPrice').val(),
        expectedNumberOfPeople: snap.child('expectedNumberOfPeople').val(),
        eventImageURL: snap.child('eventImageURL').val(),
    }
}

export const rideFromDict = (snap: DataSnapshot) => {
    return {
        rideId: snap.child('rideId').val(),
        rideDestination: snap.child('rideDestination').val(),
        rideStartingPoint: snap.child('rideStartingPoint').val(),
        passengers: snap.child('passengers').val(),
        date: snap.child('date').val(),
        comments: snap.child('comments').val()
    }
}
export const userFromDict = (snap: DataSnapshot) => {
    return {
        email: snap.child('email').val(),
        phone: snap.child('phone').val(),
        name: snap.child('name').val(),
        producer: snap.child('producer').val(),
    }
}
