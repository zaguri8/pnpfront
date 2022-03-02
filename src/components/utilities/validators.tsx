import { PNPEvent, PNPRide } from "../../store/external/types";

export function isValidHttpUrl(string: string): boolean {
  let url;

  try {
    url = new URL(string.split('blob:')[1]);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export function isValidEvent(event: PNPEvent): boolean {
  return event !== undefined
    && event !== null
    && (event.eventAgeRange !== null
      && event.eventAgeRange.minAge !== null
      && event.eventAgeRange.maxAge !== 'null')
    && (event.eventDate !== null
      && event.eventDate !== 'null')
    && (event.eventDetails !== null
      && event.eventDetails !== 'null')
    && (event.eventHours !== null
      && event.eventHours.startHour !== null
      && event.eventHours.endHour !== null
      && event.eventHours.startHour !== 'null'
      && event.eventHours.endHour !== 'null')
    && event.eventId !== null
    && (event.eventImageURL !== null
      && event.eventImageURL !== 'null')
    && (event.eventLocation !== null
      && event.eventLocation !== 'null')
    && (event.eventName !== null
      && event.eventName !== 'null')
    && (event.eventPrice !== null
      && event.eventPrice !== 'null')
    && (event.eventProducerId !== null
      && event.eventProducerId !== 'null')
}

export function isValidRide(ride: PNPRide): boolean {
  return ride !== undefined
    && ride !== null
    && (ride.backTime !== null
      && ride.backTime !== 'null')
    && (ride.comments !== null
      && ride.comments !== 'null')
    && (ride.date !== null
      && ride.date !== 'null')
    && (ride.passengers !== null
      && ride.passengers !== 'null')
    && (ride.rideDestination !== null
      && ride.rideDestination !== 'null'
      && ride.rideId !== null
      && ride.rideStartingPoint !== null
      && ride.rideStartingPoint !== 'null')
    && (ride.rideTime !== null
      && ride.rideTime !== 'null')
}