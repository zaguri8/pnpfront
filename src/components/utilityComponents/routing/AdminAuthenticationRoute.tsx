import React from "react";
import { PNPRouteProps } from "../../../routing/PNPRoute";
import { PNPUser } from "../../../store/external/types"
import NoPermissions from "../NoPermissions";

function AdminAuthenticatedRoute(props: PNPRouteProps & { appUser: PNPUser | undefined | null }) {
    if (props.appUser === undefined)
        return null;
    if (!props.appUser || !props.appUser.admin)
        return <NoPermissions lang={props.language} />
    return <React.Fragment>
        {props.element}
    </React.Fragment>
}

export default AdminAuthenticatedRoute