

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
    name: string
    email: string
    phone: string
    favoriteEvents:string[],
    birthDate: string
    producer: boolean
}

export type PNPEvent = {
    eventName:string
    eventId: string
    eventProducerId: string
    eventDate:string
    eventDetails:string
    eventHours: PNPEventHours
    eventAgeRange: PNPEventAgeRange
    eventPrice: number
    expectedNumberOfPeople: number
    eventImageURL: string
}