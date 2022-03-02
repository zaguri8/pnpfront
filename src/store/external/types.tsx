

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

export type PNPRide = {
    rideName?: string
    rideId: string
    rideDestination: string
    rideStartingPoint: string
    extraStopPoints: string[]
    rideTime: string
    ridePrice: string
    backTime: string
    passengers: string
    date: string
    comments: string
}

/**TODO: Coin Type, Add 'Coins as a path at databsase for each user' */


export type PNPUser = {
    image?: string
    name: string
    coins:number
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