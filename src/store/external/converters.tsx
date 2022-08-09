
import { DataSnapshot } from "firebase/database"
import { PNPUser, PNPEvent, PNPPrivateRide, PNPTransactionConfirmation, PNPRideConfirmation, PNPPublicRide, PNPPrivateEvent, PNPRideRequest, RegisterFormExtras, PCustomerData, PProductData } from "./types"
import { PPaymentPageData } from './types'


export const rideRequestFromDict: (snap: DataSnapshot) => PNPRideRequest = (snap) => {
    return {
        eventId: snap.child('eventId').val(),
        requestUserId: snap.child('requestUserId').val(),
        eventName: snap.child('eventName').val(),
        fullName: snap.child('fullName').val(),
        passengers: snap.child('passengers').val(),
        names: snap.child('names').val(),
        phoneNumber: snap.child('phoneNumber').val(),
        startingPoint: snap.child('startingPoint').val(),
        eventAgeRange: snap.child('eventAgeRange').val(),
        eventPrice: snap.child('eventPrice').val(),
        expectedNumberOfPeople: snap.child('expectedNumberOfPeople').val(),
        eventImageURL: snap.child('eventImageURL').val(),
    }

}

export const pPaymentPageDataFromDict: (snap: DataSnapshot) => PPaymentPageData = (snap) => {
    return {
        'payment_page_uid': snap.child('payment_page_uid').val(),//'4e7ad1b7-3ac6-4b3d-b138-2effa8a19ca0',
        'expiry_datetime': snap.child('expiry_datetime').val(),// '30',
        "refURL_success": snap.child('refURL_success').val(),//"https://nadavsolutions.com/gserver/pnp/transactions/add",
        'more_info': snap.child('more_info').val(), //unique_transaction_live_id,
        'customer': snap.child('customer').val(),
        'items': snap.child('items').val(),
        'amount': snap.child('amount').val(),
        'payments': snap.child('payments').val(),
        'currency_code': snap.child('currency_code').val(),
        'sendEmailApproval': snap.child('sendEmailApproval').val(),
        'sendEmailFailure': snap.child('sendEmailFailure').val()
    }
}
export const pPaymentTransactionDataFromDict: (snap: DataSnapshot) => { customer: PCustomerData, product: PProductData } = (snap) => {
    return {
        'customer': snap.child('customer').val(),//'4e7ad1b7-3ac6-4b3d-b138-2effa8a19ca0',
        'product': snap.child('product').val()
    }
}
export const eventFromDict: (snap: DataSnapshot) => PNPEvent = (snap) => {
    return {
        eventId: snap.child('eventId').val(),
        eventName: snap.child('eventName').val(),
        eventShowsInGallery: snap.child('eventShowsInGallery').val(),
        eventProducerId: snap.child('eventProducerId').val(),
        eventSendsSMS:snap.child('eventSendsSMS').val(),
        eventCanAddRides: snap.child('eventCanAddRides').val(),
        eventDate: snap.child('eventDate').val(),
        eventType: snap.child('eventType').val(),
        eventAttention: snap.child('eventAttention').val(),
        eventLocation: snap.child('eventLocation').val(),
        eventDetails: snap.child('eventDetails').val(),
        eventHours: snap.child('eventHours').val(),
        eventAgeRange: snap.child('eventAgeRange').val(),
        eventPrice: snap.child('eventPrice').val(),
        expectedNumberOfPeople: snap.child('expectedNumberOfPeople').val(),
        eventImageURL: snap.child('eventImageURL').val(),
        eventMobileImageURL: snap.child('eventMobileImageURL').val(),
    }
}

export function toDictionary<T>(
    snap: DataSnapshot): T {
    let dictionary: any = {}
    snap.forEach(child => {
        dictionary[child.key!] = child.val()
    })
    return dictionary as T
}

export const registrationSettingsFromDict: (snap: DataSnapshot) => RegisterFormExtras = (snap) => {
    return {
        requireBirthDate: snap.child('requireBirthDate').val(),
        requireFavoriteEvents: snap.child('requireFavoriteEvents').val(),
    }
}

