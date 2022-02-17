import './App.css';
import { ToolBar, ToolbarProps } from './components/Toolbar';
import { useEffect, useLayoutEffect, useState } from 'react';
import { flex } from './styles';
import $ from 'jquery'
import logo_white from './assets/images/logo_white.png'
import { ToolbarItem } from './components/ToolbarItem';
import AppMenu from './components/AppMenu';
import { RideForm } from './components/RideForm';
import { Gallery } from './components/Gallery';
import { CSSProperties } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { colorPrimary } from './colors';
import { menuIcon_black, whatsappIcon } from './assets/images';
import { FormElementType, RideFormItem } from './components/RideFormItem';
import { TextField } from '@mui/material';
import SayNoMoreContainer from './components/saynomore/SayNoMoreContainer';


function SmallMenu(props: ToolbarProps) {
  const dFlex: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: '24px',
    alignItems: 'center',
    width: '100%'
  }


  const handleDateChange = (newDate: Date) => {
    const day = newDate.getDate()
    const month = newDate.getMonth()
    const year = newDate.getFullYear()
    setValue(`${day}/${month}/${year}`)
  }
  const [value, setValue] = useState('')
  return <div id='small_menu' style={{
    ...{
      borderTopLeftRadius: '42px',
      borderTopRightRadius: '42px',
      overflow: 'hidden',
      marginTop: '16px',
      height: '50%'
    },
    ...flex('column', 'center'),
    ...{ background: 'linear-gradient(brown,orangered,orange)' }
  }}>
    {<h1 style={{ textAlign: 'end', color: 'white' }}>היי חפש יציאה מעניינת</h1>}

    <div style={dFlex}>
      <RideFormItem style={{ width: '100%', fontSize: '24px' }} text='הכל' type='text' options={["תל אביב", "רמת השרון"]} elem={FormElementType.selector} />
    </div>
    <div style={dFlex}>
      <RideFormItem style={{ width: '50%', fontSize: '24px' }} options={["הכל"]} text='הכל' type='text' elem={FormElementType.selector} />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          openTo="day"
          value={'value'}

          shouldDisableDate={(day: Date) => { return false }}
          onChange={(newValue) => {
            handleDateChange(newValue ? newValue : new Date())
          }}
          renderInput={(params) => <TextField onChange={(e) => setValue(e.target.value)} id='date' {...params} {...{ value: value }} />}
        />
      </LocalizationProvider>

    </div>
    <div style={dFlex}>

      <RideFormItem style={{ width: '100%', fontSize: '24px' }} text='מצא לי מקומות בילוי !' type='text' elem={FormElementType.button} />
    </div>

  </div>
}
function App() {

  const toggleMenu = () => {
    if ($('.dim').css('display') === 'none') {

      $('#menu').stop().animate({ width: 'toggle' }, 100, () => dim(true))
    } else {
      $('#menu').stop().animate({ width: 'toggle' }, 100, () => dim(false))
    }
  }

  const dim = (enable: boolean) => {
    if (enable) {
      $('.dim').css('display', 'block')
    } else {
      $('.dim').css('display', 'none')
    }
  }

  useLayoutEffect(() => {
    const d = document.createElement('div')
    d.classList.add('dim')
    $('.App').append(d)
    $('#menu').hide()
    d.style.display = 'none'
    $('.App').on('click', (event) => {
      if (event.target.tagName == 'span') {
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
        $('#toolbar').css({ 'position': 'sticky', 'background': 'white', 'backgroundImage': 'none', 'transition': 'all .2s' })
        $('#toolbar').css('top', '0')

      } else {
        $('#toolbar').css('padding', '0')
        $('#toolbar').css({ 'position': 'relative', 'background': colorPrimary, 'transition': 'all .2s' })
      }
    }

    onResize()
    onScroll()

    $(window).on('resize', onResize)
    $(window).on('scroll', onScroll)
  }, [null])

  const headerStyle: CSSProperties = {
    textAlign: 'right',
    background: 'white',
    fontWeight: 'bold',

    fontFamily: 'Open Sans Hebrew ',
    position: 'relative',
    alignSelf: 'flex-end',
    padding: '32px',
    margin: '0px',
    color: 'black'
  }

  const dummy = ['https://www.foundry.com/sites/default/files/styles/teaser_image/public/content-type/events/Thumbnail%20-%20560x314.jpg?itok=Ut22aZzn',
    "https://img1.10bestmedia.com/Images/Photos/232356/p-Final-Hakkasan-LV-Crowd-Image_55_660x440_201404241405.jpg",
    "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/clubbing-party-night-event-video-template-design-ab368aade7af4fb78cf1451b2e8330ad_screen.jpg?ts=1577518856",
    "https://www.foundry.com/sites/default/files/styles/teaser_image/public/content-type/events/Thumbnail%20-%20560x314.jpg?itok=Ut22aZzn",
    "https://www.foundry.com/sites/default/files/styles/teaser_image/public/content-type/events/Thumbnail%20-%20560x314.jpg?itok=Ut22aZzn"]

  return (
    <div>
      {<AppMenu menuToggle={toggleMenu} />}
      <div className="App">
        <div className='App-header' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
          <img src={logo_white} style={{ height: '100px', padding: '8px' }} />
        </div>


        <ToolBar menuToggle={() => toggleMenu()} />

        <RideForm />

        <SayNoMoreContainer/>
        <h1 style={{ fontFamily: 'Open Sans He', color: 'black' }}>{'אירועים קרובים'}</h1>
   
        {<h2 className='gallery_header' style={headerStyle}>{'תרבות ופנאי'}</h2>}
        <Gallery header='תרבות ופנאי' images={dummy} />

        {<h2 className='gallery_header' style={headerStyle}>{'מועדונים'}</h2>}
        <Gallery header='' images={dummy} />


        <div className={'side_icon'} style={{ padding: '0px', margin: '24px', zIndex: '9999', bottom: '0', right: '0', position: 'fixed', width: '50px', height: '50px' }}>
          <img className={'side_icon'} style={{ width: '50px', height: '50px', cursor: 'pointer' }} src={whatsappIcon} />
        </div>
      </div>
    </div>
  );
}

export default App;
