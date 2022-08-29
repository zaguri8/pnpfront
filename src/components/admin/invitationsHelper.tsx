import { PassengersDictionary, PNPPrivateEvent, PNPRideConfirmation } from "../../store/external/types";

export const default_no_arrival = 'אישורי הגעה ללא הסעה'
export function getPassengers(confirmation: PNPRideConfirmation): number {
    if (!confirmation.passengers
        || confirmation.passengers === 'null'
        || confirmation.passengers === 'unset')
        return 1
    if (confirmation.passengers === '0' && confirmation.rideArrival)
        return 1
    return Number(confirmation.passengers)
}
export function getGuests(confirmation: PNPRideConfirmation): number {
    if (!confirmation.guests
        || confirmation.guests === 'null'
        || confirmation.guests === 'unset')
        return 1
    if (confirmation.guests === '0')
        return 1
    return Number(confirmation.guests)
}

export function populatePassengersDictionaryWithConfirmation(confirmation: PNPRideConfirmation,
    passengers: PassengersDictionary): PassengersDictionary {
    let num_passengers = getPassengers(confirmation)
    switch (confirmation.directionType) {
        case "1":
            passengers.to += num_passengers
            break;
        case "2":
            passengers.back += num_passengers
            break;
        case "3":
            passengers.twoWay += num_passengers
            break;
    }
    passengers.total += num_passengers;
    return passengers
}

export function getTotalAmountOfConfirmations(event: PNPPrivateEvent, map: { [dir: string]: PNPRideConfirmation[] } | undefined) {
    if (!map) return 0 // there are no confirmations
    let output = 0
    let amountMapping = new Map<string, boolean>()
    for (let entry of Object.entries(map)) {
        INNER: for (let conf of entry[1]) {
            let key = conf.userId;
            if (amountMapping.has(key)) continue INNER;
            if (event.eventWithGuests)
                output += getGuests(conf)
            else
                output += getPassengers(conf)
            amountMapping.set(key, true)
        }
    }
    return output
}

export function confirmationsPartition(confirmations: PNPRideConfirmation[]): { [dir: string]: PNPRideConfirmation[] } {
    let map: { [dir: string]: PNPRideConfirmation[] } = {}
    for (let conf of confirmations) {

        if (conf.splitGuestPassengers) {

            if (!map[default_no_arrival])
                map[default_no_arrival] = [{ ...conf }]
            else
                map[default_no_arrival].push({ ...conf })

            if (map[conf.directions])
                map[conf.directions].push({ ...conf, passengers: "" + (Number(conf.guests) - Math.abs((Number(conf.passengers) - Number(conf.guests)))) })
            else
                map[conf.directions] = [{ ...conf, passengers: "" + (Number(conf.guests) - Math.abs((Number(conf.passengers) - Number(conf.guests)))) }]
        } else {
            if (!conf.rideArrival) {
                if (!map[default_no_arrival])
                    map[default_no_arrival] = [conf]
                else
                    map[default_no_arrival].push(conf)
            } else if (map[conf.directions]) {
                map[conf.directions].push(conf)
            } else {
                map[conf.directions] = [conf]
            }
        }
    }
    return map
}

export function getPassengersAndGuests(destination: string, confirmations: PNPRideConfirmation[]): { passengers: PassengersDictionary, guests: number } {
    let passengers = { to: 0, back: 0, twoWay: 0, total: 0 };
    let guests = 0;
    for (let confirmation of confirmations) {
        passengers = populatePassengersDictionaryWithConfirmation(confirmation, passengers)
        if (destination === default_no_arrival)
            guests += getGuests(confirmation) - getPassengers(confirmation) + 1;
    }

    return { passengers, guests }
}

export function getInvitationRowGuests(event: PNPPrivateEvent, destination: string, confirmation: PNPRideConfirmation) {
    if (destination === default_no_arrival)
        return Math.max(1, getGuests(confirmation) - getPassengers(confirmation))
    else {
        if (event.eventWithGuests && event.eventWithPassengers)
            return Math.max(1, getGuests(confirmation) - (Math.abs(getGuests(confirmation) - getPassengers(confirmation))))
        else if (event.eventWithPassengers) {
            return Math.max(1, getPassengers(confirmation))
        } else {
            return Math.max(1, getGuests(confirmation))
        }
    }
}