export const privateEventFromDict: (snap: DataSnapshot) => PNPPrivateEvent = (snap) => {
    return {
        eventTitle: snap.child('eventTitle').val(),
        eventId: snap.child('eventId').val(),
        eventShowsInGallery: snap.child('eventShowsInGallery').val(),
        registrationRequired: snap.child('registrationRequired').val(),
        eventWithGuests: snap.child('eventWithGuests').val(),
        eventWithPassengers: snap.child('eventWithPassengers').val(),
        eventProducerId: snap.child('eventProducerId').val(),
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
        phoneNumber: snap.child('phoneNumber').val(),
        splitGuestPassengers: snap.child('splitGuestPassengers').val(),
        directionType: snap.child('directionType').val(),
        guests: snap.child('guests').val(),
        rideArrival: snap.child('rideArrival').val(),
        userName: snap.child('userName').val(),
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

export const transactionConfirmationFromDict: (snap: DataSnapshot) => PNPTransactionConfirmation = (snap) => {
    return {
        eventId: snap.child('eventId').val(),
        twoWay: snap.child('twoWay').val(),
        amount: snap.child('amount').val(),
        ridesLeft: snap.child('ridesLeft').val(),
        rideId: snap.child('rideId').val(),
        confirmationVoucher: snap.child('confirmationVoucher').val()
    }
}

export const publicRideFromDict: (snap: DataSnapshot) => PNPPublicRide = (snap) => {
    return {
        eventId: snap.child('eventId').val(),
        rideId: snap.child('rideId').val(),
        backTime: snap.child('backTime').val(),
        date: snap.child('date').val(),
        passengers: snap.child('passengers').val(),
        extras: snap.child('extras').val(),
        rideDestination: snap.child('rideDestination').val(),
        rideStartingPoint: snap.child('rideStartingPoint').val(),
        rideTime: snap.child('rideTime').val(),
        ridePrice: snap.child('ridePrice').val(),
    }
}

export const userFromDict: (snap: DataSnapshot) => PNPUser = (snap) => {
    const user: PNPUser = {
        email: snap.child('email').val(),
        image: snap.child('image').val(),
        admin: snap.child('admin').val(),
        producingEventId:snap.child('producingEventId').val(),
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

export function getEventType(event: PNPEvent) {
    let type = 'clubs'
    switch (event.eventType) {
        case "הופעות":
            type = 'concerts'
            break
        case "מסיבות ומועדונים":
            type = 'clubs'
            break
        case "משחקי כדורגל":
            type = 'football'
            break
        case "פסטיבלים":
            type = 'fetivals'
            break
        case "אירועים פרטיים":
            type = 'private events'
            break
        case "חתונות":
            type = 'weddings'
            break
        case "ברים":
            type = 'bars'
            break
        case "ספורט כללי":
            type = 'sports'
            break
        case "אירועי ילדים":
            type = 'children'
            break
    }

    return type
}

export function getEventTypePriority(e: string) {
    let priority = 0
    switch (e) {
        case "concerts":
            priority = 4
            break
        case "private events":
            priority = 8
            break
        case "clubs":
            priority = 0
            break
        case "football":
            priority = 3
            break
        case "fetivals":
            priority = 2
            break
        case "bars":
            priority = 1
            break
        case "weddings":
            priority = 7
            break
        case "sports":
            priority = 5
            break
        case "children":
            priority = 6
            break
    }

    return priority
}
export function getEventTypeFromString(t: string) {
    let type = 'clubs'
    switch (t) {
        case "concerts":
            type = 'הופעות'
            break
        case "private events":
            type = 'אירועים פרטיים'
            break
        case "clubs":
            type = 'מסיבות ומועדונים'
            break
        case "football":
            type = 'משחקי כדורגל'
            break
        case "fetivals":
            type = 'פסטיבלים'
            break
        case "bars":
            type = 'ברים'
            break;
        case "weddings":
            type = "חתונות"
            break
        case "sports":
            type = 'ספורט כללי'
            break
        case "children":
            type = 'אירועי ילדים'
            break
    }

    return type
}