import { Auth } from 'firebase/auth'
import { PNPEvent, PNPUser, PNPPublicRide, PNPPrivateEvent, PNPError, PNPRideConfirmation, PNPPrivateRide } from './types'
import { privateRideFromDict, privateEventFromDict, userFromDict, eventFromDict, publicRideFromDict, rideConfirmationFromDict } from './converters'
import { SnapshotOptions } from 'firebase/firestore'
import { DocumentData } from 'firebase/firestore'
import { child, Database, DatabaseReference, get, onChildAdded, onValue, push, ref, remove, set, update } from 'firebase/database'
import {
    collection,
    getDoc,
    doc,
    Firestore,
    QuerySnapshot,
    DocumentReference
} from 'firebase/firestore'
import { isValidPrivateEvent } from '../../components/utilities/validators'
import { FirebaseApp } from 'firebase/app'

export type ExternalStoreActions = {
    /*  events */
    getErrors: () => Promise<QuerySnapshot<object> | ((options?: SnapshotOptions | undefined) => DocumentData)[]>;
    getEvents: () => Promise<QuerySnapshot<object> | ((options?: SnapshotOptions | undefined) => DocumentData)[]>;
    getRides: (userId: String) => Promise<QuerySnapshot<object> | ((options?: SnapshotOptions | undefined) => DocumentData)[] | ((options?: SnapshotOptions | undefined) => DocumentData | undefined)>;
    addError: (error: string) => Promise<DocumentReference<DocumentData>>;
    addEvent: (event: PNPEvent) => Promise<DocumentReference<DocumentData>>;
    removeEvent: (eventId: String) => Promise<void>;
    updateEvent: (event: PNPEvent) => Promise<void>;
    /* rides */
    addRide: (ride: PNPPublicRide) => Promise<DocumentReference<DocumentData>>;

}

function CreateRealTimeDatabase(auth: Auth, db: Database) {
    return new Realtime(auth, db)
}
export class Realtime {
    private rides: DatabaseReference
    private allEvents: DatabaseReference
    private errs: DatabaseReference
    private users: DatabaseReference
    private auth: Auth
    constructor(auth: Auth, db: Database) {
        this.allEvents = ref(db, '/events')
        this.rides = ref(db, "/rides")
        this.users = ref(db, '/users')
        this.errs = ref(db, '/errors')
        this.auth = auth
    }
    /**
     * addError
     * @param error error to be added to db
     * @returns new reference callback
     */
    async addError(error: PNPError) {
        const newPath = push(child(this.errs, error.type))
        error.errorId = newPath.key!
        return await set(newPath, error)
    }

    /**
     * createError
     * @param type error type
     * @param e error to be created
     * @returns new refernce callback
     */
    async createError(type: string, e: any) {
        const date = new Date().toDateString()
        let err: PNPError = {
            type: type,
            date: date,
            errorId: '',
            error: e
        }
        return this.addError(err)
    }

    /**
     * getRideConfirmationByEventId
     * @param eventId to get confirmation for
     * @returns confirmation of event attendance for current user if exists
     */
    async getRideConfirmationByEventId(eventId: string): Promise<PNPRideConfirmation | void | null> {
        if (this.auth.currentUser != null) {
            return await get(child(child(child(this.rides, 'confirmations'), this.auth.currentUser.uid), eventId))
                .then(snapshot => {
                    if (snapshot.exists()) {
                        return rideConfirmationFromDict(snapshot)
                    } else return null;
                })
                .catch((e) => this.createError('getRideConfirmationByEventId', e))
        }
    }

    /**
     * addRideConfirmation
     * @param confirmation confirmation to be added for current user
     * @returns new reference callback
     */
    async addRideConfirmation(confirmation: PNPRideConfirmation): Promise<object | void> {
        if (this.auth.currentUser != null) {
            return await set(child(child(child(this.rides, 'confirmations'),
                this.auth.currentUser.uid),
                confirmation.eventId),
                confirmation)
                .catch((e) => this.createError('addRideConfirmation', e))
        }
    }
    /**
       * addPublicRide
       * @param ride a public ride to be added
       * @returns a new reference or error reference
       */
    addPublicRide = async (eventId: string, ride: PNPPublicRide): Promise<object | void> => {
        const newRef = get(child(child(this.rides, 'public'), eventId))
        await newRef.then(d => d.size)
            .then(async size => {
                if (size === null || size === undefined || size === 0) {
                    return await set(child(child(child(this.rides, 'public'), eventId), '0'), ride)
                } else {
                    return await set(child(child(child(this.rides, 'public'), eventId), size + ""), ride)
                }

            })
            .catch((e) => this.createError('addPublicRide', e))
    }

