import React from "react";
import { IFirebaseContext } from "../../../context/Firebase";
import { PNPRouteProps } from "../../../routing/PNPRoute";
import { PNPUser } from "../../../store/external/types"
import { withHookGroup } from "../../generics/withHooks";
import NoPermissions from "../NoPermissions";

function ProducerAuthenticatedRoute(props: PNPRouteProps & { firebase: IFirebaseContext }) {
    if (props.firebase.appUser === undefined)
        return null;
    if (!props.firebase.appUser || (!props.firebase.appUser.producer && !props.firebase.appUser.admin))
        return <NoPermissions lang={props.language} />
    return <React.Fragment>
        {props.element}
    </React.Fragment>
}

export default withHookGroup<PNPRouteProps>(ProducerAuthenticatedRoute, ['firebase'])