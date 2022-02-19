

export type PNPEventGraphics = {
    varArg1: string
}
export type PNPEventHours = {
    startHour: number
    endHour: number
}
export type PNPEventAgeRange = {
    minAge: number
    maxAge: number
}

export type PNPRide = {
    rideId: string
    rideDestination: string
    rideStartingPoint: string
    passengers: number
    date: number
    comments: string
}

export type PNPUser = {
    email: string
    phone: string
    name: string
    producer: boolean
}

export type PNPEvent = {
    eventId: string
    eventProducerId: string
    eventGraphics: PNPEventGraphics
    eventHours: PNPEventHours
    eventAgeRange: PNPEventAgeRange
    eventPrice: number
    expectedNumberOfPeople: number
    eventImageURL: string
}