import React from "react";
import { Navigate, useLocation } from "react-router";
import { PNPRouteProps } from "../../../routing/PNPRoute";
import { PNPUser } from "../../../store/external/types";

function RegisterRoute(props: PNPRouteProps & { appUser: PNPUser | undefined | null }) {
    if (props.appUser === undefined)
        return null;
    if (!props.appUser)
        return <React.Fragment>
            {props.element}
        </React.Fragment>
    return <Navigate to={'/'} />
}

export default RegisterRoute