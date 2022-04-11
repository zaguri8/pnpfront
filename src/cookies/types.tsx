export type PNPPageStats = {
    lastCached: number
    page: string
}

export enum PNPPage {
    home = 'home', login = 'login', register = 'register', createEvent = 'events', createRide = 'rides', myAccount = 'account',
}
