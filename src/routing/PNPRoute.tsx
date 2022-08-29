import { Suspense } from "react"
import { Route } from "react-router"
import { PageHolder } from "../components/utilityComponents/Holders"
import LoadingIndicator from "../components/utilityComponents/LoadingIndicator"
import AdminAuthenticatedRoute from "../components/utilityComponents/routing/AdminAuthenticationRoute"

import AuthenticatedRoute from "../components/utilityComponents/routing/AuthenticationRoute"
import ProducerAuthenticatedRoute from "../components/utilityComponents/routing/ProducerAuthenticationRoute"
import RegisterRoute from "../components/utilityComponents/routing/RegisterRoute"

export type PNPRouteType = 'admin' | 'auth' | 'producer' | 'normal' | 'register'

export const LazyLoad = (props: { children: any }) => {
    return <Suspense fallback={
        <PageHolder>
            <LoadingIndicator loading={true} />
        </PageHolder>
    }>
        {props.children}
    </Suspense>
}
export type PNPRouteProps = {
    path: string,
    element: any,
    language: string,
    type: PNPRouteType
}
export default function PNPRoute(
    path: string,
    element: any,
    type: PNPRouteType,
    language: any
) {
    if (type === 'register')
        return <Route
            path={path}
            key={location.pathname}
            element={<RegisterRoute {...{ path, element, language, type }} />} />
    if (type === 'admin')
        return <Route
            path={path}
            key={location.pathname}
            element={<AdminAuthenticatedRoute {...{ path, element, language, type }} />} />
    if (type === 'producer')
        return <Route
            path={path}
            key={location.pathname}
            element={<ProducerAuthenticatedRoute {...{ path, element, language, type }} />} />
    if (type === 'auth')
        return <Route
            path={path}
            key={location.pathname}
            element={<AuthenticatedRoute {...{ path, element, language, type }} />} />
    return <Route
        path={path}
        key={location.pathname}
        element={<LazyLoad>
            {element}
        </LazyLoad>} />
} 