

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
    rideName?: string
    rideId: string
    rideDestination: string
    rideStartingPoint: string
    extraStopPoints: string[]
    rideTime:string
    ridePrice: number
    backTime:string
    passengers: number
    date: string
    comments: string
}



export type PNPUser = {
    name: string
    email: string
    phone: string
    favoriteEvents: string[],
    birthDate: string
    producer: boolean
}

export type PNPEvent = {
    eventName: string
    eventLocation:string
    eventId: string
    eventProducerId: string
    eventDate: string
    eventDetails: string
    eventPrice:number
    eventHours: PNPEventHours
    eventAgeRange: PNPEventAgeRange
    expectedNumberOfPeople: number
    eventImageURL: string
}