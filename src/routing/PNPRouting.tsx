import React from "react"
import { Routes } from "react-router"
import InvitationWorkersManager from "../components/admin/InvitationWorkersManager/InvitationWorkersManager"
import InvitationPageWorkers from "../components/invitation/InvitationPageWorkers"
import pnpRoute from "./PNPRoute"
const AdminEventPanel = React.lazy(() => import("../components/admin/AdminEventPanel"))
const AdminPanel = React.lazy(() => import("../components/admin/AdminPanel"))
const Edit = React.lazy(() => import("../components/admin/Edit/Edit"))
const EventStatistics = React.lazy(() => import("../components/admin/EventStatistics"))
const InvitationStatistics = React.lazy(() => import("../components/admin/InvitationStatistics"))
const ManageInvitations = React.lazy(() => import("../components/admin/ManageInvitations"))
const GeneratePaymentForm = React.lazy(() => import("../components/admin/PaymentForm/GeneratePaymentForm"))
const PrivatePaymentConfirmation = React.lazy(() => import("../components/admin/PaymentForm/PrivatePaymentConfirmation"))
const PrivatePaymentForm = React.lazy(() => import("../components/admin/PaymentForm/PrivatePaymentForm"))
const PriceStatistics = React.lazy(() => import("../components/admin/PriceStatistics/PriceStatistics"))
const PriceStatistics2 = React.lazy(() => import("../components/admin/PriceStatistics/PriceStatistics2"))
const SMS = React.lazy(() => import("../components/admin/SMS/SMS"))
const PrivateRideRequests = React.lazy(() => import("../components/admin/PrivateRideRequests/PrivateRideRequests"))
const UserStatistics = React.lazy(() => import("../components/admin/UserStatistics"))
const ForgotPass = React.lazy(() => import("../components/auth/ForgotPass"))
const Login = React.lazy(() => import("../components/auth/Login"))
const MyAccount = React.lazy(() => import("../components/auth/MyAccount"))
const MyCoins = React.lazy(() => import("../components/auth/MyCoins"))
const Profile = React.lazy(() => import("../components/auth/Profile"))
const Register = React.lazy(() => import("../components/auth/Register"))
const CreateEvent = React.lazy(() => import("../components/event/CreateEvent"))
const EventPage = React.lazy(() => import("../components/event/EventPage"))
const PrivateEventConstruction = React.lazy(() => import("../components/event/PrivateEventConstruction"))
const Home = React.lazy(() => import("../components/home/Home"))
const InvitationPage = React.lazy(() => import("../components/invitation/InvitationPage"))
const LinkRedirect = React.lazy(() => import("../components/linkRedirect/LinkRedirect"))
const Barcode = React.lazy(() => import("../components/other/Barcode"))
const TermsOfService = React.lazy(() => import("../components/other/TermsOfService"))
const Test = React.lazy(() => import("../components/other/Test"))
const EventPayment = React.lazy(() => import("../components/payment/EventPayment"))
const MyPayments = React.lazy(() => import("../components/payment/MyPayments"))
const PaymentSuccess = React.lazy(() => import("../components/payment/PaymentSuccess"))
const CreateRide = React.lazy(() => import("../components/ride/CreateRide"))
const BScanner = React.lazy(() => import("../components/scanner/BScanner"))
const BScanResult = React.lazy(() => import("../components/scanner/BScanResult"))
const SearchRide = React.lazy(() => import("../components/search/SearchRide"))
const NotFound = React.lazy(() => import("../components/utilityComponents/NotFound"))
const PNPRouting = React.memo((props: any) => {

    return <Routes>
        {[
            /* Register Routing */
            pnpRoute('/register', <Register />, 'register', props.lang),
            /* Normal Routing */
            pnpRoute("/", <Home />, 'normal', props.lang),
            pnpRoute("/home", <Home />, 'normal', props.lang),
            pnpRoute('/event/:id', <EventPage />, 'normal', props.lang),
            pnpRoute('/linkRedirect/:id', <LinkRedirect />, 'normal', props.lang),
            pnpRoute('termsOfService', <TermsOfService />, 'normal', props.lang),
            pnpRoute('/payment/privatePaymentPage/:customerEmail', <PrivatePaymentForm />, 'normal', props.lang),
            pnpRoute('/invitation/:id', <InvitationPage />, 'normal', props.lang),
            pnpRoute('/invitationWorkers/:id', <InvitationPageWorkers />, 'auth', props.lang),
            pnpRoute('/forgotPass', <ForgotPass />, 'normal', props.lang),
            pnpRoute('/*', <NotFound lang={props.lang} />, 'normal', props.lang),
            pnpRoute('/login', <Login />, 'normal', props.lang),
            /* Authenticated Users Routing */
            pnpRoute("/myaccount", <MyAccount />, 'auth', props.lang),
            pnpRoute('/myaccount/coins', <MyCoins />, 'auth', props.lang),
            pnpRoute('/myaccount/profile', <Profile />, 'auth', props.lang),
            pnpRoute('/myaccount/transactions', <MyPayments />, 'auth', props.lang),
            pnpRoute('/createevent', <CreateEvent />, 'auth', props.lang),
            pnpRoute('/createprivateevent', <PrivateEventConstruction />, 'auth', props.lang),
            pnpRoute('/createride', <CreateRide />, 'auth', props.lang),
            pnpRoute('/event/payment', <EventPayment />, 'auth', props.lang),
            pnpRoute('/test', <Test />, 'auth', props.lang),
            pnpRoute('/searchRide', <SearchRide />, 'auth', props.lang),
            pnpRoute('/payment/success', <PaymentSuccess />, 'auth', props.lang),
            pnpRoute('/payment/privatePayment', <PrivatePaymentConfirmation />, 'auth', props.lang),
            pnpRoute('/producerpanel/invitation/:eventId', <InvitationStatistics />, 'auth', props.lang),
            pnpRoute('/barcode', <Barcode />, 'auth', props.lang),

            /* Producer Routing */
            pnpRoute('/scan', <BScanner />, 'producer', props.lang),
            pnpRoute('/scanResult', <BScanResult />, 'producer', props.lang),
            /* Admin Routing */
            pnpRoute('/test2', <PriceStatistics />, 'admin', props.lang),
            pnpRoute('/priceStats', <PriceStatistics2 />, 'admin', props.lang),
            pnpRoute('/generatePaymentLink', <GeneratePaymentForm />, 'admin', props.lang),
            pnpRoute('/adminpanel/sms', <SMS />, 'admin', props.lang),
            pnpRoute('/adminpanel/rideRequests', <PrivateRideRequests />, 'admin', props.lang),
            pnpRoute('/adminpanel', <AdminPanel />, 'admin', props.lang),
            pnpRoute('/adminpanel/editweb', <Edit />, 'admin', props.lang),
            pnpRoute('/adminpanel/invitationWorkers/:id', <InvitationWorkersManager />, 'auth', props.lang),
            pnpRoute('/adminpanel/invitations', <ManageInvitations />, 'admin', props.lang),
            pnpRoute('/adminpanel/invitations/specificinvitation', <InvitationStatistics />, 'admin', props.lang),
            pnpRoute('/adminpanel/specificevent', <AdminEventPanel />, 'admin', props.lang),
            pnpRoute('/adminpanel/users', <UserStatistics />, 'admin', props.lang),
            pnpRoute('/adminpanel/specificevent/eventstatistics', <EventStatistics />, 'admin', props.lang),
        ]}
    </Routes>
})

export default PNPRouting