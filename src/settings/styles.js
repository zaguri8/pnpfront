import { DARKER_BLACK_SELECTED, ORANGE_GRADIENT_PRIMARY } from "./colors"

export const bgColor = (color, size) => {
    return {
        backgroundImage: color,
        width: size.width,
        height: size.height
    }
}

export const submitButton = (margin) => {
    return {
        fontFamily: 'Open Sans Hebrew',
        color: 'white',
        fontSize: '22px',
        margin: margin ? '16px' : 'inherit',
        padding: margin ? '12px' : 'inherit',
        width: '50%',
        alignSelf: 'center',
        borderRadius: '4px',
        backgroundImage: DARKER_BLACK_SELECTED
    }
}

export const flex = (direction, align, justify) => {
    return {
        display: 'flex',
        flexDirection: direction,
        alignItems: align ? align : 'auto',
        justifyContent: justify ? justify : 'auto'
    }
}

export const toolbar = () => {
    return {
        ...flex('row', 'center', 'space-between'),

        ...{ zIndex: '100', width: '100%' },
        ...bgColor(ORANGE_GRADIENT_PRIMARY, { height: '50px' })
    }
}
export const boxShadow = () => {
    return {
        boxShadow: `rgba(0, 0, 0, 0.3) 0px 2px 38px, rgba(0, 0, 0, 0.22) 0px 2px 12px`
    }
}

