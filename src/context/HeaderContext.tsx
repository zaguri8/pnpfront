


import React, { useEffect, useState } from "react"
import logo from '../assets/images/header.jpeg';
import $ from 'jquery'
import { useLocation } from "react-router";

interface IHeaderContext {
    showingHeaderImage: string
    isShowingAbout: boolean
    setIsShowingAbout: (on: boolean) => void
    setShowingHeaderImage: (image: string) => void
}

const HeaderContext = React.createContext<IHeaderContext | null>(null);


export const HeaderContextProvider = (props: object) => {
    const [showingHeaderImage, setShowingHeaderImage] = useState(logo);
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
            showingHeaderImage, setShowingHeaderImage, setIsShowingAbout, isShowingAbout
        }} {...props} ></HeaderContext.Provider>

}


export const useHeaderBackgroundExtension = () => {
    const location = useLocation()
    function setHeaderBackground(image: string) {
        if ($('.App-header').css('background') !== image) {
            if (location.pathname === '/') {
                $('.App-header').css('background', "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5))," + image)
            } else {
                $('.App-header').css('background', "linear-gradient(rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.1))," + image)
            }
            $('.App-header').css('background-size', 'cover')
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
        setHeaderAbout
    }
}

export const useHeaderContext = () => {
    const context = React.useContext(HeaderContext) as IHeaderContext
    return {
        showingHeaderImage: context?.showingHeaderImage,
        setShowingHeaderImage: context?.setShowingHeaderImage,
        setIsShowingAbout: context?.setIsShowingAbout,
        isShowingAbout: context?.isShowingAbout
    }
}
