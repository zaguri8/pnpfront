import './App.css';
import { ToolBar } from './components/toolbar/Toolbar';
import { useLayoutEffect, useState } from 'react';
import $ from 'jquery'
import logo_white from './assets/images/logo_white.png'
import { Dialog, DialogTitle, List, ListItem, Button } from '@mui/material';
import { useLoading } from './context/Loading';
import { CLOSE, SIDE,NOTFOUND } from './settings/strings'
import AppMenu from './components/AppMenu';
import { Routes, Route, useNavigate } from 'react-router';
import { Navigate } from 'react-router-dom'
import InvitationPage from './components/invitation/InvitationPage';

import { TOOLBAR_COLOR } from './settings/colors';
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



function ImageHeader() {
  const nav = useNavigate()

  return (<div className='App-header' style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <img onClick={() => nav('/pnp')} id='image-header' alt='' src={logo_white} style={{
      cursor: 'pointer',
      height: '100px',
      padding: '8px'
    }} />
  </div>);
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

  useLayoutEffect(() => {
    const d = document.createElement('div')
    d.classList.add('dim')
    $('.App').append(d)
    $('#menu').hide()
    d.style.display = 'none'
    $('.App').on('click', (event) => {
      if (event.target.tagName === 'span') {
        return
      }
    })

    function onResize() {
      const windowWidth = window.outerWidth

      if (windowWidth && windowWidth < 320) {
        $('#lang').css('display', 'none')
      } else {
        $('#lang').css('display', 'flex')
      }
    }
    function onScroll() {
      if (window.scrollY >= 222) {
        $('#toolbar').css('padding', '4')
        $('#toolbar').css({ 'position': 'sticky', 'boxShadow': 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px', 'background': 'white', 'backgroundImage': 'none', 'transition': 'all .2s' })
        $('#toolbar').css('top', '0')

      } else {
        $('#toolbar').css('padding', '0')
        $('#toolbar').css({ 'position': 'relative', 'boxShadow': 'none', 'background': TOOLBAR_COLOR, 'transition': 'all .2s' })
      }
    }
    onResize()
    onScroll()
    $(window).on('resize', onResize)
    $(window).on('scroll', onScroll)
  }, [])

  const { isAuthenticated } = useFirebase()


  return (
    <div>
      {<AppMenu menuToggle={toggleMenu} />}
      <div className="App">

        {dialogContext.content ? <Dialog dir={SIDE(lang)} sx={{ textAlign: 'center' }} open={dialogContext.isDialogOpened}>
          <DialogTitle style={{ fontFamily: 'Open Sans Hebrew', background: 'white' }}>{dialogContext.content.title}</DialogTitle>
          <List sx={{
            background: 'white',
            overflowY: 'auto',
            maxHeight: '600px',
            pt: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>

            {dialogContext.content.content}
            <ListItem>
              <Button
                style={{ fontFamily: 'Open Sans Hebrew', fontSize: '18px' }}
                onClick={() => {
                  dialogContext.closeDialog()
                }}
                sx={{ width: '100%', color: 'white' }} >{CLOSE(lang)}</Button>
            </ListItem>

          </List>
        </Dialog>
          : null}
        <ImageHeader />
        <ToolBar menuToggle={() => toggleMenu()} />
        <LoadingIndicator loading={dialogContext.isLoading} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/pnp' element={<Home />} />
          <Route path='/myaccount' element={!isAuthenticated ? <Login /> : <MyAccount />} />
          <Route path='/createevent' element={!isAuthenticated ? <Login/> :  <CreateEvent />} />
          <Route path='/createride' element={!isAuthenticated ? <Login/> :  <CreateRide />} />
          
          <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to={'/pnp'} />} />
          <Route path='/event/:id' element={<EventPage />} />
          <Route path='/invitation/:id' element={<InvitationPage />} />
          <Route path='/register' element={!isAuthenticated ? <Register /> : <Navigate to={'/pnp'} />} />
          <Route path='/*' element={<h1>{NOTFOUND(lang)}</h1>}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
