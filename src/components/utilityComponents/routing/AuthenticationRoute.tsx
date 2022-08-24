import React from "react";
import { Navigate, useLocation } from "react-router";
import { PNPRouteProps } from "../../../routing/PNPRoute";
import { PNPUser } from "../../../store/external/types";

function AuthenticationRoute(props: PNPRouteProps & { appUser: PNPUser | undefined | null }) {
    const location = useLocation()
    if (props.appUser === undefined)
        return null;
    if (!props.appUser)
        return <Navigate to='/login' state={{ cachedLocation: location.pathname }} />
    return <React.Fragment>
        {props.element}
    </React.Fragment>
}

export default AuthenticationRoute