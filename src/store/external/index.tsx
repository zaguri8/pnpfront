import { Auth, User } from 'firebase/auth'
import { PNPEvent, PNPUser, PNPPublicRide, PNPPrivateEvent, PNPError, PNPRideConfirmation, PNPPrivateRide, PNPRideRequest, PNPTransactionConfirmation, UserDateSpecificStatistics, UserEnterStatistics } from './types'
import { privateEventFromDict, userFromDict, eventFromDict, publicRideFromDict, rideConfirmationFromDict, rideRequestFromDict, getEventType, transactionConfirmationFromDict } from './converters'
import { SnapshotOptions } from 'firebase/firestore'
import { PNPPage } from '../../cookies/types'
import { DocumentData } from 'firebase/firestore'
import { getStorage, getDownloadURL, ref as storageRef, FirebaseStorage, uploadBytes } from "firebase/storage";
import { child, Database, DatabaseReference, DataSnapshot, get, onValue, push, query, ref, remove, set, Unsubscribe, update } from 'firebase/database'
import {
    Firestore,
    QuerySnapshot,
    DocumentReference
} from 'firebase/firestore'
import { createNewCustomer } from '../payments'
import { TransactionSuccess } from '../payments/types'
import { transactionSuccessFromDict } from '../payments/converters'
import { getCurrentDate } from '../../utilities'
import { dateStringFromDate } from '../../components/utilities/functions'

export type ExternalStoreActions = {
    /*  events */
    getErrors: () => Promise<QuerySnapshot<object> | ((options?: SnapshotOptions | undefined) => DocumentData)[]>;
    getEvents: () => Promise<QuerySnapshot<object> | ((options?: SnapshotOptions | undefined) => DocumentData)[]>;
    getRides: (userId: string) => Promise<QuerySnapshot<object> | ((options?: SnapshotOptions | undefined) => DocumentData)[] | ((options?: SnapshotOptions | undefined) => DocumentData | undefined)>;
    addError: (error: string) => Promise<DocumentReference<DocumentData>>;
    addEvent: (event: PNPEvent) => Promise<DocumentReference<DocumentData>>;
    removeEvent: (eventId: string) => Promise<void>;
    updateEvent: (event: PNPEvent) => Promise<void>;
    /* rides */
    addRide: (ride: PNPPublicRide) => Promise<DocumentReference<DocumentData>>;

}

