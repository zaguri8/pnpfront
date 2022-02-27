import './App.css';
import { ToolBar } from './components/toolbar/Toolbar';
import { useEffect, useLayoutEffect, useState } from 'react';
import $ from 'jquery'
import logo_white from './assets/images/logo_white.png'
import { Dialog, DialogTitle, List, ListItem, Button } from '@mui/material';
import { useLoading } from './context/Loading';
import { CLOSE } from './settings/strings'
import AppMenu from './components/AppMenu';
import { Routes, Route, useNavigate } from 'react-router';
import { Navigate } from 'react-router-dom'
import InvitationPage from './components/invitation/InvitationPage';


import { TOOLBAR_COLOR } from './settings/colors';
import Home from './components/home/Home';
import Auth from './components/auth/Auth';
import { useAuthState } from './context/Firebase';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EventPage from './components/event/EventPage';



function ImageHeader() {
  const nav = useNavigate()
  return (<div className='App-header' style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <img onClick={() => nav('/pnp')} alt='' src={logo_white} style={{
      cursor: 'pointer',
      height: '100px',
      padding: '8px'
    }} />
  </div>);
}


function App() {
  const [canToggle, setCanToggle] = useState(true)
  const dialogContext = useLoading()
  const toggleMenu = () => {
    if (!canToggle)
      return
    if ($('.dim').css('display') === 'none') {

      setCanToggle(false)
      dim(true)
      $('#menu').stop().animate({ width: 'toggle', opacity: 'toggle' }, 325, () => {
        setCanToggle(true)
      })
    } else {
      $('#menu').stop().animate({ width: 'toggle', opacity: 'toggle' }, 325, () => {
        dim(false)
        setCanToggle(true)
      })
    }
  }

  const dim = (enable: boolean) => {
    if (enable) {
      $('.dim').css({ 'display': 'block' })
    } else {
      $('.dim').css({ 'display': 'none' })
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
      if (windowWidth && windowWidth > 700) {
        $('.gallery_header').css('alignSelf', 'flex-end').css('text-align', 'right')
      } else if (windowWidth && windowWidth < 600) {
        $('.gallery_header').css('alignSelf', 'center').css('text-align', 'center')
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

  const { isAuthenticated } = useAuthState()


  return (
    <div>
      {<AppMenu menuToggle={toggleMenu} />}
      <div className="App">
        {dialogContext.content ? <Dialog dir='rtl' sx={{ textAlign: 'center' }} open={dialogContext.isDialogOpened}>
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
                sx={{ width: '100%', color: 'white' }} >{CLOSE('heb')}</Button>
            </ListItem>

          </List>
        </Dialog>
          : null}
        <ImageHeader />
        <ToolBar menuToggle={() => toggleMenu()} />
        <Routes>
          <Route path='/hodash' element={<InvitationPage eventName='החתונה של הגר וגבריאל' eventTime='18:00 בערב' startPoint='דרך רמתיים, הוד השרון' />} />
          <Route path='/tlv' element={<InvitationPage eventName='החתונה של הגר וגבריאל' eventTime='18:00 בערב' startPoint='כיכר רבין,תל אביב' />} />
          <Route path='/pnp' element={isAuthenticated ? <Home /> : <Navigate to={'/login'} />} />
          <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to={'/pnp'} />} />
          <Route path='/event/:id' element={<EventPage />} />
          <Route path='/register' element={!isAuthenticated ? <Register /> : <Navigate to={'/pnp'} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
