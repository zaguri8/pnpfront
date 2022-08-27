import React from "react"
import { Routes } from "react-router"
import AdminEventPanel from "../components/admin/AdminEventPanel"
import AdminPanel from "../components/admin/AdminPanel"
import Edit from "../components/admin/Edit/Edit"
import EventStatistics from "../components/admin/EventStatistics"
import InvitationStatistics from "../components/admin/InvitationStatistics"
import ManageInvitations from "../components/admin/ManageInvitations"
import GeneratePaymentForm from "../components/admin/PaymentForm/GeneratePaymentForm"
import PrivatePaymentConfirmation from "../components/admin/PaymentForm/PrivatePaymentConfirmation"
import PrivatePaymentForm from "../components/admin/PaymentForm/PrivatePaymentForm"
import PriceStatistics from "../components/admin/PriceStatistics/PriceStatistics"
import PrivateRideRequests from "../components/admin/PrivateRideRequests/PrivateRideRequests"
import SMS from "../components/admin/SMS/SMS"
import UserStatistics from "../components/admin/UserStatistics"
import ForgotPass from "../components/auth/ForgotPass"
import Login from "../components/auth/Login"
import MyAccount from "../components/auth/MyAccount"
import MyCoins from "../components/auth/MyCoins"
import Profile from "../components/auth/Profile"
import Register from "../components/auth/Register"
import CreateEvent from "../components/event/CreateEvent"
import EventPage from "../components/event/EventPage"
import PrivateEventConstruction from "../components/event/PrivateEventConstruction"
import Home from "../components/home/Home"
import InvitationPage from "../components/invitation/InvitationPage"
import LinkRedirect from "../components/linkRedirect/LinkRedirect"
import Barcode from "../components/other/Barcode"
import TermsOfService from "../components/other/TermsOfService"
import Test from "../components/other/Test"
import EventPayment from "../components/payment/EventPayment"
import MyPayments from "../components/payment/MyPayments"
import PaymentSuccess from "../components/payment/PaymentSuccess"
import CreateRide from "../components/ride/CreateRide"
import BScanner from "../components/scanner/BScanner"
import BScanResult from "../components/scanner/BScanResult"
import SearchRide from "../components/search/SearchRide"
import NotFound from "../components/utilityComponents/NotFound"
import pnpRoute from "./PNPRoute"
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
            pnpRoute('/forgotPass', <ForgotPass />, 'normal', props.lang),
            pnpRoute('/*', <NotFound lang={props.lang} />, 'normal', props.lang),
            pnpRoute('/login', <Login />, 'normal', props.lang),
            /* Authenticated Users Routing */
            pnpRoute("/myaccount", <MyAccount />, 'auth', props.lang),
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
            pnpRoute('/generatePaymentLink', <GeneratePaymentForm />, 'admin', props.lang),
            pnpRoute('/adminpanel/sms', <SMS />, 'admin', props.lang),
            pnpRoute('/adminpanel/rideRequests', <PrivateRideRequests />, 'admin', props.lang),
            pnpRoute('/adminpanel', <AdminPanel />, 'admin', props.lang),
            pnpRoute('/adminpanel/editweb', <Edit />, 'admin', props.lang),
            pnpRoute('/adminpanel/invitations', <ManageInvitations />, 'admin', props.lang),
            pnpRoute('/adminpanel/invitations/specificinvitation', <InvitationStatistics />, 'admin', props.lang),
            pnpRoute('/adminpanel/specificevent', <AdminEventPanel />, 'admin', props.lang),
            pnpRoute('/adminpanel/users', <UserStatistics />, 'admin', props.lang),
            pnpRoute('/adminpanel/specificevent/eventstatistics', <EventStatistics />, 'admin', props.lang),
        ]}
    </Routes>
})

export default PNPRouting