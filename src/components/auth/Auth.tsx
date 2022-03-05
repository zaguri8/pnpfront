import { useLocation } from "react-router"
import { uiConfig } from "../../settings/config"
import { StyledFirebaseAuth } from "react-firebaseui"
import { useFirebase } from "../../context/Firebase"
import { CSSProperties } from "react"
import { style } from "@mui/system"
export default function Auth(props: { title: string, redirect?: string, style?: CSSProperties }) {
    const { firebase } = useFirebase()
    const location = useLocation()
    return (<div style={{
        width: '100%',
        textAlign: 'center'
    }}><p style={{
        ...{ color: 'white' },
        ...style
    }}>{props.title}</p>
        <StyledFirebaseAuth uiConfig={uiConfig("#" + props.redirect ? props.redirect : location.pathname)}
            firebaseAuth={firebase.auth} /></div>)
}
