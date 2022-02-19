import { useLocation } from "react-router"
import { uiConfig } from "../.."
import { StyledFirebaseAuth } from "react-firebaseui"
import { User } from "firebase/auth"
import { auth } from "../.."
import { useEffect } from "react"
export default function Login(props: { title: string, onAuth: (u: User | null) => void }) {
    const location = useLocation()
    useEffect( () => auth.onAuthStateChanged(props.onAuth))
    return (<div><p style={{ color: 'white' }}>{props.title}</p>
        <StyledFirebaseAuth uiConfig={uiConfig("#" + location.pathname)} firebaseAuth={auth} /></div>)
}
