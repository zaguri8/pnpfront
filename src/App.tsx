import './App.css';
import { ToolBar } from './components/toolbar/Toolbar';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import $ from 'jquery'
import search from './assets/images/search.png'
import TermsOfService from './components/TermsOfService'
import logo_white from './assets/images/logo_white.png'
import { Dialog, List, ListItem, Button, Stack, CircularProgress, TextField } from '@mui/material';
import { ILoadingContext, useLoading } from './context/Loading';
import Profile from './components/auth/Profile'
import { CLOSE, SIDE, NOTFOUND } from './settings/strings'
import AppMenu from './components/AppMenu';
import { Routes, Route, useNavigate, useLocation } from 'react-router';
import { Navigate } from 'react-router-dom'
import InvitationPage from './components/invitation/InvitationPage';

import { BLACK_ELEGANT, BLACK_ROYAL, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_PINK, PRIMARY_WHITE, RED_ROYAL, SECONDARY_WHITE, TOOLBAR_COLOR } from './settings/colors';
import Home from './components/home/Home';
import { useFirebase } from './context/Firebase';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EventPage from './components/event/EventPage';
import { useLanguage } from './context/Language';
import CreateEvent from './components/event/CreateEvent';
import MyAccount from './components/auth/MyAccount';
import LoadingIndicator from './components/utilities/LoadingIndicator';
import CreateRide from './components/ride/CreateRide';
import MyPayments from './components/payment/MyPayments';
import Test from './components/Test';
import EventStatistics from './components/admin/EventStatistics';
import AdminPanel from './components/admin/AdminPanel';
import WhatsApp from './components/WhatsApp';
import PaymentSuccess from './components/payment/PaymentSuccess'
import SearchRide from './components/search/SearchRide';
import BScanner from './components/scanner/BScanner.js';
import BScanResult from './components/scanner/BScanResult';
import ForgotPass from './components/auth/ForgotPass';
import { useScanner } from './context/ScannerContext';
import { QrReader } from 'react-qr-reader';
import Scanner from './components/scanner/Scanner';
import AdminEventPanel from './components/admin/AdminEventPanel';
import UserStatistics from './components/admin/UserStatistics';
import MyCoins from './components/auth/MyCoins';
import PrivateEventConstruction from './components/event/PrivateEventConstruction';
import InvitationStatistics from './components/admin/InvitationStatistics';
import ManageInvitations from './components/admin/ManageInvitations';
import { useGoogleState } from './context/GoogleMaps';
import Edit from './components/admin/Edit/Edit';
import { PaymentForm } from './components/payment/Payment';
import PrivatePaymentForm from './components/admin/PaymentForm/PrivatePaymentForm';
import GeneratePaymentForm from './components/admin/PaymentForm/GeneratePaymentForm';
import PrivatePaymentConfirmation from './components/admin/PaymentForm/PrivatePaymentConfirmation';
import { useHeaderBackgroundExtension, useHeaderContext } from './context/HeaderContext';
import About from './components/About';
import { makeStyles } from '@mui/styles';
import { textFieldStyle } from './settings/styles';
import Footer from './components/footer/Footer';
import EventPayment from './components/payment/EventPayment';

function ImageHeader() {
  const nav = useNavigate()
  const location = useLocation()

  const useStyles = makeStyles(() => textFieldStyle(PRIMARY_BLACK, { maxHeight: '40px', minWidth: '300px', background: PRIMARY_WHITE }));
  const classes = useStyles()
  const { lang } = useLanguage()
  const { isShowingAbout } = useHeaderContext()
  const { setHeaderBackground, setHeaderAbout } = useHeaderBackgroundExtension()
  return (<div id='header_image_container' className='App-header' style={{
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    position: "relative",
    justifyContent: 'center'
  }}>
    <div className="header_content">
      {isShowingAbout && <About />}
      {isShowingAbout && <Stack
        spacing={1}
        style={{

          transform: 'translateY(40px)'
        }}
        alignItems={'center'}
        direction={'row'}>
        <img

          src={search} style={
            {
              cursor: 'pointer',
              width: '25px', height: '25px', padding: '6px',
              border: '.1px solid whitesmoke',
              background: `linear-gradient(${PRIMARY_PINK},${PRIMARY_ORANGE})`,
              borderRadius: '8px'
            }}
          onClick={() => {
            nav('searchRide', { state: $('#search_home').val() })
          }} />
        <input id="search_home" dir={SIDE(lang)} style={{
          padding: '12px',
          borderRadius: '8px',
          border: 'none',
          minWidth: '250px'
        }} placeholder={lang === 'heb' ? "חפשו אירוע" : 'Search event'} />
      </Stack>}
    </div>
    {/* <img onClick={() => {
      if (location.pathname === '/')
        return
      else nav('/')
    }} id='image-header'
      alt=''
      src={'showingHeaderImage'} style={{
        cursor: 'pointer',
        height: '100px',
        padding: '8px'
      }} /> */}
  </div>);
}

