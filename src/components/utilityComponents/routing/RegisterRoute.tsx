import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { IFirebaseContext } from "../../../context/Firebase";
import { PNPRouteProps } from "../../../routing/PNPRoute";
import { PNPUser } from "../../../store/external/types";
import { withHookGroup } from "../../generics/withHooks";

function RegisterRoute(props: PNPRouteProps & { firebase: IFirebaseContext }) {
    if (props.firebase.appUser === undefined)
        return null;
    if (!props.firebase.appUser)
        return <React.Fragment>
            {props.element}
        </React.Fragment>
    return <Navigate to={'/'} />
}

export default withHookGroup<PNPRouteProps>(RegisterRoute, ['firebase'])