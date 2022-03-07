

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

export type PNPUser = {
    image?: string
    name: string
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
    eventDetails: string
    eventPrice: string
    eventHours: PNPEventHours
    eventAgeRange: PNPEventAgeRange
    expectedNumberOfPeople: string
    eventImageURL: string
}

export type PNPPrivateEvent = {
    eventTitle: string
    eventLocation: string
    eventId: string
    eventDate: string
    eventDetails: string
    eventHours: PNPEventHours
    eventImageURL?: string
}

export type PNPRideConfirmation = {
    userId: string
    rideId: string
    eventId: string
    passengers?: string
    confirmationTitle:string
    date: string
    directions: string
}

export enum PNPRideDirection {
    one_way = "to the event",
    second_way = "back from the event",
    both_ways = "to & back from the event"
}

export type PNPError = {
    errorId: string
    date: string
    type: string
    error: string
}
