
import { DataSnapshot } from "firebase/database"
import { PNPUser, PNPEvent, PNPPrivateRide, PNPRideConfirmation, PNPPublicRide, PNPPrivateEvent } from "./types"


export const eventFromDict: (snap: DataSnapshot) => PNPEvent = (snap) => {
    return {
        eventId: snap.child('eventId').val(),
        eventName: snap.child('eventName').val(),
        eventProducerId: snap.child('eventProducerId').val(),
        eventCanAddRides:snap.child('eventCanAddRides').val(),
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

export const privateEventFromDict: (snap: DataSnapshot) => PNPPrivateEvent = (snap) => {
    return {
        eventTitle: snap.child('eventTitle').val(),
        eventId: snap.child('eventId').val(),
        eventDate: snap.child('eventDate').val(),
        eventLocation: snap.child('eventLocation').val(),
        eventDetails: snap.child('eventDetails').val(),
        eventHours: snap.child('eventHours').val(),
        eventImageURL: snap.child('eventImageURL').val(),
    }
}
export const rideConfirmationFromDict: (snap: DataSnapshot) => PNPRideConfirmation = (snap) => {
    return {
        userId: snap.child('userId').val(),
        eventId: snap.child('eventId').val(),
        confirmationTitle: snap.child('confirmationTitle').val(),
        rideId: snap.child('rideId').val(),
        passengers: snap.child('passengers').val(),
        date: snap.child('date').val(),
        directions: snap.child('directions').val()
    }
}
export const privateRideFromDict: (snap: DataSnapshot) => PNPPrivateRide = (snap) => {
    return {
        rideCreatorId: snap.child('rideCreatorId').val(),
        rideName: snap.child('rideName').val(),
        rideId: snap.child('rideId').val(),
        rideDestination: snap.child('rideDestination').val(),
        rideStartingPoint: snap.child('rideStartingPoint').val(),
        extraStopPoints: snap.child('extraStopPoints').val(),
        rideTime: snap.child('rideTime').val(),
        backTime: snap.child('backTime').val(),
        passengers: snap.child('passengers').val(),
        date: snap.child('date').val(),
        comments: snap.child('comments').val()
    }
}
export const publicRideFromDict: (snap: DataSnapshot) => PNPPublicRide = (snap) => {
    return {
        eventId: snap.child('eventId').val(),
        rideId: snap.child('rideId').val(),
        backTime: snap.child('backTime').val(),
        date: snap.child('date').val(),
        passengers: snap.child('passengers').val(),
        rideDestination: snap.child('rideDestination').val(),
        rideStartingPoint: snap.child('rideStartingPoint').val(),
        rideTime: snap.child('rideTime').val(),
        ridePrice: snap.child('ridePrice').val(),
    }
}

export const userFromDict: (snap: DataSnapshot) => PNPUser = (snap) => {
    let user: PNPUser = {
        email: snap.child('email').val(),
        image: snap.child('image').val(),
        customerId: snap.child('customerId').val(),
        coins: snap.child('coins').val(),
        birthDate: snap.child('birthDate').val(),
        phone: snap.child('phone').val(),
        name: snap.child('name').val(),
        favoriteEvents: snap.child('favoriteEvents').val(),
        producer: snap.child('producer').val(),
    }
    return user
}
