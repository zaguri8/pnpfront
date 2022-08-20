import { GoogleMap, LoadScript, useGoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { CSSProperties, useCallback, useEffect } from 'react';
import { useGoogleState } from '../../context/GoogleMaps';
import { PageHolder } from './../utilities/Holders';

export type MapProps = {
    center: { lat: number, lng: number },
    zoom?: number
    content: Element | null | undefined
    containerStyle?: CSSProperties
}
function MapComponent(props: { mapProps: MapProps }) {
    const { google } = useGoogleState()
    const onLoad = useCallback(
        function onLoad(mapInstance: any) {

        }, []
    )
    const defaultStyle = {
        width: '400px',
        height: '400px'
    };
    const defaultZoom = 11
    return <PageHolder>
        {google && <GoogleMap
            center={props.mapProps.center}
            zoom={props.mapProps.zoom ?? defaultZoom}
            mapContainerStyle={props.mapProps.containerStyle ?? defaultStyle}
            onLoad={onLoad}
        >
            {props.mapProps.content}
        </GoogleMap>}
    </PageHolder>
}

export default MapComponent