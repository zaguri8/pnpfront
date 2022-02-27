import { Auth } from 'firebase/auth'
import { PNPEvent, PNPUser, PNPRide } from './types'
import { rideFromDict, userFromDict, eventFromDict } from './converters'
import { child, Database, DatabaseReference, get, onChildAdded, onValue, push, ref, remove, set, update } from 'firebase/database'
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


function CreateExternalStore(app: Firestore) {
    /*  get   */
    const events = () => collection(app, '/events')
    const rides = () => collection(app, "/rides")
    const users = () => collection(app, "/users")
    const errors = () => collection(app, '/errors')


    return {
        /*  events */
        getErrors: async () => {
            return await getDocs(errors()).then(ful => ful.docs.map(doc => doc.data))
        },
        getEvents: async () => {
            return await getDocs(events()).then(ful => ful.docs.map(doc => doc.data))
        },
        getRides: async (userId: String) => {
            return await getDoc(doc(app, `/rides/${userId}`))
                .then(d => d.data)
        },
        addError: async (error: string) => {
            return await addDoc(errors(), {
                error: error,
                date: new Date().toDateString()
            })
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

function CreateRealTimeDatabase(auth: Auth, app: Database) {
    const events = () => ref(app, '/events')
    const clubs = () => ref(app, '/events/clubs')
    const culture = () => ref(app, '/events/culture')
    const rides = () => ref(app, "/rides/public")
    const users = () => ref(app, "/users")
    return new Realtime(events(), clubs(), culture(), rides(), users(), auth)
}
export class Realtime {
    rides: DatabaseReference

    allEvents: DatabaseReference
    clubs: DatabaseReference
    culture: DatabaseReference

    users: DatabaseReference
    auth: Auth
    constructor(allEvents: DatabaseReference,
        clubs: DatabaseReference,
        culture: DatabaseReference,
        rides: DatabaseReference,
        users: DatabaseReference,
        auth: Auth) {
        this.allEvents = allEvents
        this.clubs = clubs
        this.culture = culture
        this.rides = rides
        this.users = users
        this.auth = auth
    }
    addListenerToClubEvents = (consume: (o: PNPEvent[]) => void) => {
        return onValue(this.clubs, snap => {
            const ret: PNPEvent[] = []
            snap.forEach(ev => {
                ret.push(eventFromDict(ev))
            })
            consume(ret)
        })
    }
    addListenerToCultureEvents = (consume: (o: PNPEvent[]) => void) => {
        return onValue(this.culture, snap => {
            const ret: PNPEvent[] = []
            snap.forEach(ev => {
                ret.push(eventFromDict(ev))
            })
            consume(ret)
        })
    }
    addListenerToRides = async (userId: string, consume: (o: PNPRide[] | null) => void) => {
        return onChildAdded(child(this.rides, userId), (snap) => {
            const ret: PNPRide[] = []
            snap.forEach(ev => {
                if (ret.length === 10) {
                    consume(ret)
                    return
                }
                ret.push(rideFromDict(ev))
            })
        })
    }
    addListenerToCurrentUser = async (userId: string, consume: (o: PNPUser) => void) => {
        return onValue(child(this.users, userId), (snap) => consume(userFromDict(snap)))
    }
    updateClubEvent = async (eventId: string, event: PNPEvent) => {
        return await update(child(this.clubs, eventId), event)
    }
    removeClubEvent = async (eventId: string) => {
        return await remove(child(this.clubs, eventId))
    }
    updateCultureEvent = async (eventId: string, event: PNPEvent) => {
        return await update(child(this.culture, eventId), event)
    }
    removeCultureEvent = async (eventId: string) => {
        return await remove(child(this.culture, eventId))
    }

    addEventRide = async (eventId: string, ride: PNPRide) => {
        const newRef = get(child(this.rides, 'public'))
        await newRef.then(d => d.size)
            .then(async size => await set(child(child(this.rides, size + ""), eventId), ride))
    }

    addRide = async (ride: PNPRide) => {
        const newRef = push(this.rides)
        ride.rideId = newRef.key!
        return await set(newRef, ride)
    }
    addClubEvent = async (event: PNPEvent) => {
        const newRef = push(this.clubs)
        event.eventId = newRef.key!
        return await set(newRef, event)
    }
    addCultureEvent = async (event: PNPEvent) => {
        const newRef = push(this.culture)
        event.eventId = newRef.key!
        return await set(newRef, event)
    }

    addUser = async (user: PNPUser) => {
        if (this.auth.currentUser == null) return
        return await set(child(this.users, this.auth.currentUser!.uid), user)
    }

    getEventById = async (id: string) => {
        return await get(this.allEvents)
            .then(data => {
                const c1 = data.child('clubs').child(id)
                const c2 = data.child('culture').child(id)
                return c1.exists() ? eventFromDict(c1) : c2.exists() ? eventFromDict(c2) : null
            })
    }
    getAllEventRidesById = async (eventId: string) => {
        return await get(child(this.rides, eventId))
            .then(snap => {
                const ret: PNPRide[] = []
                snap.forEach(ride => {
                    ret.push(rideFromDict(ride))
                })
                return ret
            })
    }

}

export default function Store(auth: Auth, db: Database, firestore: Firestore) {
    return {
        auth: auth,
        store: CreateExternalStore(firestore),
        realTime: CreateRealTimeDatabase(auth, db),
        temp: firestore
    }
}