import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY, SECONDARY_BLACK } from "../../settings/colors"

export const PageHolder = ({ children, style = {} }) => {
    return <div style={{
        ...{
            width: '100%',
            marginBottom: '120px',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'
        }, ...style
    }}>{children}</div>
}
export const InnerPageHolder = ({ children, style = {} }) => {
    return <div style={{
        ...{
            background: ORANGE_GRADIENT_PRIMARY,
            width: '50%',
            maxWidth: '500px',
            marginTop: '32px',
            minWidth: '200px',
            borderRadius: '12px',
            padding: '32px',
            paddingLeft: '64px',
            paddingRight: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            border: '.5px solid white',
        }, ...style
    }}>{children}</div>
}