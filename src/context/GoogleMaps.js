import { createContext, useContext, useState, useEffect } from "react"
import { Loader } from '@googlemaps/js-api-loader';
const GoogleMapsContext = createContext(null)

export const GoogleMapsContextProvider = props => {
    const [google, setGoogle] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            version: "weekly",
            libraries: ["places"]
        })
        loader.load().then(setGoogle).catch(setError)
    }, [])
    return <GoogleMapsContext.Provider value={{ google, error }} {...props} />
}


export const useGoogleState = () => {
    const googleState = useContext(GoogleMapsContext)
    return {
        google: googleState.google
    }
}