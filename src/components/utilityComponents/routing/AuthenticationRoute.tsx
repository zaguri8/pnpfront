import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { IFirebaseContext } from "../../../context/Firebase";
import { PNPRouteProps } from "../../../routing/PNPRoute";
import { PNPUser } from "../../../store/external/types";
import { withHookGroup } from "../../generics/withHooks";

function AuthenticationRoute(props: PNPRouteProps & { firebase: IFirebaseContext }) {
    const location = useLocation()
    if (props.firebase.appUser === undefined)
        return null;
    if (!props.firebase.appUser)
        return <Navigate to='/login' state={location.state ? { ...(location.state as any), ...{ cachedLocation: location.pathname } } : { cachedLocation: location.pathname }} />
    return <React.Fragment>
        {props.element}
    </React.Fragment>
}

export default withHookGroup<PNPRouteProps>(AuthenticationRoute, ['firebase'])