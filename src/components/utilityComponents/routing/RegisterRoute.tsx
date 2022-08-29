import { Navigate } from "react-router";
import { IUserContext } from "../../../context/Firebase";
import { LazyLoad, PNPRouteProps } from "../../../routing/PNPRoute";
import { withHookGroup } from "../../generics/withHooks";

function RegisterRoute(props: PNPRouteProps & { user: IUserContext }) {

    if (!props.user.appUser)
        return <LazyLoad>
            {props.element}
        </LazyLoad>
    return <Navigate to={'/'} />
}

export default withHookGroup<PNPRouteProps>(RegisterRoute, ['user'])