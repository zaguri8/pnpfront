import { useLocation } from "react-router"
import { uiConfig } from "../../settings/config"
import { StyledFirebaseAuth } from "react-firebaseui"
import { useUser } from "../../context/Firebase"
import { CSSProperties } from "react"
import { style } from "@mui/system"
import { Hooks } from "../generics/types"
import { withHook } from "../generics/withHooks"
import { StoreSingleton } from "../../store/external"
type AuthProps = { title: string, redirect?: string, style?: CSSProperties }
function Auth(props: AuthProps & Hooks) {
    const location = useLocation()
    return (<div style={{
        width: '100%',
        textAlign: 'center'
    }}><p style={{
        ...{ color: 'white' },
        ...style
    }}>{props.title}</p>
        <StyledFirebaseAuth uiConfig={uiConfig("#" + props.redirect ? props.redirect : location.pathname)}
            firebaseAuth={StoreSingleton.get().auth} /></div>)
}

export default withHook<AuthProps>(Auth, 'user')