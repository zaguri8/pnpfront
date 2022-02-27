import { createContext, useContext, useState } from "react"
const LanguageContext = createContext(null)
export const LanguageContextProvider = props => {
    const [lang, setLang] = useState("heb")
    return <LanguageContext.Provider value={{ lang, setLang }} {...props} />
}


export const useLanguage = () => {
    const languageState = useContext(LanguageContext) 
    return {
        ...languageState
    }
}