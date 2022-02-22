import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import 'firebase/firestore'
export async function insertInvitation(auth, db, direction, numOfPeople, startPoint, phone, name) {
    if (auth.currentUser != null) {
        return await setDoc(doc(collection(db, 'users'), auth.currentUser.uid),
            {
                username: auth.currentUser.displayName,
                phone: phone,
                email: auth.currentUser.email,
                rides: [{
                    name: name,
                    numOfPeople: numOfPeople,
                    direction: direction,
                    startPoint: startPoint
                }]
            })
    }
}

export async function alreadyHasInvitation(auth, db, name, completion) {
    if (auth.currentUser != null) {
        return getDoc(doc(collection(db, 'users'), auth.currentUser.uid))
            .then(querySnapShot => {
                if (querySnapShot.exists) {
                    const inv = querySnapShot.get('rides')
                    if (inv && includes(inv, name)) {
                        completion(true)
                    }
                    else completion(false)
                } else completion(false)
            }).catch((e) => {
                completion(false)
            })
    }
}

const includes = (inv, name) => {
    var includes = false
    inv.forEach(i => {
        if (i.name === name) {
            includes = true
        }
    })
    return includes
}