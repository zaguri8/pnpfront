

import { whatsappIcon } from '../assets/images';

export default function WhatsApp() {
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
        <img alt='' onClick={() => window.open('https://wa.me/972535006117')} className={'side_icon'} style={{
            width: '50px',
            height: '50px',
            cursor: 'pointer'
        }} src={whatsappIcon} />
    </div>);
}