    /**
     * addPrivateRide
     * @param ride a private ride to be added
     * @returns a new reference or error reference
     */
    addPrivateRide = async (ride: PNPPrivateRide): Promise<object | void> => {
        if (this.auth.currentUser) {
            const p = push(child(child(child(this.rides, 'private'), 'ridesForPeople'), this.auth.currentUser!.uid))
            ride.rideId = p.key!
            return await set(p, ride)
                .catch((e) => this.createError('addPublicRide', e))
        }
    }

    /**
     * addListenerToClubEvents
     * @param consume a callback to consume the events array
     * @returns onValue change listener for club events
     */
    addListenerToClubEvents = (consume: (o: PNPEvent[]) => void) => {
        return onValue(child(child(this.allEvents, 'public'), 'clubs'), snap => {
            const ret: PNPEvent[] = []
            snap.forEach(ev => {
                ret.push(eventFromDict(ev))
            })
            consume(ret)
        })
    }
    /**
   * addListenerToCultureEvents
   * @param consume a callback to consume the events array
   * @returns onValue change listener for culture events
   */
    addListenerToCultureEvents = (consume: (o: PNPEvent[]) => void) => {
        return onValue(child(child(this.allEvents, 'public'), 'culture'), snap => {
            const ret: PNPEvent[] = []
            snap.forEach(ev => {
                ret.push(eventFromDict(ev))
            })
            consume(ret)
        })
    }



    /**
     * addListenerToCurrentUser
     * @param userId a userid to be listened to
     * @param consume callback that consumes the PNP user
     * @returns onValue change listener for user
     */
    addListenerToCurrentUser = async (consume: (o: PNPUser) => void) => {
        if (this.auth.currentUser != null)
            return onValue(child(this.users, this.auth.currentUser!.uid), (snap) => consume(userFromDict(snap)))
    }
    /**
     * updateClubEvent
     * @param eventId eventid to be updated
     * @param event event info to be updated
     * @returns update callback
     */
    updateClubEvent = async (eventId: string, event: object) => {
        return await update(child(child(child(this.allEvents, 'public'), 'clubs'), eventId), event)
            .catch((e) => this.createError('updateClubEvent', e))
    }
    /**
     * removeClubEvent
     * @param eventId eventid to be removed
     * @returns remove callback
     */
    removeClubEvent = async (eventId: string) => {
        return await remove(child(child(this.allEvents, 'clubs'), eventId))
            .catch((e) => this.createError('removeClubEvent', e))
    }
    /**
   * updateCultureEvent
   * @param eventId eventid to be updated
   * @param event event info to be updated
   * @returns update callback
   */
    updateCultureEvent = async (eventId: string, event: object) => {
        return await update(child(child(child(this.allEvents, 'public'), 'culture'), eventId), event)
            .catch(e => {
                const date = new Date().toDateString()
                let err: PNPError = {
                    type: 'updateCultureEvent',
                    date: date,
                    errorId: '',
                    error: e
                }
                return this.addError(err)
            })
    }

    /**
     * updatePrivateEvent
     * @param eventId eventId to be updated
     * @param event event values to be updated
     * @returns update callback
     */
    updatePrivateEvent = async (eventId: string, event: object) => {
        return await update(child(child(this.allEvents, 'private'), eventId), event)
    }

    /**
     * updatePrivateRide
     * @param eventId rideId to be updated
     * @param event ride values to be updated
     * @returns update callback
     */
    updatePrivateRide = async (rideId: string, ride: object) => {
        return await update(child(child(this.rides, 'private'), rideId), ride)
    }
    /**
      * updateCurrentUser
      * @param user user values to be updated
      * @returns update callback
      */
    updateCurrentUser = async (user: object) => {
        if (this.auth.currentUser)
            return await update(child(this.users, this.auth.currentUser!.uid), user)
    }

