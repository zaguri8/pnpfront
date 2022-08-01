


import React, { useEffect, useState } from "react"
import logo from '../assets/images/header.jpeg';
import $ from 'jquery'
import { useLocation } from "react-router";

interface IHeaderContext {
    isShowingAbout: boolean
    setIsShowingAbout: (on: boolean) => void
}

const HeaderContext = React.createContext<IHeaderContext | null>(null);



type HeaderImage = {
    mobile: string
    desktop: string
}
export const HeaderContextProvider = (props: object) => {
    const [isShowingAbout, setIsShowingAbout] = useState(true);

    const location = useLocation()
    useEffect(() => {
        if (location.pathname === '/') {
            setIsShowingAbout(true)
        } else {
            setIsShowingAbout(false);
        }
    }, [])


    return <HeaderContext.Provider
        value={{
            setIsShowingAbout, isShowingAbout
        }} {...props} ></HeaderContext.Provider>

}


export const useHeaderBackgroundExtension = () => {
    const location = useLocation()
    function hideHeader() {
        $('.App-header').css('min-height', '10vh').css('height', '10vh')
        $('.footer_container').css('transform', 'translateY(30px)')
    }

    function showHeader() {
        $('.App-header').css('min-height', '48vh').css('height', '48vh')
        $('.footer_container').css('transform', 'none')
    }
    function setHeaderBackground(image: string) {
        if ($('.App-header').css('background') !== image) {
            if (location.pathname === '/') {
                $('.App-header').css('background', "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5))," + image)
            } else {
                $('.App-header').css('background', "linear-gradient(rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.1))," + image)
            }
            if (location.pathname === '/') {
                $('.App-header').css('height', '48vh')
            }
            $('.App-header').css('background-color', 'black')
            $('.App-header').css('background-size', 'cover')
            $('.App-header').css('background-position', 'center')
        }
    }

    function setHeaderAbout(on: boolean) {
        if (on) {
            $('.App-header span').css('display', 'inherit')
        } else {
            $('.App-header span').css('display', 'none')
        }
    }
    return {
        setHeaderBackground,
        setHeaderAbout,
        hideHeader,
        showHeader
    }


}

export const useHeaderContext = () => {
    const context = React.useContext(HeaderContext) as IHeaderContext
    return {
        setIsShowingAbout: context?.setIsShowingAbout,
        isShowingAbout: context?.isShowingAbout
    }
}
