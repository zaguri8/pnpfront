import './App.css';
import { ToolBar, ToolbarProps } from './components/Toolbar';
import { useEffect, useState } from 'react';
import { boxShadow, flex } from './styles';
import { menuItem_1, menuItem_2, menuItem_3, menuItem_4, menuItem_5 } from './strings';
import $ from 'jquery'
import { ToolbarItem } from './components/ToolbarItem';
import logo from './assets/images/logo_white.png'
import { RideForm } from './components/RideForm';
import { Gallery } from './components/Gallery';
import { orangePrimary } from './colors';
import { CopyRights } from './components/CopyRights';
import { whatsappIcon } from './assets/images';
function AppMenu(props: ToolbarProps) {


  return <div id='menu' style={{
    ...{
      direction: 'rtl',
      'overflow': 'scroll',
      width: '30%',
      padding: '16px',
      position: 'absolute',
      right: '0',
      zIndex: '9999',
      height: '100%'
    },
    ...flex('column', 'center'),
    ...{ background: orangePrimary }
  }}>
    <ToolbarItem image={logo} />

    <ToolbarItem text={menuItem_2('heb')} action={props.menuToggle} style={{ width: '80%' }} />

    <ToolbarItem text={menuItem_3('heb')} action={props.menuToggle} style={{ width: '80%' }} />

    <ToolbarItem text={menuItem_4('heb')} action={props.menuToggle} style={{ width: '80%' }} />
    <ToolbarItem text={menuItem_1('heb')} action={props.menuToggle} style={{ width: '80%' }} />
    <ToolbarItem text={menuItem_5('heb')} action={props.menuToggle} style={{ width: '80%' }} />
    <CopyRights style={{ fontWeight: '100', position: 'absolute', bottom: '0', color: 'white' }} />
  </div>
}
function App() {
  const toggleMenu = () => {
    $('#menu').stop().animate({ height: 'toggle' }, 250);
    $('#logo').stop().animate({ height: 'toggle' }, 250);
    $('#options').stop().animate({ height: 'toggle' }, 250);
  }


  useEffect(() => {
    $(window).scroll(() => {
      if (window.scrollY < 400) {
        $('#toolbar').css('position', 'sticky')
      }
      $("#menu").css("height", ($('body').height()! - $('.App-header').height()! - 32) + 'px');
    })

    $('#options_2').on('click', () => toggleMenu())

    $(window).resize(() => {
      $("#menu").css("height", ($('body').height()! - $('.App-header').height()! - 32) + 'px');
      const windowWidth = window.outerWidth
      if (windowWidth && windowWidth < 900) {
        if (windowWidth < 600) {
          $('.gallery').css('grid-template-columns', '1fr')
          $('.gallery').css('grid-template-rows', '1fr 1fr 1fr 1fr')
        } else {
          $('.gallery').css('grid-template-columns', '1fr 1fr')
          $('.gallery').css('grid-template-rows', '1fr 1fr')
        }
      } else {
        $('.gallery').css('grid-template-columns', '1fr 1fr 1fr 1fr')
        $('.gallery').css('grid-template-rows', '1fr')
      }

      if (windowWidth && windowWidth < 600) {
        $('#options_2').css('display', 'block')
        $('#options').css('display', 'none')
        $('#create_event').css('display', 'none')
        $('#login').css('display', 'none')
        $('#language').css('display', 'none')

        $('#menu').css({ 'width': '100%' })
      } else if ($('#options_2').css('display') === 'block') {

        $('#options_2').css('display', 'none')
        $('#options').css('display', 'block')
        $('#create_event').css('display', 'block')
        $('#login').css('display', 'block')
        $('#language').css('display', 'block')
      }
    })
    var canTog = false
    $('.side_icon').hover(() => {
      if (!canTog)
        return
      canTog = false;
      $('.side_icon').stop().animate({ 'height': '75px', width: '75px' }, 'fast')
    }, () => {
      $('.side_icon').stop().animate({ 'height': '50px', width: '50px' }, 'fast', () => {
        canTog = true
      })

    })
    $('#menu').hide()
  }, [null])

  const dummy = ['https://media.istockphoto.com/photos/we-are-going-to-party-as-if-theres-no-tomorrow-picture-id1279483477?b=1&k=20&m=1279483477&s=170667a&w=0&h=cWwEBw0uErqkzeCHcJnoih7dU_Gr_DnKdYitDgSvhqw=',
    "https://media.istockphoto.com/photos/we-are-going-to-party-as-if-theres-no-tomorrow-picture-id1279483477?b=1&k=20&m=1279483477&s=170667a&w=0&h=cWwEBw0uErqkzeCHcJnoih7dU_Gr_DnKdYitDgSvhqw=", "https://media.istockphoto.com/photos/we-are-going-to-party-as-if-theres-no-tomorrow-picture-id1279483477?b=1&k=20&m=1279483477&s=170667a&w=0&h=cWwEBw0uErqkzeCHcJnoih7dU_Gr_DnKdYitDgSvhqw=", "https://media.istockphoto.com/photos/we-are-going-to-party-as-if-theres-no-tomorrow-picture-id1279483477?b=1&k=20&m=1279483477&s=170667a&w=0&h=cWwEBw0uErqkzeCHcJnoih7dU_Gr_DnKdYitDgSvhqw="]

  return (
    <div className="App">

      <div className='App-header' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
        <img src={logo} style={{ height: '100px', padding: '8px' }} />
      </div>

      {<AppMenu menuToggle={toggleMenu} />}
      <ToolBar menuToggle={() => toggleMenu()} />

      <RideForm />

      <h1 style={{ fontFamily: 'georgia', color: 'white' }}>{'אירועים קרובים'}</h1>
      <Gallery header='תרבות ופנאי' images={dummy} />
      <Gallery header='מועדונים' images={dummy} />


      <div className={'side_icon'} style={{ padding: '0px', margin: '24px', zIndex: '9999', bottom: '0', right: '0', position: 'fixed', width: '50px', height: '50px' }}>
        <img className={'side_icon'} style={{ width: '50px', height: '50px', cursor: 'pointer' }} src={whatsappIcon} />
      </div>
    </div>
  );
}

export default App;
