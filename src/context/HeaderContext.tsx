


import React, { useEffect, useState } from "react"
import logo from '../assets/images/header.jpeg';
import $ from 'jquery'
import { useLocation } from "react-router";
import { PRIMARY_BLACK } from "../settings/colors";

export interface IHeaderContext {
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

export const useDimExtension = () => {
    return {
        dimOn: () => $('.global_dim').css('display', 'inherit'),
        dimOff: () => $('.global_dim').css('display', 'none'),
    }
}
export interface IDimExtension {
    dimOn: () => void
    dimOff: () => void
}
export interface IBackgroundExtension {
    changeBackgroundColor: (color: string) => void
    resetBackgroundColor: (color: string) => void
}
export const useBackgroundExtension = () => {
    const changeBackgroundColor = (color: string) => {
        $('.App').css('background-color', color)
    }
    const resetBackgroundColor = () => {
        $('.App').css('background-color', PRIMARY_BLACK)

    }
    return {
        changeBackgroundColor,
        resetBackgroundColor
    }
}

export interface IHeaderBackgroundExtension {
    hideHeader: () => void
    showHeader: () => void
    setHeaderAbout: () => void
    setHeaderBackground: (background: string) => void
    setHeaderColor: (color: string) => void
    resetHeaderColor: () => void
}
export const useHeaderBackgroundExtension = () => {
    const location = useLocation()
    function hideHeader() {
        $('.App-header')
            .css('min-height', '10vh')
            .css('height', '10vh')
            .css('background', PRIMARY_BLACK)
            .css('border', 'none')
        $('.footer_container')
            .css('transform', 'translateY(30px)')
    }

    function setHeaderColor(color: string) {
        $('.App-header').css('background', color)

    }
    function resetHeaderColor() {
        $('.App-header').css('background', PRIMARY_BLACK)
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
        showHeader,
        setHeaderColor,
        resetHeaderColor
    }


}

export const useHeaderContext = () => {
    const context = React.useContext(HeaderContext) as IHeaderContext
    return {
        setIsShowingAbout: context?.setIsShowingAbout,
        isShowingAbout: context?.isShowingAbout
    }
}
