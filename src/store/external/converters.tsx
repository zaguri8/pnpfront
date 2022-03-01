
import { DataSnapshot } from "firebase/database"


export const eventFromDict = (snap: DataSnapshot) => {
    return {
        eventId: snap.child('eventId').val(),
        eventName: snap.child('eventName').val(),
        eventProducerId: snap.child('eventProducerId').val(),
        eventDate: snap.child('eventDate').val(),
        eventLocation: snap.child('eventLocation').val(),
        eventDetails: snap.child('eventDetails').val(),
        eventHours: snap.child('eventHours').val(),
        eventAgeRange: snap.child('eventAgeRange').val(),
        eventPrice: snap.child('eventPrice').val(),
        expectedNumberOfPeople: snap.child('expectedNumberOfPeople').val(),
        eventImageURL: snap.child('eventImageURL').val(),
    }
}

export const rideFromDict = (snap: DataSnapshot) => {
    return {
        rideName: snap.child('rideName').val(),
        rideId: snap.child('rideId').val(),
        rideDestination: snap.child('rideDestination').val(),
        rideStartingPoint: snap.child('rideStartingPoint').val(),
        ridePrice:snap.child('ridePrice').val(),
        extraStopPoints: snap.child('extraStopPoints').val(),
        rideTime: snap.child('rideTime').val(),
        backTime: snap.child('backTime').val(),
        passengers: snap.child('passengers').val(),
        date: snap.child('date').val(),
        comments: snap.child('comments').val()
    }
}
export const userFromDict = (snap: DataSnapshot) => {
    return {
        email: snap.child('email').val(),
        birthDate: snap.child('birthDate').val(),
        phone: snap.child('phone').val(),
        name: snap.child('name').val(),
        favoriteEvents: snap.child('favoriteEvents').val(),
        producer: snap.child('producer').val(),
    }
}