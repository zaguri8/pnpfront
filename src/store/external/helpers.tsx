import { dateStringFromDate } from "../../components/utilities/functions";
import { getCurrentDate } from "../../utilities";
import { PNPPrivateEvent } from "./types";

export function getDefaultPrivateEvent(): PNPPrivateEvent {
    return {
        eventTitle: '',
        eventLocation: 'null',
        eventId: 'null',
        eventDate: dateStringFromDate(getCurrentDate()),
        eventDetails: 'חתונה',
        eventHours: { startHour: '00:00', endHour: '00:00' }
    }
}