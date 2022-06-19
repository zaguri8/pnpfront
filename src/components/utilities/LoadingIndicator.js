import { ThreeDots } from 'react-loader-spinner'
import { BLACK_ELEGANT, ORANGE_GRADIENT_PRIMARY, ORANGE_RED_GRADIENT_BUTTON, PRIMARY_BLACK, SECONDARY_WHITE } from '../../settings/colors';
import bus from '../../assets/gifs/busanimated.gif'
import { useLanguage } from '../../context/Language';
import { LOADING, SIDE } from '../../settings/strings';
import { useEffect, useState } from 'react';
export function LoadingIndicator(props) {
    const { lang } = useLanguage()

    return (<div dir={SIDE(lang)} style={{
        display: props.loading ? 'flex' : 'none',
        background: SECONDARY_WHITE,
        zIndex: '9999',
        padding: '8px',
        border: '2px solid white',
        flexDirection: 'column',
        borderRadius: '8px',
        position: 'fixed',
        top: '0',
        left: '0',
        transform: 'translate(calc(50vw - 50%), calc(50vh - 50%))'
    }}>

        <img style={{ width: '135px' }} src={bus} />

        {/*<ThreeDots ariaLabel='loading-indicator' color={'white'} />*/}
    </div>);
}
export default LoadingIndicator