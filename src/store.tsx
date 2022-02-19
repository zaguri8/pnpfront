import { Auth, } from 'firebase/auth'
import { child, Database, DataSnapshot, onChildAdded, onValue, push, ref, remove, set, update } from 'firebase/database'
import {
    collection,
    getDoc,
    doc,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    Firestore
} from 'firebase/firestore'


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

export function CreateExternalStore(app: Firestore) {
    /*  get   */
    const events = () => collection(app, '/events')
    const rides = () => collection(app, "rides")
    const users = () => collection(app, "users")
    return {
        /*  events */
        getEvents: async () => {
            return await getDocs(events()).
                then(ful => ful.docs.map(doc => doc.data))
        },
        getRides: async (userId: String) => {
            return await getDoc(doc(app, `/rides/${userId}`))
                .then(d => d.data)
        },
        addEvent: async (event: PNPEvent) => {
            return await addDoc(events(), event)
        },
        removeEvent: async (eventId: String) => {
            return await deleteDoc(doc(app, `/events/${eventId}`))
        },
        updateEvent: async (event: PNPEvent) => {
            return await updateDoc(doc(app, `/events/${event.eventId}`), event)
        },

        /* rides */
        addRide: async (ride: PNPRide) => {
            return await addDoc(collection(app, "rides"), ride)
        }

    }
}

const eventfromDict = (snap: DataSnapshot) => {
    return {
        eventId: snap.child('eventId').val(),
        eventProducerId: snap.child('eventProducerId').val(),
        eventGraphics: snap.child('eventGraphics').val(),
        eventHours: snap.child('eventHours').val(),
        eventAgeRange: snap.child('eventAgeRange').val(),
        eventPrice: snap.child('eventPrice').val(),
        expectedNumberOfPeople: snap.child('expectedNumberOfPeople').val(),
        eventImageURL: snap.child('eventImageURL').val(),
    }
}

const rideFromDict = (snap: DataSnapshot) => {
    return {
        rideId: snap.child('rideId').val(),
        rideDestination: snap.child('rideDestination').val(),
        rideStartingPoint: snap.child('rideStartingPoint').val(),
        passengers: snap.child('passengers').val(),
        date: snap.child('date').val(),
        comments: snap.child('comments').val()
    }
}
const userFromDict = (snap: DataSnapshot) => {
    return {
        email: snap.child('email').val(),
        phone: snap.child('phone').val(),
        name: snap.child('name').val(),
        producer: snap.child('producer').val(),
    }
}

export function CreateRealTimeDatabase(auth: Auth, app: Database) {
    const clubs = () => ref(app, '/events/clubs')
    const culture = () => ref(app, '/events/culture')
    const rides = () => ref(app, "/rides")
    const users = () => ref(app, "/users")
    return {
        addListenerToClubEvents: async (consume: (o: PNPEvent[]) => void) => {
            onValue(clubs(), snap => {
                const ret: PNPEvent[] = []
                snap.forEach(ev => {
                    if (ret.length === 10) {
                        consume(ret)
                        return
                    }
                    ret.push(eventfromDict(ev))
                })
            })
        },
        addListenerToCultureEvents: async (consume: (o: PNPEvent[]) => void) => {
            onValue(culture(), snap => {
                const ret: PNPEvent[] = []
                snap.forEach(ev => {
                    if (ret.length === 10) {
                        consume(ret)
                        return
                    }
                    ret.push(eventfromDict(ev))
                })
            })
        },
        addListenerToRides: async (userId: string, consume: (o: PNPRide[] | null) => void) => {
            onChildAdded(child(rides(), userId), (snap) => {
                const ret: PNPRide[] = []
                snap.forEach(ev => {
                    if (ret.length === 10) {
                        consume(ret)
                        return
                    }
                    ret.push(rideFromDict(ev))
                })
            })
        },
        addListenerToCurrentUser: async (userId: string, consume: (o: PNPUser) => void) => {
            onValue(child(users(), userId), (snap) => consume(userFromDict(snap)))
        },
        updateClubEvent: async (eventId: string, event: PNPEvent) => {
            return await update(child(clubs(), eventId), event)
        },
        removeClubEvent: async (eventId: string) => {
            return await remove(child(clubs(), eventId))
        },
        updateCultureEvent: async (eventId: string, event: PNPEvent) => {
            return await update(child(culture(), eventId), event)
        },
        removeCultureEvent: async (eventId: string) => {
            return await remove(child(culture(), eventId))
        },
        addRide: async (ride: PNPRide) => {
            const newRef = push(rides())
            ride.rideId = newRef.key!
            return await set(newRef, ride)
        },
        addClubEvent: async (event: PNPEvent) => {
            const newRef = push(clubs())
            event.eventId = newRef.key!
            return await set(newRef, event)
        },
        addCultureEvent: async (event: PNPEvent) => {
            const newRef = push(culture())
            event.eventId = newRef.key!
            return await set(newRef, event)
        },
        addUser: async (user: PNPUser) => {
            if (auth.currentUser == null) return
            return await set(child(users(), auth.currentUser!.uid), user)
        }
    }
}

export function CreateAuthService(auth: Auth) {

    return {
        signOut: async () => await auth.signOut()
    }
}

