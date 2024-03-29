import './App.css';
import { ToolBar } from './components/toolbar/Toolbar';
import { CSSProperties, useEffect, useState } from 'react';
import $ from 'jquery'
import { useLoading } from './context/Loading';
import AppMenu from './components/other/AppMenu';
import { useUser } from './context/Firebase';
import { useLanguage } from './context/Language';
import LoadingIndicator from './components/utilityComponents/LoadingIndicator';
import Scanner from './components/scanner/Scanner';
import Footer from './components/footer/Footer';
import PNPRouting from './routing/PNPRouting';
import ImageHeader from './components/imageheader/ImageHeader';
import PNPDialogComponent from './components/dialog/PNPDialogComponent';

const dimStyle = { position: 'fixed', display: 'none', width: '100%', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: '500' } as CSSProperties
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
  const { isLoadingAuth } = useUser()
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
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  const menuToggle = (off: boolean) => {
    if (off) {
      if ($('.dim').css('display') === 'none')
        return;
      toggleMenu();
    } else {
      toggleMenu();
    }
  }
  return (<div>
    <Scanner />
    <AppMenu menuToggle={toggleMenu} />
    <div className='global_dim' style={dimStyle}></div>
    <div className="App">
      {dialogContext.content ? <PNPDialogComponent lang={lang} dialogContext={dialogContext} />
        : null}
      {dialogContext.popoverContent}
      <ToolBar menuToggle={menuToggle} />
      <ImageHeader />
      <LoadingIndicator progress={dialogContext.loadingContent} loading={dialogContext.isLoading || isLoadingAuth} />
      <PNPRouting lang={lang} />
      <Footer />
    </div>
  </div>
  );
}

export default App;
