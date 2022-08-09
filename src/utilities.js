
import * as CryptoJS from 'crypto-js'
export const getCurrentDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date
}
export const getDateString = (dateMili) => {
    const date = new Date(dateMili)
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
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