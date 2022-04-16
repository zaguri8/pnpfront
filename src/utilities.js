export const getCurrentDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date
}

export const isValidPhoneNumber = (phone) => {
    
    return phone.match(/^0(5[^7]|[2-4]|[8-9]|7[0-9])[0-9]{7}$/)
}