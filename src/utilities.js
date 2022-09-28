
import * as CryptoJS from 'crypto-js'
export const getCurrentDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date
}
export function millisToMinutesAndSeconds(duration) {
    const a = duration.includes('mins');
    const b = duration.includes('hours');
    const c = a && b;
    if (c) {
        const x = duration.split(' ')
        const hours = Number(x[0]);
        const minutes = Number(x[2]);

        return { hours, minutes }

    } else return { minutes: Number(duration.split(" ")[0]), hours: 0 }
}

export const datesComparator = (a, b) => {
    let bComps = b.date.split(' ')
    let bCompDate = bComps[0].split('-')
    let bCompTime = bComps[1].split(':')
    let aComps = a.date.split(' ')
    let aCompDate = aComps[0].split('-')
    let aCompTime = aComps[1].split(':')
    return new Date(bCompDate[0], bCompDate[1], bCompDate[2],
        bCompTime[0], bCompTime[1], bCompTime[2]).getTime() - new Date(aCompDate[0], aCompDate[1], aCompDate[2],
            aCompTime[0], aCompTime[1], aCompTime[2]).getTime()
}
export const getDateString = (dateMili) => {
    const date = new Date(dateMili)
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}
export function getDaysInCurrentMonth() {
    const date = new Date();
    return getDaysInMonth(date);
}
export function getDaysInMonth(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();
}
export const getDateTimeString = (dateMili) => {
    const date = new Date(dateMili)
    let hour = date.getHours()
    let min = date.getMinutes()
    let sec = date.getSeconds()
    if (hour < 10)
        hour = "0" + hour
    if (min < 10)
        min = "0" + min
    if (sec < 10)
        sec = "0" + sec
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${hour}:${min}:${sec}`
}
export const isValidPhoneNumber = (phone) => {

    return phone.match(/^0(5[^7]|[2-4]|[8-9]|7[0-9])[0-9]{7}$/)
}


export const encryptMacdonald = (message) => {
    let secret = process.env.REACT_APP_NADAVSOLUTIONS_API_KEY;
    var encryptedAES = CryptoJS.AES.encrypt(message, secret);
    return encryptedAES.toString();
}

export const decryptMacdonald = (encryptedAES) => {
    let secret = process.env.REACT_APP_NADAVSOLUTIONS_API_KEY;
    let decrypted = CryptoJS.AES.decrypt(encryptedAES, secret)
    let plain = decrypted.toString(CryptoJS.enc.Utf8);
    return plain;
}

export function getValidImageUrl(event) {
    let eventImageURL = event.eventImageURL
    let eventMobileImageURL = event.eventMobileImageURL

    if (window.innerWidth > 700) {

        if (eventImageURL && eventImageURL !== null && eventImageURL.includes('https'))
            return eventImageURL
        else return eventMobileImageURL
    } else {
        if (eventMobileImageURL && eventMobileImageURL !== null && eventMobileImageURL.includes('https'))
            return eventMobileImageURL
        else return eventImageURL
    }
}

