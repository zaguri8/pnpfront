import './App.css';
import { ToolBar } from './components/toolbar/Toolbar';
import { useEffect, useLayoutEffect, useState } from 'react';
import $ from 'jquery'
import logo_white from './assets/images/logo_white.png'
import AppMenu from './components/AppMenu';
import { RideForm } from './components/ride/RideForm';
import { Gallery } from './components/Gallery';
import { TOOLBAR_COLOR } from './settings/colors';
import { whatsappIcon } from './assets/images';
import SayNoMoreContainer from './components/saynomore/SayNoMoreContainer';
import WhyUsContainer from './components/whyus/WhyUsContainer';
import SectionTitle from './components/SectionTitle';



function WhatsApp() {
  return (<div className={'side_icon'} style={{
    padding: '0px',
    margin: '24px',
    zIndex: '9999',
    bottom: '0',
    right: '0',
    position: 'fixed',
    width: '50px',
    height: '50px'
  }}>
    <img alt='' className={'side_icon'} style={{
      width: '50px',
      height: '50px',
      cursor: 'pointer'
    }} src={whatsappIcon} />
  </div>);
}



function ImageHeader() {
  return (<div className='App-header' style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <img  alt = '' src={logo_white} style={{
      height: '100px',
      padding: '8px'
    }} />
  </div>);
}


function App() {

  const [canToggle, setCanToggle] = useState(true)
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

  useEffect(() => {
  }, [])

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



  const dummy = ['https://www.foundry.com/sites/default/files/styles/teaser_image/public/content-type/events/Thumbnail%20-%20560x314.jpg?itok=Ut22aZzn',
    "https://img1.10bestmedia.com/Images/Photos/232356/p-Final-Hakkasan-LV-Crowd-Image_55_660x440_201404241405.jpg",
    "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/clubbing-party-night-event-video-template-design-ab368aade7af4fb78cf1451b2e8330ad_screen.jpg?ts=1577518856",
    "https://www.foundry.com/sites/default/files/styles/teaser_image/public/content-type/events/Thumbnail%20-%20560x314.jpg?itok=Ut22aZzn",
    "https://www.foundry.com/sites/default/files/styles/teaser_image/public/content-type/events/Thumbnail%20-%20560x314.jpg?itok=Ut22aZzn"]

  return (
    <div>
      {<AppMenu menuToggle={toggleMenu} />}
      <div className="App">
        <ImageHeader />


        <ToolBar menuToggle={() => toggleMenu()} />

        <RideForm />
        <SectionTitle style={{
          padding: '32px',
          fontStyle: 'italic',
          fontWeight: '100',
          fontSize: '42px',
          borderRadius: '2px'
        }} title={'We Say No more !'} />
        <SayNoMoreContainer />
        <SectionTitle style={{ paddingBottom: '0px' }} title={'אירועים קרובים'} />
        <Gallery header='תרבות ופנאי' images={dummy} />
        <Gallery header='מועדונים' images={dummy} />
        <SectionTitle style={{ padding: '42px', margin: '0px' }} title={'? למה לבחור בנו'} />
        <WhyUsContainer />
        <WhatsApp />
      </div>
    </div>
  );
}

export default App;
