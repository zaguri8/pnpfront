export function ToolbarItem({ text = '', action = () => { }, image = '', line = false, bold = false, style = {}, id = '' }) {
    return <span className={bold ? '' : 'toolbar_item'} onClick={action} style={{
        ...{
            paddingLeft: '16px',
            paddingRight: '16px',
            fontWeight: '400',
            fontSize: '18px',
            paddingTop:image ? '8px' : '0px',
            cursor: 'pointer',
            textAlign: 'center',
            borderRadius: '8px',
            background: image ? 'none' : 'rgba(0,0,0,0.0)',
            color: 'black',
            maxHeight: 'inherit'
        }, ...style
    }}>
        {text ? text : image ? <img id={id} style={{ height: '18px' }} src={image} /> : ''}
        {line && <hr style={{ borderWidth: '.1px' }} />}
    </span>
}