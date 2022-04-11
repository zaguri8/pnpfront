import { createContext, useContext, useEffect, useState } from 'react'
import { PNPPage, PNPPageStats } from "../cookies/types";
import { asyncLocalStorage } from '../cookies/index'

interface ICookieContext {
    setCookies: (cookies: PNPPageStats[]) => void
    isCacheValid: (page: PNPPage) => Promise<boolean>
    cacheDone: (page: PNPPage) => void
    getPageCookie: (key: string) => PNPPageStats | null
}


const CookieContext = createContext<ICookieContext | null>(null)


export const CookieContextProvider = (props: object) => {

    const [cookies, setCookies] = useState<PNPPageStats[] | null>(null)

    const getPageCookie = (page: string) => {
        return cookies?.find(cookie => cookie.page === page) ?? null
    }

    const cacheDone = (page: string) => {
        const existing = cookies
        if (existing) {
            for (var p of existing) {
                if (p.page === page) {
                    p.lastCached = new Date().getTime()
                    break;
                }
            }
            setCookies(existing)
            asyncLocalStorage.setItem('pnpPSettings', existing)
        } else {
            asyncLocalStorage.getItem<PNPPageStats[]>('pnpPSettings')
                .then(results => {
                    if (results) {
                        for (var p of results) {
                            if (p.page === page) {
                                p.lastCached = new Date().getTime()
                                break;
                            }
                        }
                        asyncLocalStorage.setItem('pnpPSettings', results)
                    }

                }).catch((e) => false)
        }
    }

    const isCacheValid = async (page: string) => {
        const existing = cookies
        if (existing) {
            for (var p of existing) {
                if (p.page === page) {
                    return Math.abs(new Date().getTime() - p.lastCached) >= 28800000
                }
            }
            return false
        } else {
            return await asyncLocalStorage.getItem<PNPPageStats[]>('pnpPSettings')
                .then(results => {
                    if (results) {
                        for (var p of results) {
                            if (p.page === page) {
                                return Math.abs(new Date().getTime() - p.lastCached) >= 28800000
                            }
                        }
                        return false
                    }
                    else return false
                }).catch((e) => false)
        }
    }

    useEffect(() => {
        if (cookies)
            return
        asyncLocalStorage.getItem<PNPPageStats[]>('pnpPSettings')
            .then((results) => {
                if (!results || results.length < 1) {
                    const newJar = [
                        { lastCached: 0, page: PNPPage.register },
                        { lastCached: 0, page: PNPPage.createRide },
                        { lastCached: 0, page: PNPPage.createEvent },
                        { lastCached: 0, page: PNPPage.home },
                        { lastCached: 0, page: PNPPage.login },
                        { lastCached: 0, page: PNPPage.myAccount }
                    ]
                    asyncLocalStorage.setItem('pnpPSettings', newJar)
                    setCookies(newJar)
                } else {
                    setCookies(results)
                }
            })
            .catch(console.log)
    }, [])

    return <CookieContext.Provider value={{ setCookies, getPageCookie, isCacheValid, cacheDone }} {...props} />
}


export const useCookies = () => {
    const cookieContext: ICookieContext | null = useContext(CookieContext)

    return {
        getPageLastTimeCache: (page: PNPPage) => {
            const lastCached = cookieContext?.getPageCookie(page)?.lastCached
            return lastCached ? new Date(lastCached) : null
        },
        isCacheValid: (page: PNPPage) => cookieContext?.isCacheValid ? cookieContext!.isCacheValid(page) : false,
        cacheDone: (page: PNPPage) => {
            cookieContext?.cacheDone(page)
        }
    }
}

