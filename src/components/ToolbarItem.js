export function ToolbarItem({ text = '', action = () => { }, image = '', align = '', style = {}, id = '' }) {
    return <span id={id} onClick={action} style={{
        ...{
            padding: '8px',
            fontWeight:'100',
            cursor: 'pointer',
            borderRadius: '8px',
            background: image ? 'none' : 'rgba(0,0,0,0.2)',
            color: 'white',
            margin: '8px',
            maxHeight: 'inherit'
        }, ...style
    }}>
        {text ? text : image ? <img style={{ height: '25px' }} src={image} /> : ''}
    </span>
}