    /**
 * removeCultureEvent
 * @param eventId eventid to be removed
 * @returns remove callback
 */
    removeCultureEvent = async (eventId: string) => {
        return await remove(child(child(child(this.allEvents, 'public'), 'culture'), eventId))
            .catch((e) => this.createError('removeCultureEvent', e))
    }

    /**
     * addClubEvent
     * @param event event to be added
     * @returns new reference callback
     */

    addClubEvent = async (event: PNPEvent): Promise<object | void> => {
        const newRef = push(child(child(this.allEvents, 'public'), 'clubs'))
        event.eventId = newRef.key!
        return await set(newRef, event)
            .catch((e) => this.createError('addClubEvent', e))
    }
    /**
       * addCultureEvent
       * @param event event to be added
       * @returns new reference callback
       */
    addCultureEvent = async (event: PNPEvent): Promise<object | void> => {
        const newRef = push(child(child(this.allEvents, 'public'), 'culture'))
        event.eventId = newRef.key!
        return await set(newRef, event)
            .catch((e) => this.createError('addCultureEvent', e))
    }

    /**
     * 
     * @param image image to be updated for user
     * @returns update callback
     */
    updateUserImage = async (image: string): Promise<object | void> => {
        return await this.updateCurrentUser({ image: image })
            .catch((e) => this.createError('updateUserImage', e))
    }


    /**
     * addUser
     * @param user a user to be added to db
     * @returns new reference callback
     */
    addUser = async (user: PNPUser): Promise<object | void> => {
        if (this.auth.currentUser === null) return
        return await set(child(this.users, this.auth.currentUser!.uid), user)
            .catch((e) => this.createError('addUser', e))
    }
    /**
 * addUser
 * @param user a user to be added to db
 * @returns new reference callback
 */
    static addUserNoAuth = async (path: DatabaseReference, user: PNPUser): Promise<object | void> => {
        return await set(path, user)
    }



    /**
     * 
     * @param id private event to be fetched by id
     * @returns private event if found
     */
    getPrivateEventById = async (id: string): Promise<PNPPrivateEvent | void> => {
        return await get(child(child(this.allEvents, 'private'), id))
            .then(privateEventFromDict).catch((e) => this.createError('getPrivateEventById', e))
    }

    /**
     * getPrivateEventRidesById
     * @param id eventId to fetch rides for
     * @returns all rides for given event
     */
    getPrivateEventRidesById = async (id: string): Promise<PNPPublicRide[] | void> => {
        return await get(child(child(child(this.rides, 'private'), 'ridesForEvents'), id))
            .then((snap) => {
                const ret: PNPPublicRide[] = []
                snap.forEach(ride => {
                    ret.push(publicRideFromDict(ride))
                })
                return ret
            }).catch((e) => this.createError('getPrivateEventRidesById', e))
    }
    /**
       * getPublicRidesByEventId
       * @param eventId eventId to fetch rides for
       * @returns all rides for given event
       */
    getPublicRidesByEventId = async (eventId: string): Promise<PNPPublicRide[] | void> => {
        return await get(child(child(this.rides, 'public'), eventId))
            .then(snap => {
                const ret: PNPPublicRide[] = []
                snap.forEach(ride => {
                    ret.push(publicRideFromDict(ride))
                })
                return ret
            }).catch((e) => this.createError('getPublicRidesByEventId', e))
    }

    /**
     * getPublicEventById
     * @param id eventid to fetch
     * @returns event by id
     */
    getPublicEventById = async (id: string): Promise<PNPEvent | void | null> => {
        return await get(child(this.allEvents, 'public'))
            .then(data => {
                const c1 = data.child('clubs').child(id)
                const c2 = data.child('culture').child(id)
                return c1.exists() ? eventFromDict(c1) : c2.exists() ? eventFromDict(c2) : null
            }).catch((e) => this.createError('getPublicEventById', e))
    }
}

export type FirebaseTools = {
    auth: Auth,
    realTime: Realtime,
    temp: Firestore
}
export default function Store(auth: Auth, db: Database, firestore: Firestore): FirebaseTools {
    return {
        auth: auth,
        realTime: CreateRealTimeDatabase(auth, db),
        temp: firestore
    }
}


