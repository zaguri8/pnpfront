

export type PNPEventGraphics = {
    varArg1: string
}
export type PNPEventHours = {
    startHour: string
    endHour: string
}
export type PNPEventAgeRange = {
    minAge: string
    maxAge: string
}

export type PNPTransactionConfirmation = {
    eventId: string
    rideId: string
    amount: string
    twoWay: boolean
    ridesLeft: number
    confirmationVoucher: string
}

// TODO : Add Ride Status 20/03/22

export type PNPPublicRide = {
    rideId: string
    eventId: string
    rideDestination: string
    rideStartingPoint: string
    rideTime: string
    ridePrice: string
    backTime: string
    passengers: string
    date: string
    extras: PNPRideExtras
}

export type PNPRideExtras = {
    isRidePassengersLimited?: boolean
    rideStatus?: 'on-going' | 'sold-out' | 'running-out'
    rideMaxPassengers?: string
    rideDirection: '2' | '1'
    twoWay: boolean
    exactStartPoint?: string
    exactBackPoint?: string
}


export type PNPPrivateRide = {
    rideCreatorId: string
    rideName?: string
    rideId: string
    rideDestination: string
    rideStartingPoint: string
    extraStopPoints: string[]
    rideTime: string
    backTime: string
    passengers: string
    date: string
    comments: string
}

export type PNPCoupon = {
    couponId: string
    couponValue: string
    couponExpirationDate: string
}


export type PNPRideRequest = {
    eventId: string,
    requestUserId: string,
    eventName: string,
    fullName: string,
    passengers: string,
    names: string[],
    phoneNumber: string,
    startingPoint: string,
}

export type PNPUser = {
    image?: string
    customerId: string
    name: string
    admin: boolean
    coins: number
    email: string
    phone: string
    favoriteEvents: string[],
    birthDate: string
    producer: boolean
}
export type PNPEvent = {
    eventName: string
    eventLocation: string
    eventId: string
    eventProducerId: string
    eventDate: string
    eventCanAddRides: boolean
    eventDetails: string
    eventType: string
    eventPrice: string
    eventHours: PNPEventHours
    eventAgeRange: PNPEventAgeRange
    expectedNumberOfPeople: string
    eventAttention: PNPEventAttention
    eventImageURL: string
    eventMobileImageURL?: string
}

export type PNPEventAttention = {
    eventAttention1: string,
    eventAttention2: string
}

export type PNPPrivateEvent = {
    eventTitle: string
    eventLocation: string
    eventId: string
    eventGuests: boolean
    registrationRequired: boolean
    eventFullInvitation: boolean
    eventProducerId: string
    eventDate: string
    eventDetails: string
    eventHours: PNPEventHours
    eventImageURL?: string
}

export type UserDateSpecificStatistics = {
    date: string
    numberOfUserAttended: number
}

export type UserEnterStatistics = {
    stats: UserDateSpecificStatistics[]
}

export type PNPRideConfirmation = {
    userId: string
    userName: string
    phoneNumber: string
    rideId: string
    rideArrival: boolean
    eventId: string
    passengers?: string
    guests: string
    confirmationTitle: string
    date: string
    directions: string
    directionType: string
}


export enum PNPRideDirectionNumber {
    to_event = 1,
    back_from_event = 2,
    both_ways = 3
}

export enum PNPRideDirection {
    one_way = "to the event",
    second_way = "back from the event",
    both_ways = "to & back from the event"
}

export const eventTypes = [
    "מסיבות ומועדונים",
    "משחקי כדורגל",
    "הופעות",
    "פסטיבלים",
    "ברים",
    "ספורט כללי",
    "אירועי ילדים"
]


export type PNPError = {
    errorId: string
    date: string
    type: string
    error: string
    extraData?: { [key: string]: any }
}
