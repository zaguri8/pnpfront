import { Auth } from 'firebase/auth'
import { PNPEvent, PNPUser, PNPPublicRide, PNPPrivateEvent, PNPError, PNPRideConfirmation, PNPPrivateRide, PNPRideRequest } from './types'
import { privateRideFromDict, privateEventFromDict, userFromDict, eventFromDict, publicRideFromDict, rideConfirmationFromDict, rideRequestFromDict } from './converters'
import { SnapshotOptions } from 'firebase/firestore'
import { DocumentData } from 'firebase/firestore'
import { child, Database, DatabaseReference, DataSnapshot, get, onChildAdded, onValue, push, ref, remove, set, update } from 'firebase/database'
import {
    collection,
    getDoc,
    doc,
    Firestore,
    QuerySnapshot,
    DocumentReference
} from 'firebase/firestore'
import { isValidPrivateEvent } from '../validators'
import { FirebaseApp } from 'firebase/app'
import { createNewCustomer } from '../payments'
import { TransactionFailure, TransactionSuccess } from '../payments/types'

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

type PNPEventsList = {
    clubs: PNPEvent[]
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
    private transactions: DatabaseReference
    constructor(auth: Auth, db: Database) {
        this.allEvents = ref(db, '/events')
        this.rides = ref(db, "/rides")
        this.users = ref(db, '/users')
        this.errs = ref(db, '/errors')
        this.transactions = ref(db, '/transactions')
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
     * addError
     * @param error error to be added to db
     * @returns new reference callback
     */
    static async addError(error: PNPError, db: Database) {
        const newPath = push(child(ref(db, 'errors'), error.type))
        error.errorId = newPath.key!
        return await set(newPath, error)
    }



    getAllPublicEvents = (consume: (events: PNPEvent[]) => void) => {
        const pRef = this.allEvents
        return onValue(child(pRef, 'public'), (snap) => {
            let events: PNPEvent[] = []
            snap.forEach(eventCategorySnap => {
                eventCategorySnap.forEach(eventSnap => {
                    events.push(eventFromDict(eventSnap))
                })
            })
            consume(events)
        })
    }
    getAllPrivateEvents = (consume: (events: PNPEvent[]) => void) => {
        const pRef = this.allEvents
        return onValue(child(pRef, 'private'), (snap) => {
            let events: PNPEvent[] = []
            snap.forEach(eventCategorySnap => {
                eventCategorySnap.forEach(eventSnap => {
                    events.push(eventFromDict(eventSnap))
                })
            })
            consume(events)
        })
    }

    async addRideRequest(request: PNPRideRequest) {
        if (!this.auth.currentUser)
            return
        const newRef = push(child(child(this.rides, 'rideRequests'), request.eventId))
        return await set(newRef, request)
    }

    async addSuccessfulTransaction(transaction: TransactionSuccess) {
        if (!this.auth.currentUser)
            return false
        const newRef = push(child(child(child(this.transactions, 'ridePurchases'), 'success'), this.auth.currentUser!.uid))
        return await set(newRef, transaction)
    }

    async addFailureTransaction(transaction: TransactionFailure) {
        if (!this.auth.currentUser)
            return false
        const newRef = push(child(child(child(this.transactions, 'ridePurchases'), 'failure'), this.auth.currentUser!.uid))
        return await set(newRef, transaction)
    }


    /**
     * createError
     * @param type error type
     * @param e error to be created
     * @returns new refernce callback
     */
    async createError(type: string, e: any) {
        const date = new Date().toUTCString()
        let err: PNPError = {
            type: type,
            date: date,
            errorId: '',
            error: e.message ? e.message : e ? { ...e } : ''
        }
        return this.addError(err)
    }
    /**
  * createErrorCustomer
  * @param type error type
  * @param extraData  extra error to be created
  * @returns new refernce callback
  */
    async createErrorCustomer(type: string, extraData?: { email: string, more: any }) {
        const date = new Date().toUTCString()
        let err: PNPError = {
            type: type,
            date: date,
            errorId: '',
            extraData: extraData,
            error: ''
        }
        return this.addError(err)
    }

    /**
  * createError
  * @param type error type
  * @param e error to be created
  * @returns new refernce callback
  */
    static async createError(type: string, e: any, db: Database) {
        const date = new Date().toUTCString()
        let err: PNPError = {
            type: type,
            date: date,
            errorId: '',
            error: e
        }
        return Realtime.addError(err, db)
    }

    /**
     * getRideConfirmationByEventId
     * @param eventId to get confirmation for
     * @returns confirmation of event attendance for current user if exists
     */
    getRideConfirmationByEventId(eventId: string, userId: string, consume: ((confirmation: PNPRideConfirmation | null) => void)) {
        return onValue(child(child(child(this.rides, 'confirmations'), userId), eventId), (snap) => {
            if (snap.exists()) {
                consume(rideConfirmationFromDict(snap))
            } else consume(null)
        })
    }

    /**
  * getRideAllConfirmationByEventId
  * @param eventId to get confirmation for
  * @returns confirmation of event attendance for current user if exists
  */
    getAllRideConfirmationByEventId(eventId: string, consume: ((confirmations: PNPRideConfirmation[] | null) => void)) {
        return onValue(child(this.rides, 'confirmations'), (snap) => {
            if (snap.exists()) {
                const total: PNPRideConfirmation[] = []
                let relevant;
                snap.forEach((userConfirmationsSnap) => {
                    relevant = userConfirmationsSnap.child(eventId)
                    if (relevant.exists()) {
                        total.push(rideConfirmationFromDict(relevant))
                    }
                })
                consume(total)
            } else consume(null)
        })
    }


    async getAllUsersByIds(ids: string[]): Promise<PNPUser[] | null> {
        return await get(this.users)
            .then(snap => {
                const total: PNPUser[] = []
                let check: any = {}
                for (var id of ids) {
                    check[id] = true
                }

                snap.forEach(userSnap => {
                    if (check[userSnap.child('customerId').val()]) {
                        total.push(userFromDict(userSnap))
                    }
                })
                return total
            }).catch(e => { this.createError('getAllUsersByIds', e); return null; })
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
                .catch((e) => { this.createError('addRideConfirmation', e) })
        }
    }
    /**
       * addPublicRide
       * @param ride a public ride to be added
       * @returns a new reference or error reference
       */
    addPublicRide = async (eventId: string, ride: PNPPublicRide): Promise<object | void> => {
        const newRef = get(child(child(this.rides, 'public'), eventId))
        ride.eventId = eventId
        await newRef.then(d => d.size)
            .then(async size => {
                if (size === null || size === undefined || size === 0) {
                    return await set(child(child(child(child(this.rides, 'public'), 'ridesForEvents'), eventId), '0'), ride)
                } else {
                    return await set(child(child(child(child(this.rides, 'public'), 'ridesForEvents'), eventId), size + ""), ride)
                }

            })
            .catch((e) => { this.createError('addPublicRide', e) })
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
                .catch((e) => { this.createError('addPublicRide', e) })
        }
    }

    /**
    * addListenerToRideRequests
    * @param consume a callback to consume the ride requests array
    * @returns onValue change listener for ride requests
    */

    addListenerToRideRequestsByEventId = (eventId: string, consume: (requests: PNPRideRequest[]) => void) => {
        return onValue(child(child(this.rides, 'rideRequests'), eventId), (snap) => {
            const requests: PNPRideRequest[] = []
            const hash: { [id: string]: boolean } = {}
            const decode = (s: DataSnapshot) => {
                if (!hash[s.child('requestUserId').val() as string]) {
                    requests.push(rideRequestFromDict(s))
                    hash[requests[requests.length - 1].requestUserId] = true
                }
            }
            snap.forEach(decode)
            consume(requests)
        })
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
    addListenerToCurrentUser = (consume: (o: PNPUser) => void) => {
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
            .catch((e) => { this.createError('updateClubEvent', e) })
    }

    /**
     * removeRideRequestByUser&EventIds
     * @param eventId eventId to be for ride request to be removed from
     * @param userId requesteer userId
     * @returns remove callback
     */

    removeRideRequest = async (eventId: string, userId: string) => {
        get(child(child(this.rides, 'rideRequests'), eventId))
            .then(snap => {
                snap.forEach(aChild => {
                    if (aChild.child('requestUserId').val() === userId && aChild.child('eventId').val() === eventId) {
                        remove(aChild.ref)
                            .catch((e) => { this.createError('removeRideRequest', e) })
                    }
                })
            })

    }
    /**
     * removeClubEvent
     * @param eventId eventid to be removed
     * @returns remove callback
     */
    removeClubEvent = async (eventId: string) => {
        return await remove(child(child(this.allEvents, 'clubs'), eventId))
            .catch((e) => { this.createError('removeClubEvent', e) })
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
      * updateCurrentUser
      * @param user user values to be updated
      * @returns update callback
      */
    static updateCurrentUser = async (user: object, auth: Auth, db: Database) => {
        if (auth.currentUser)
            return await update(child(ref(db, 'users'), auth.currentUser!.uid), user)
    }

    /**
 * removeCultureEvent
 * @param eventId eventid to be removed
 * @returns remove callback
 */
    removeCultureEvent = async (eventId: string) => {
        return await remove(child(child(child(this.allEvents, 'public'), 'culture'), eventId))
            .catch((e) => { this.createError('removeCultureEvent', e) })
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
            .catch((e) => { this.createError('addClubEvent', e) })
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
            .catch((e) => { this.createError('addCultureEvent', e) })
    }

    /**
     * 
     * @param image image to be updated for user
     * @returns update callback
     */
    updateUserImage = async (image: string): Promise<object | void> => {
        return await this.updateCurrentUser({ image: image })
            .catch((e) => { this.createError('updateUserImage', e) })
    }


    /**
     * addUser
     * @param user a user to be added to db
     * @returns new reference callback
     */
    addUser = async (user: PNPUser): Promise<object | undefined> => {
        if (this.auth.currentUser === null) return
        createNewCustomer((type: string, e: any) => this.createErrorCustomer(type, e), user).then(async (customerUid: string) => {
            user.customerId = customerUid
            return await set(child(this.users, this.auth.currentUser!.uid), user)
                .catch((e) => { this.createError('addUser', e) })
        }).catch(e => { this.createError('addUser', e) })

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
    getPrivateEventById = (id: string, consume: ((event: PNPPrivateEvent) => void)) => {
        return onValue(child(child(this.allEvents, 'private'), id), (val) => {
            consume(privateEventFromDict(val))
        })
    }

    /**
     * getPrivateEventRidesById
     * @param id eventId to fetch rides for
     * @returns all rides for given event
     */
    getPrivateEventRidesById = (id: string, consume: (consume: PNPPublicRide[]) => void) => {

        return onValue(child(child(child(this.rides, 'private'), 'ridesForEvents'), id), (snap) => {
            const ret: PNPPublicRide[] = []
            snap.forEach(ride => {
                ret.push(publicRideFromDict(ride))
            })
            consume(ret)
        })
    }
    /**
       * getPublicRidesByEventId
       * @param eventId eventId to fetch rides for
       * @returns all rides for given event
       */
    getPublicRidesByEventId = (id: string, consume: (consume: PNPPublicRide[]) => void) => {
        return onValue(child(child(child(this.rides, 'public'), 'ridesForEvents'), id), (snap) => {
            const ret: PNPPublicRide[] = []
            snap.forEach(ride => {
                ret.push(publicRideFromDict(ride))
            })
            consume(ret)
        })
    }

    /**
     * getPublicEventById
     * @param id eventid to fetch
     * @returns event by id
     */
    getPublicEventById = (id: string, consume: ((event: PNPEvent | null) => void)) => {
        return onValue(child(this.allEvents, 'public'), (data) => {
            const c1 = data.child('clubs').child(id)
            const c2 = data.child('culture').child(id)
            consume(c1.exists() ? eventFromDict(c1) : c2.exists() ? eventFromDict(c2) : null)
        })
    }
}

export type FirebaseTools = {
    auth: Auth,
    realTime: Realtime
    temp: Firestore
}
export default function Store(auth: Auth, db: Database, firestore: Firestore): FirebaseTools {
    return {
        auth: auth,
        realTime: CreateRealTimeDatabase(auth, db),
        temp: firestore
    }
}


