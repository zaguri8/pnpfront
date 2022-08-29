import { IUserContext } from "../../../context/Firebase";
import { LazyLoad, PNPRouteProps } from "../../../routing/PNPRoute";
import { withHookGroup } from "../../generics/withHooks";
import NoPermissions from "../NoPermissions";

function ProducerAuthenticatedRoute(props: PNPRouteProps & { user: IUserContext }) {
    if (props.user.appUser === undefined)
        return null;
    if (!props.user.appUser || (!props.user.appUser.producer && !props.user.appUser.admin))
        return <NoPermissions lang={props.language} />
    return <LazyLoad>
        {props.element}
    </LazyLoad>
}

export default withHookGroup<PNPRouteProps>(ProducerAuthenticatedRoute, ['user'])