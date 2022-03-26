import './App.css';
import { ToolBar } from './components/toolbar/Toolbar';
import { useLayoutEffect, useState } from 'react';
import $ from 'jquery'
import TermsOfService from './components/TermsOfService'
import logo_white from './assets/images/logo_white.png'
import { Dialog, List, ListItem, Button } from '@mui/material';
import { useLoading } from './context/Loading';
import { CLOSE, SIDE, NOTFOUND } from './settings/strings'
import AppMenu from './components/AppMenu';
import { Routes, Route, useNavigate } from 'react-router';
import { Navigate } from 'react-router-dom'
import InvitationPage from './components/invitation/InvitationPage';

import { DARK_BLACK, PRIMARY_BLACK, SECONDARY_WHITE, TOOLBAR_COLOR } from './settings/colors';
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
import Payment from './components/payment/Payment';
import MyPayments from './components/payment/MyPayments';
import Test from './components/Test';
import EventStatistics from './components/admin/EventStatistics';
import AdminPanel from './components/admin/AdminPanel';
import WhatsApp from './components/WhatsApp';
import PaymentSuccess from './components/payment/PaymentSuccess'
import SearchRide from './components/search/SearchRide';

function ImageHeader() {
  const nav = useNavigate()

  return (<div className='App-header' style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <img onClick={() => nav('/')} id='image-header' alt='' src={logo_white} style={{
      cursor: 'pointer',
      height: '100px',
      padding: '8px'
    }} />
  </div>);
}



function UNKNOWN(props: { lang: string }) {
  return <h1>{NOTFOUND(props.lang)}</h1>;
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

  const [scrollingScript, setScrollingScript] = useState(false)
  const [resizingScript, setResizingScript] = useState(false)
  useLayoutEffect(() => {
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

      if (window.scrollY >= 222) {
        $('#toolbar').css('padding', '4')
        $('#toolbar').stop().css({ 'position': 'sticky', 'boxShadow': 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px', 'background': PRIMARY_BLACK, 'backgroundImage': 'none', 'transition': 'all .2s' })
        $('#toolbar').css('top', '0')


      } else {
        $('#toolbar').css('padding', '0')
        $('#toolbar').stop().css({ 'position': 'relative', 'boxShadow': 'none', 'background': TOOLBAR_COLOR, 'transition': 'all .2s' })

      }
    }
    onResize()
    onScroll()
    $(window).on('resize', onResize)
    $(window).on('scroll', onScroll)
  }, [])

  const { isAuthenticated, appUser } = useFirebase()



  return (
    <div>
      {<AppMenu menuToggle={toggleMenu} />}
      <div className="App">

        {dialogContext.content ? <Dialog dir={SIDE(lang)} sx={{ textAlign: 'center', overflowY: 'stretch', overflowX: 'hidden', background: PRIMARY_BLACK }} open={dialogContext.isDialogOpened}>
          {dialogContext.dialogTitle && <div
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }
            }
          >{dialogContext.dialogTitle}</div>}
          <List id='dialog' sx={{
            overflowX: 'hidden',
            background: PRIMARY_BLACK,
            maxHeight: '800px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {dialogContext.content.content}
          </List>
          <ListItem style={{ marginTop: '0px', paddingTop: '0px', color: SECONDARY_WHITE, background: PRIMARY_BLACK, textDecoration: 'underline', }}>
            <Button
              onClick={() => {
                dialogContext.closeDialog()
              }}
              style={{ width: '100%', color: 'white', backgroundImage: DARK_BLACK, fontFamily: 'Open Sans Hebrew', fontSize: '18px' }} >{CLOSE(lang)}</Button>
          </ListItem>
        </Dialog>
          : null}
        <ImageHeader />
        <ToolBar menuToggle={() => toggleMenu()} />
        <LoadingIndicator loading={dialogContext.isLoading} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/myaccount' element={!isAuthenticated ? <Login /> : <MyAccount />} />
          <Route path='/createevent' element={!isAuthenticated ? <Login /> : <CreateEvent />} />
          <Route path='/createride' element={!isAuthenticated ? <Login /> : <CreateRide />} />
          <Route path='/payment' element={<Payment product={{ name: 'Some product', price: '50' }} />} />
          <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to={'/'} />} />
          <Route path='/event/:id' element={<EventPage />} />
          <Route path='termsOfService' element={<TermsOfService />} />


          <Route path='/searchRide' element={!isAuthenticated || !appUser ? <Login /> : <SearchRide />} />
          <Route path='/payment/success' element={<PaymentSuccess />} />
          <Route path='/invitation/:id' element={<InvitationPage />} />
          <Route path='/test' element={<Test />} />
          <Route path='/adminpanel' element={!isAuthenticated || !appUser || !appUser.admin ? <div>{lang === 'heb' ? 'אין לך גישות לעמוד זה' : 'You dont have required permissions to view this page'}</div> : <AdminPanel />} />
          <Route path='/adminpanel/eventstatistics' element={!isAuthenticated || !appUser || !appUser.admin ? <div>{lang === 'heb' ? 'אין לך גישות לעמוד זה' : 'You dont have required permissions to view this page'}</div> : <EventStatistics />} />
          <Route path='/register' element={!isAuthenticated ? <Register /> : <Navigate to={'/'} />} />
          <Route path='/myaccount/transactions' element={!isAuthenticated ? <Login /> : <MyPayments />} />
          <Route path='/*' element={<UNKNOWN lang={lang}></UNKNOWN>}></Route>
        </Routes>
        <WhatsApp />
      </div>
    </div>
  );
}

export default App;
