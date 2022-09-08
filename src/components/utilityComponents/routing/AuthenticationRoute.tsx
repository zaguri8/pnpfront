import { Navigate, useLocation } from "react-router";
import { IUserContext } from "../../../context/Firebase";
import { LazyLoad, PNPRouteProps } from "../../../routing/PNPRoute";
import { withHookGroup } from "../../generics/withHooks";
import LoadingIndicator from "../LoadingIndicator";

function AuthenticationRoute(props: PNPRouteProps & { user: IUserContext }) {
    const location = useLocation()
    if (props.user.appUser === undefined)
        return <LoadingIndicator loading={true} />;
    if (!props.user.appUser)
        return <Navigate to='/login' state={location.state ? { ...(location.state as any), ...{ cachedLocation: location.pathname } } : { cachedLocation: location.pathname }} />
    return <LazyLoad>
        {props.element}
    </LazyLoad>

}

export default withHookGroup<PNPRouteProps>(AuthenticationRoute, ['user'])