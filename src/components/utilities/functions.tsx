export const reverseDate = (date: any) => {
    const split = (date as string)
        .replaceAll('-', '/')
        .split('/')
        .reverse()
        .join('/')
    return split
}

export const unReverseDate = (date: any) => {
    const split = (date as string)
        .replaceAll('/', '-')
        .split('-')
        .reverse()
        .join('-')
    return split
}

export const dateStringFromDate = (date: Date) => {
    const d = String(date.getDate()).length === 1 ? "0" + date.getDate() : String(date.getDate())
    const m = String(date.getMonth()).length === 1 ? "0" + date.getMonth() : String(date.getMonth())
    const y = date.getFullYear()
    return d + "/" + m + "/" + y
}