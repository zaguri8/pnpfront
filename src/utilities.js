export const getCurrentDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date
}