function CreateRealTimeDatabase(auth: Auth, db: Database, storage: FirebaseStorage) {

    return new Realtime(auth, db, storage)
}
export class Realtime {
    private rides: DatabaseReference
    private allEvents: DatabaseReference
    private errs: DatabaseReference
    private users: DatabaseReference
    private auth: Auth
    private storage: FirebaseStorage
    private statistics: DatabaseReference
    private transactions: DatabaseReference
    private transactionConfirmations: DatabaseReference
    constructor(auth: Auth, db: Database, storage: FirebaseStorage) {
        this.allEvents = ref(db, '/events')
        this.rides = ref(db, "/rides")
        this.statistics = ref(db, '/statistics')
        this.users = ref(db, '/users')
        this.errs = ref(db, '/errors')
        this.transactionConfirmations = ref(db, '/transactionConfirmations')
        this.transactions = ref(db, '/transactions')
        this.auth = auth
        this.storage = storage
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

    async addListenerToTransactionConfirmation(voucher: string, consume: (c: PNPTransactionConfirmation) => void) {
        return await get(child(this.transactionConfirmations, voucher)).then((snap) => {
            consume(transactionConfirmationFromDict(snap))
        })
    }

    async invalidateTransactionConfirmations(voucher: string, ridesLeft: number) {
        return await update(child(this.transactionConfirmations, String(voucher)), { ridesLeft: ridesLeft })
    }


    getTransaction(customer_uid: string,
        transaction_uid: string,
        consume: (transaction: TransactionSuccess) => void,
        onError: (e: Error) => void) {
        return onValue(child(child(this.transactions, customer_uid), transaction_uid), (snap) => {
            consume(transactionSuccessFromDict(snap))
        }, onError)
    }



    getAllTransactions(customer_uid: string, consume: (transactions: TransactionSuccess[]) => void, onError: (e: Error) => void) {
        return onValue(child(this.transactions, customer_uid), (snap) => {
            const transactions: TransactionSuccess[] = []
            snap.forEach(transactionSnap => {
                transactions.push(transactionSuccessFromDict(transactionSnap))
            })

            let spl, spl2;
            transactions.sort((e1: TransactionSuccess, e2: TransactionSuccess) => {
                spl = dateStringFromDate(new Date(e1.date)).split('/');
                spl2 = dateStringFromDate(new Date(e2.date)).split('/');
                if (Number(spl[2]) > Number(spl2[2])) {
                    return -1;
                } else if (Number(spl2[2]) > Number(spl[2]))
                    return 1;

                if (Number(spl[1]) > Number(spl2[1])) {
                    return -1;
                } else if (Number(spl2[1]) > Number(spl[1]))
                    return 1;

                if (Number(spl[0]) > Number(spl2[0])) {
                    return -1;
                } else if (Number(spl2[2]) > Number(spl[2]))
                    return 1;
                return 0;
            })

            consume(transactions)
        }, onError)
    }

    getAllTransactionsForEvent(eid: string, consume: (transactions: { rideStartPoint: string, uid: string, extraPeople: { fullName: string, phoneNumber: string }[], amount: string }[]) => void, onError: (e: Error) => void) {
        return onValue(this.transactions, (snap) => {
            const allTransactions: { rideStartPoint: string, extraPeople: { fullName: string, phoneNumber: string }[], uid: string, amount: string }[] = []
            let nextRef: DataSnapshot | null = null
            snap.forEach(user => {
                user.forEach(transaction => {
                    nextRef = transaction.child('more_info')
                    if (nextRef.exists() && nextRef!.child('eventId').val() === eid) {
                        allTransactions.push({
                            rideStartPoint: nextRef!.child('startPoint').val(),
                            uid: user.key!,
                            extraPeople: nextRef!.child('extraPeople').val(),
                            amount: nextRef!.child('amount').val()
                        })
                    }
                })
            })

            consume(allTransactions)
        }, onError)
    }

    addListersForRideSearch(onSuccess: (rides: PNPPublicRide[]) => void, onFailure: (o: Error) => void) {
        return onValue(child(child(this.rides, 'public'), 'ridesForEvents'), snap => {
            const rides: PNPPublicRide[] = []
            snap.forEach(eventSnap => {
                eventSnap.forEach(rideSnap => {
                    rides.push(publicRideFromDict(rideSnap))
                })
            })
            onSuccess(rides)
        }, onFailure)
    }

    getAllPublicEvents = (consume: (events: PNPEvent[]) => void) => {
        const pRef = this.allEvents
        return onValue(child(pRef, 'public'), (snap) => {
            const events: PNPEvent[] = []
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
            const events: PNPEvent[] = []
            snap.forEach(eventCategorySnap => {
                eventCategorySnap.forEach(eventSnap => {
                    events.push(eventFromDict(eventSnap))
                })
            })
            consume(events)
        })
    }


    // Makes a user responsible of a private event
    // takes user as parameter and does the changes
    async makeUserResponsible(userId: string,
        event: PNPPrivateEvent) {
        event.eventProducerId = userId
        return await this.updatePrivateEvent(event.eventId, event)
    }

    // Edit confirmations functions
    // NOTES: update_confirmation , delete_confirmation
    async updateConfirmation(eventId: string,
        userName: string,
        confirmation: PNPRideConfirmation) {
        return await get(child(child(this.rides, 'confirmations'), eventId))
            .then(snap => {
                snap.forEach(child => {
                    if (child.child('userName').val() === userName) {
                        update(child.ref, confirmation)
                        return
                    }
                })
            })
    }



    async getUserIdByEmail(email: string,
        consume: ((userId: string) => void),
        error: (() => void)) {
        await get(this.users)
            .then(snap => {
                snap.forEach(child => {
                    if (child.child('email').val() === email) {
                        consume(child.key!)
                        return
                    }
                })
                error()
            }).catch((e) => this.createError("getUserIdByEmail", e));
    }

    getUserById(id: string, consume: (u: PNPUser) => void): Unsubscribe {
        return onValue(child(this.users, id), (snap) => {
            consume(userFromDict(snap))
        })
    }




    async addRideRequest(request: PNPRideRequest) {
        if (!this.auth.currentUser)
            return
        const newRef = push(child(child(this.rides, 'rideRequests'), request.eventId))
        return await set(newRef, request)
    }


    /**
     * createError
     * @param type error type
     * @param e error to be created
     * @returns new refernce callback
     */
    async createError(type: string, e: any) {
        const date = new Date().toUTCString()
        const err: PNPError = {
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
        const err: PNPError = {
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
        const err: PNPError = {
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
        return onValue(child(child(child(this.rides, 'confirmations'), eventId), userId), (snap) => {
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
        return onValue(child(child(this.rides, 'confirmations'), eventId), (snap) => {
            if (snap.exists()) {
                const total: PNPRideConfirmation[] = []
                snap.forEach((userConfirmationsSnap) => {
                    total.push(rideConfirmationFromDict(userConfirmationsSnap))
                })
                consume(total)
            } else consume(null)
        })
    }

    addListenerToUsers(consume: (users: PNPUser[]) => void, error: (e: Error) => void) {
        return onValue(this.users, (userSnaps) => {
            const users: PNPUser[] = []
            userSnaps.forEach(snap => {
                users.push(userFromDict(snap))
            })
            consume(users)
        }, error)
    }




    async getAllUsersByIds(ids_and_extraPeople: { uid: string, extraPeople: { fullName: string, phoneNumber: string }[] }[]): Promise<{ user: PNPUser, extraPeople: { fullName: string, phoneNumber: string }[] }[] | null> {
        return await get(this.users)
            .then(snap => {
                const total: { user: PNPUser, extraPeople: { fullName: string, phoneNumber: string }[] }[] = []
                const extraPeople: any = {}
                for (const id_and_p of ids_and_extraPeople) {
                    if (!extraPeople[id_and_p.uid]) {
                        extraPeople[id_and_p.uid] = id_and_p.extraPeople
                    } else {
                        if (!extraPeople[id_and_p.uid].includes(id_and_p.extraPeople[id_and_p.extraPeople.length - 1]))
                            extraPeople[id_and_p.uid].push(...id_and_p.extraPeople)
                    }
                }
                snap.forEach(userSnap => {
                    var uid = userSnap.child('customerId').val()
                    if (extraPeople[uid] || extraPeople[uid] === null) { // checks if has extraPeople or single
                        total.push({
                            user: userFromDict(userSnap),
                            extraPeople: extraPeople[uid]
                        })
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
        let newPath = push(child(child(this.rides, 'confirmations'), confirmation.eventId))
        return await set(newPath, confirmation)
    }
    /**
       * addPublicRide
       * @param ride a public ride to be added
       * @returns a new reference or error reference
       */
    addPublicRide = async (eventId: string, ride: PNPPublicRide, privateEvent: boolean = false): Promise<object | void> => {
        ride.eventId = eventId
        const newRef = push(child(child(child(this.rides, privateEvent ? 'private' : 'public'), 'ridesForEvents'), eventId))
        ride.rideId = newRef.key!

        if (ride.extras.isRidePassengersLimited) {
            let newStatus: 'on-going' | 'sold-out' | 'running-out';
            let ticketsLeft = Number(ride.extras.rideMaxPassengers) - Number(ride.passengers)
            if (ticketsLeft <= 0) {
                newStatus = 'sold-out'
            } else if (ticketsLeft <= 15) {
                newStatus = 'running-out'
            } else {
                newStatus = 'on-going'
            }
            ride.extras.rideStatus = newStatus;
        }
        return await set(newRef, ride).catch((e) => { this.createError('addPublicRide', e) })
    }

    removePublicRide = async (eventId: string, rideId: string): Promise<object | void> => {
        return await remove(child(child(child(child(this.rides, 'public'), 'ridesForEvents'), eventId), rideId))
    }
    removePrivateRide = async (eventId: string, rideId: string): Promise<object | void> => {
        return await remove(child(child(child(child(this.rides, 'private'), 'ridesForEvents'), eventId), rideId))
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


    addPrivateEvent = async (event: PNPPrivateEvent, imageBuffer?: ArrayBuffer): Promise<{ id: string } | void> => {
        if (this.auth.currentUser) {
            const p = push(child(child(this.allEvents, 'private'), 'waiting'))
            event.eventId = p.key!
            event.eventProducerId = this.auth.currentUser.uid
            if (imageBuffer) {
                return await uploadBytes(storageRef(this.storage, 'PrivateEventImages/' + "/" + event.eventId), imageBuffer)
                    .then(async snap => {
                        return await getDownloadURL(snap.ref)
                            .then(async url => {
                                event.eventImageURL = url
                                return await set(p, event).then(() => {
                                    return { id: p.key! }
                                }).catch((e) => { this.createError('addPrivateEvent', e) })
                            })
                    })
            } else {
                return await set(p, event).then(() => {
                    return { id: event.eventId }
                }).catch((e) => { this.createError('addPrivateEvent', e) })
            }
        }
    }


    addListenerToPrivateEvents = (consume: (o: { [type: string]: PNPPrivateEvent[] }) => void, includeWaiting: boolean) => {
        return onValue(child(this.allEvents, 'private'), snap => {
            const hashTable: { [type: string]: PNPPrivateEvent[] } = {}

            let p: any = null;
            snap.forEach((type) => {
                p = type.key!
                if (includeWaiting || p !== 'waiting') {
                    type.forEach(event => {
                        if (!p || !hashTable[p])
                            hashTable[p] = [privateEventFromDict(event)]
                        else hashTable[p].push(privateEventFromDict(event))
                    })
                }
            })

            let spl, spl2;
            for (var k of Object.keys(hashTable))
                hashTable[k].sort((e1: PNPPrivateEvent, e2: PNPPrivateEvent) => {
                    spl = e1.eventDate.split('/');
                    spl2 = e2.eventDate.split('/');
                    if (Number(spl[2]) > Number(spl2[2])) {
                        return -1;
                    } else if (Number(spl2[2]) > Number(spl[2]))
                        return 1;

                    if (Number(spl[1]) > Number(spl2[1])) {
                        return -1;
                    } else if (Number(spl2[1]) > Number(spl[1]))
                        return 1;

                    if (Number(spl[0]) > Number(spl2[0])) {
                        return -1;
                    } else if (Number(spl2[2]) > Number(spl[2]))
                        return 1;
                    return 0;
                })
            consume(hashTable)
        })
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

            const today = new Date();
            ret.sort((a, b) => {
                const x = a.eventDate.split('/')
                const y = b.eventDate.split('/')
                if (x.length < 3 || y.length < 3)
                    return 0
                else if (Number(x[2]) > Number(y[2]) || Number(x[1] > y[1]) || Number(x[0]) > Number(y[0])) {
                    return 1
                } else if (Number(x[2]) < Number(y[2]) || Number(x[1] < y[1]) || Number(x[0]) < Number(y[0])) {
                    return -1
                } else return 0
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
* addListenerToPublicEvents
* @param consume a callback to consume the events array
* @returns onValue change listener for events
*/


    addListenerToPublicEvents = (consume: (o: { [type: string]: PNPEvent[] }) => void, includeWaiting: boolean) => {
        return onValue(child(this.allEvents, 'public'), snap => {
            const hashTable: { [type: string]: PNPEvent[] } = {}

            let p: any = null;
            snap.forEach((type) => {
                p = type.key!
                if (includeWaiting || p !== 'waiting') {
                    type.forEach(event => {
                        if (!p || !hashTable[p])
                            hashTable[p] = [eventFromDict(event)]
                        else hashTable[p].push(eventFromDict(event))
                    })
                }
            })

            let spl, spl2;
            for (var k of Object.keys(hashTable))
                hashTable[k].sort((e1: PNPEvent, e2: PNPEvent) => {
                    spl = e1.eventDate.split('/');
                    spl2 = e2.eventDate.split('/');
                    if (Number(spl[2]) > Number(spl2[2])) {
                        return -1;
                    } else if (Number(spl2[2]) > Number(spl[2]))
                        return 1;

                    if (Number(spl[1]) > Number(spl2[1])) {
                        return -1;
                    } else if (Number(spl2[1]) > Number(spl[1]))
                        return 1;

                    if (Number(spl[0]) > Number(spl2[0])) {
                        return -1;
                    } else if (Number(spl2[2]) > Number(spl[2]))
                        return 1;
                    return 0;
                })
            consume(hashTable)
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

    updateEvent = async (eventId: string, event: any, blob?: ArrayBuffer, eventOldType?: string) => {
        const uploadEvent = async () => {
            if (eventOldType !== event.eventType) {
                // remove the event from old type route
                await remove(child(child(child(this.allEvents, 'public'), eventOldType ?? event.eventType), eventId))
                    .catch((e) => { this.createError('updateClubEvent', e) })
                // add the event to new type route
                return await set(child(child(child(this.allEvents, 'public'), event.eventType), eventId), event)
                    .catch((e) => { this.createError('updateClubEvent', e) })
            }
            // update same route
            return await update(child(child(child(this.allEvents, 'public'), eventOldType ?? event.eventType), eventId), event)
                .catch((e) => { this.createError('updateClubEvent', e) })
        }

        if (blob) {
            return await uploadBytes(storageRef(this.storage, 'EventImages/' + event.eventType + "/" + event.eventId), blob)
                .then(async snap => {
                    return await getDownloadURL(snap.ref)
                        .then(async url => {
                            event.eventImageURL = url
                            return uploadEvent();
                        })
                })
        } else return await uploadEvent()

    }

    updatePrivateEvent = async (eventId: string, event: any, blob?: ArrayBuffer) => {
        const uploadEvent = async () => {
            // update same route
            return await update(child(child(child(this.allEvents, 'private'), 'approved'), eventId), event)
                .catch((e) => { this.createError('updatePrivateEvent', e) })
        }
        if (blob) {
            return await uploadBytes(storageRef(this.storage, 'PrivateEventImages/' + "/" + event.eventId), blob)
                .then(async snap => {
                    return await getDownloadURL(snap.ref)
                        .then(async url => {
                            event.eventImageURL = url
                            return uploadEvent();
                        })
                })
        } else return await uploadEvent()

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
        return await remove(child(child(child(this.allEvents, 'public'), 'clubs'), eventId))
            .catch((e) => { this.createError('removeClubEvent', e) })
    }

    removeEvent = async (event: PNPEvent) => {
        return await remove(child(child(child(this.allEvents, 'public'), event.eventType), event.eventId))
            .catch((e) => { this.createError('removeEvent', e) })
            .then(async () => {
                return await remove(child(child(child(this.rides, 'public'), 'ridesForEvents'), event.eventId))
                    .catch(e => { this.createError('removeEvent', e) })
            })
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
                const err: PNPError = {
                    type: 'updateCultureEvent',
                    date: date,
                    errorId: '',
                    error: e
                }
                return this.addError(err)
            })
    }


    /**
     * updatePrivateRide
     * @param rideId rideId to be updated
     * @param ride ride values to be updated
     * @returns update callback
     */
    updatePrivateRide = async (rideId: string, ride: object) => {
        return await update(child(child(this.rides, 'private'), rideId), ride)
    }


    /**
 * updatePublicRide
 * @param eventId eventId that the ride is connected to
 * @param rideId rideId to be updated
 * @param ride ride values to be updated
 * @returns update callback
 */
    updatePublicRide = async (eventId: string, rideId: string, ride: any, privateEvent: boolean = false) => {

        if (ride.extras.isRidePassengersLimited) {
            let newStatus: 'on-going' | 'sold-out' | 'running-out';
            let ticketsLeft = Number(ride.extras.rideMaxPassengers) - Number(ride.passengers)
            if (ticketsLeft <= 0) {
                newStatus = 'sold-out'
            } else if (ticketsLeft <= 15) {
                newStatus = 'running-out'
            } else {
                newStatus = 'on-going'
            }
            ride.extras.rideStatus = newStatus;
        }
        return await update(child(child(child(child(this.rides, privateEvent ? 'private' : 'public'),
            'ridesForEvents'), eventId), rideId), ride)
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
    * createEvent
    * @param event event to be added
    * @param blob : image blob for event *required
    * @param uploadEventImage
    * @returns new reference callback
    */
    createEvent = async (event: PNPEvent, blob: ArrayBuffer): Promise<object | void> => {
        const newRef = push(child(child(this.allEvents, 'public'), 'waiting'))
        event.eventId = newRef.key!
        return await uploadBytes(storageRef(this.storage, 'EventImages/' + event.eventType + "/" + event.eventId), blob)
            .then(async snap => {
                return await getDownloadURL(snap.ref)
                    .then(async url => {
                        event.eventImageURL = url
                        return await set(newRef, event)
                            .catch((e) => { this.createError('addEvent', e) })
                    })
            })
    }

    addListenerToWaitingEvents(consume: (waiting: PNPEvent[]) => void) {
        return onValue(child(child(this.allEvents, 'public'), 'waiting'), snap => {
            const events: PNPEvent[] = []
            snap.forEach(event => {
                events.push(eventFromDict(event))
            })
            consume(events)
        })
    }

    addListenerToPublicAndWaitingEvents(consumePublicEvents: (waiting: PNPEvent[]) => void, consumeWaitingEvents: (o: PNPEvent[]) => void) {

        return onValue(child(this.allEvents, 'public'), snap => {
            const approvedEvents: PNPEvent[] = []
            const waitingEvents: PNPEvent[] = []
            snap.forEach((type) => {
                if (type.key! !== 'waiting') {
                    type.forEach(event => {
                        approvedEvents.push(eventFromDict(event))
                    })
                } else {
                    type.forEach(event => {
                        waitingEvents.push(eventFromDict(event))
                    })
                }

            })
            consumePublicEvents(approvedEvents)
            consumeWaitingEvents(waitingEvents)
        })
    }

    addUserStatistic(page: PNPPage) {
        let stat = 'numberOfUsersAttended'
        const pageValue = page.valueOf()
        let dateString = dateStringFromDate(getCurrentDate()).replaceAll('/', '-')
        try {
            get(child(child(child(this.statistics, pageValue), dateString), stat))
                .then(snapshot => {
                    const val = snapshot.val()
                    update(child(child(this.statistics, pageValue), dateString), { numberOfUsersAttended: val ? (val + 1) : 1 })
                })
        } catch (e) { }

    }

    addListenerToUserStatistics(consume: (stats: UserEnterStatistics) => void) {
        return onValue(child(this.statistics, PNPPage.home), (snap) => {
            let output: UserEnterStatistics;
            let all_stats: UserDateSpecificStatistics[] = [];
            snap.forEach(date => {
                let actualStringDate = date.key!
                all_stats.push({ date: actualStringDate, numberOfUserAttended: date.child('numberOfUsersAttended').val() })
            })
            output = { stats: all_stats }
            consume(output)
        })
    }

    addBrowsingStat(page: PNPPage, stat: 'leaveNoAttendance' | 'leaveWithAttendance') {
        const pageValue = page.valueOf()
        let dateString = dateStringFromDate(getCurrentDate()).replaceAll('/', '-')
        try {
            get(child(child(child(this.statistics, pageValue), dateString), stat))
                .then(snapshot => {
                    const val = snapshot.val()
                    switch (stat) {
                        case 'leaveNoAttendance':
                            update(child(child(this.statistics, pageValue), dateString), { leaveNoAttendance: val ? (val + 1) : 1 })
                            break;
                        case 'leaveWithAttendance':
                            update(child(child(this.statistics, pageValue), dateString), { leaveWithAttendance: val ? (val + 1) : 1 })
                            break;
                    }
                })
        } catch (e) { }

    }

    addListenerToBrowsingStat(page: PNPPage, date: string, consume: (data: { leaveNoAttendance: number, leaveWithAttendance: number }) => void) {
        return onValue(child(child(this.statistics, page.valueOf()), date), (snap) => {
            const withAttendnace = snap.child('leaveWithAttendance').val()
            const noAttendance = snap.child('leaveNoAttendance').val()
            consume({ leaveNoAttendance: noAttendance, leaveWithAttendance: withAttendnace })
        })
    }

    approveEvent = async (eventId: string) => {
        const eventRef = child(child(child(this.allEvents, 'public'), 'waiting'), eventId)
        get(eventRef)
            .then(snap => {
                remove(eventRef)
                    .then(async () => {
                        const event = eventFromDict(snap)
                        return await set(child(child(child(this.allEvents, 'public'), event.eventType!), eventId), event)
                    }).catch(e => {
                        this.createError('approveEvent', e)
                    })
            }).catch(e => {
                this.createError('approveEvent', e)
            })
    }

    approvePrivateEvent = async (eventId: string) => {
        const eventRef = child(child(child(this.allEvents, 'private'), 'waiting'), eventId)
        get(eventRef)
            .then(snap => {
                remove(eventRef)
                    .then(async () => {
                        const event = privateEventFromDict(snap)
                        return await set(child(child(child(this.allEvents, 'private'), 'approved'), eventId), event)
                    }).catch(e => {
                        this.createError('approvePrivateEvent', e)
                    })
            }).catch(e => {
                this.createError('approvePrivateEvent', e)
            })
    }

    declineEvent = async (eventId: string) => {
        const eventRef = child(child(child(this.allEvents, 'public'), 'waiting'), eventId)
        get(eventRef)
            .then(snap => {
                remove(eventRef)
                    .then(async () => {
                        const event = eventFromDict(snap)
                        return await set(child(child(child(this.allEvents, 'public'), 'declined'), eventId), event)
                    }).catch(e => {
                        this.createError('declineEvent', e)
                    })
            }).catch(e => {
                this.createError('declineEvent', e)
            })
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
        return onValue(child(child(child(this.allEvents, 'private'), 'approved'), id), (val) => {
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
        }, (e) => { console.log(e) })
    }

    getPublicRideById = async (eventId: string, rideId: string) => {
        return await get(child(child(child(child(this.rides, 'public'), 'ridesForEvents'), eventId), rideId))
            .then(snap => publicRideFromDict(snap))
    }

    /**
     * getPublicEventById
     * @param id eventid to fetch
     * @returns event by id
     */
    getPublicEventById = (id: string, consume: ((event: PNPEvent | null) => void)) => {
        return onValue(child(this.allEvents, 'public'), (data) => {
            let consumed = false
            data.forEach((c => {
                if (c.exists() && c.hasChild(id)) {
                    consume(eventFromDict(c.child(id)))
                    consumed = true
                }
            }))
            if (!consumed) consume(null)
        })
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
        realTime: CreateRealTimeDatabase(auth, db, getStorage(auth.app)),
        temp: firestore
    }
}


