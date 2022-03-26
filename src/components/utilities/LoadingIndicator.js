import {ThreeDots} from 'react-loader-spinner'
import { PRIMARY_BLACK } from '../../settings/colors';
export function LoadingIndicator(props) {
    return (<div style={{
        display: props.loading ? 'inherit' : 'none',
        background: PRIMARY_BLACK,
        zIndex: '9999',
        padding: '8px',
        borderRadius: '8px',
        position: 'fixed',
        top: '0',
        left: '0',
        transform: 'translate(calc(50vw - 50%), calc(50vh - 50%))'
    }}>
        <ThreeDots ariaLabel='loading-indicator' color={'white'} />
    </div>);
}
export default LoadingIndicator