function UNKNOWN(props: { lang: string }) {
  return <h1 style={{ color: SECONDARY_WHITE }}>{NOTFOUND(props.lang)}</h1>;
}



function PNPDialogComponent(props: { lang: string, dialogContext: any }) {


  return (<Dialog dir={SIDE(props.lang)} sx={{
    textAlign: 'center',
    overflowY: 'stretch',
    zIndex: '3000',
    overflowX: 'hidden',
    background: PRIMARY_BLACK
  }} open={props.dialogContext.isDialogOpened}>
    {props.dialogContext.dialogTitle && <div style={{
      display: 'flex',
      color: SECONDARY_WHITE,
      background: PRIMARY_BLACK,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>{props.dialogContext.dialogTitle}</div>}
    <List id='dialog' sx={{
      overflowX: 'hidden',
      background: PRIMARY_BLACK,
      maxHeight: '800px',

      minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {props.dialogContext.content.content}
    </List>
    <ListItem style={{
      marginTop: '0px',
      paddingTop: '8px',
      color: SECONDARY_WHITE,
      background: PRIMARY_BLACK
    }}>
      <Stack style={{ width: '100%' }} alignItems={'center'} spacing={1}>

        {props.dialogContext.dialogBottom && <React.Fragment>
          {props.dialogContext.dialogBottom}
        </React.Fragment>}
        <Button onClick={() => {
          props.dialogContext.closeDialog();
        }} style={{
          width: '100%',
          color: 'white',
          backgroundImage: RED_ROYAL,
          fontFamily: 'Open Sans Hebrew',
          fontSize: '18px'
        }}>{CLOSE(props.lang)}</Button>
      </Stack>
    </ListItem>
  </Dialog>);
}


function App() {
  const [canToggle, setCanToggle] = useState(true)
  const dialogContext = useLoading()
  const { lang } = useLanguage()
  const toggleMenu = (completion?: () => void) => {
    if (!canToggle)
      return
    if ($('.dim').css('display') === 'none') {

      setCanToggle(false)
      dim(true)
      $('#menu').stop().animate({ width: 'toggle', opacity: 'toggle' }, 225, () => {
        setCanToggle(true)
        if (completion !== undefined) {
          completion()
        }
      })
    } else {
      $('#menu').stop().animate({ width: 'toggle', opacity: 'toggle' }, 225, () => {
        dim(false)
        setCanToggle(true)
        if (completion !== undefined) {
          completion()
        }
      })
    }
  }

  const dim = (enable: boolean) => {

    if (enable) {
      $('.dim').css({ 'display': 'block' })
      $('.dim').one('click', () => {
        toggleMenu()
      })
    } else {
      $('.dim').css({ 'display': 'none' })
      $('.dim').off()
    }
  }

  const [resizingScript, setResizingScript] = useState(false)
  useEffect(() => {
    const d = document.createElement('div')
    d.classList.add('dim')
    $('.App').append(d)
    $('#dialog').append(d)
    $('#menu').hide()
    d.style.display = 'none'
    $('.App').on('click', (event) => {
      if (event.target.tagName === 'span') {
        return
      }
    })



    function onResize() {
      const windowWidth = window.outerWidth

      if (windowWidth && windowWidth < 320 && !resizingScript) {
        $('#lang').css('display', 'none')
        setResizingScript(true)
      } else {
        $('#lang').css('display', 'flex')
        setResizingScript(false)
      }
    }


    function onScroll() {

      // if (window.scrollY >= 222) {
      //   $('#toolbar').stop().css('padding', '4')
      //   $('#toolbar').stop().css({ 'position': 'sticky', 'boxShadow': 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px', 'background': 'rgba(0,0,0,0.77)', 'backgroundImage': 'none', 'transition': 'all .2s' })
      //   $('#toolbar').stop().css('top', '0')
      //   $('#arrow_scroll_up').stop().css('display', 'inherit')
      // } else {
      //   $('#toolbar').stop().css('padding', '0')
      //   $('#toolbar').stop().css({ 'position': 'relative', 'boxShadow': 'none', 'background': TOOLBAR_COLOR, 'transition': 'all .2s' })
      //   $('#arrow_scroll_up').css('display', 'none')
      // }
    }
    onResize()
    onScroll()

    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll)


    return () => {

      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)

    }
  }, [])
  const { isAuthenticated, isLoadingAuth, appUser, user } = useFirebase()


  const NoPerms = () => (<div style={{ color: SECONDARY_WHITE }}>{lang === 'heb' ? 'אין לך גישות לעמוד זה' : 'You dont have required permissions to view this page'}</div>)

  return (<div>
    <Scanner />
    <AppMenu menuToggle={toggleMenu} />
    <div className="App">

      {dialogContext.content ? <PNPDialogComponent lang={lang} dialogContext={dialogContext} />
        : null}
      <ToolBar menuToggle={() => toggleMenu()} />
      <ImageHeader />

      <LoadingIndicator loading={dialogContext.isLoading || isLoadingAuth} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/myaccount' element={isLoadingAuth ? <div /> : !isAuthenticated ? <Navigate to='/login' state={{ cachedLocation: '/myaccount' }} /> : <MyAccount />} />
        <Route path='/myaccount/coins' element={isLoadingAuth ? <div /> : !isAuthenticated ? <Navigate to='/login' state={{ cachedLocation: '/myaccount/coins' }} /> : <MyCoins />} />
        <Route path='/myaccount/profile' element={isLoadingAuth ? <div /> : !isAuthenticated ? <Navigate to='/login' state={{ cachedLocation: '/myaccount/profile' }} /> : <Profile />} />
        <Route path='/myaccount/transactions' element={isLoadingAuth ? <div /> : !isAuthenticated ? <Navigate to='/login' state={{ cachedLocation: '/myaccount/transactions' }} /> : <MyPayments />} />
        <Route path='/createevent' element={isLoadingAuth ? <div /> : !isAuthenticated ? <Navigate to='/login' state={{ cachedLocation: '/createevent' }} /> : <CreateEvent />} />
        <Route path='/createprivateevent' element={isLoadingAuth ? <div /> : !isAuthenticated ? <Navigate to='/login' state={{ cachedLocation: '/createprivateevent' }} /> : <PrivateEventConstruction />} />
        <Route path='/createride' element={isLoadingAuth ? <div /> : !isAuthenticated ? <Navigate to='/login' state={{ cachedLocation: '/createride' }} /> : <CreateRide />} />
        <Route path='/login' element={isLoadingAuth ? <div /> : isAuthenticated ? <Navigate to={location.pathname} /> : <Login />} />
        <Route path='/register' element={!isAuthenticated ? <Register /> : <Navigate to={'/'} />} />
        <Route path='/event/:id' element={<EventPage />} />
        <Route path='/event/payment' element={<EventPayment />} />
        <Route path='termsOfService' element={<TermsOfService />} />
        <Route path='/test' element={<GeneratePaymentForm />} />
        <Route path='/scan' element={!isAuthenticated || !appUser || !appUser.producer ? <NoPerms /> : <BScanner />} />
        <Route path='/scanResult' element={!isAuthenticated || !appUser || !appUser.producer ? <NoPerms /> : <BScanResult />} />
        <Route path='/searchRide' element={!isAuthenticated || !appUser ? <Login /> : <SearchRide />} />
        <Route path='/payment/success' element={<PaymentSuccess />} />
        <Route path='/payment/privatePaymentPage/:customerEmail' element={<PrivatePaymentForm />} />
        <Route path='/payment/privatePayment' element={<PrivatePaymentConfirmation />} />
        <Route path='/invitation/:id' element={<InvitationPage />} />
        <Route path='/forgotPass' element={isAuthenticated ? <Navigate to={'/'} /> : <ForgotPass />} />
        <Route path='/adminpanel' element={!isAuthenticated || !appUser || !appUser.admin ? <NoPerms /> : <AdminPanel />} />
        <Route path='/adminpanel/editweb' element={!isAuthenticated || !appUser || !appUser.admin ? <NoPerms /> : <Edit />} />
        <Route path='/adminpanel/invitations' element={!isAuthenticated || !appUser || !appUser.admin ? <NoPerms /> : <ManageInvitations />} />
        <Route path='/adminpanel/invitations/specificinvitation' element={!isAuthenticated || !appUser || !appUser.admin ? <NoPerms /> : <InvitationStatistics />} />
        <Route path='/adminpanel/specificevent' element={!isAuthenticated || !appUser || !appUser.admin ? <NoPerms /> : <AdminEventPanel />} />
        <Route path='/adminpanel/users' element={!isAuthenticated || !appUser || !appUser.admin ? <NoPerms /> : <UserStatistics />} />
        <Route path='/adminpanel/specificevent/eventstatistics' element={!isAuthenticated || !appUser || !appUser.admin ? <NoPerms /> : <EventStatistics />} />
        <Route path='/producerpanel/invitation/:eventId' element={!user || !appUser ? <NoPerms /> : <InvitationStatistics />} />
        <Route path='/*' element={<UNKNOWN lang={lang}></UNKNOWN>}></Route>
      </Routes>
      {/* <WhatsApp /> */}
      <Footer />
    </div>
  </div>
  );
}

export default App;
