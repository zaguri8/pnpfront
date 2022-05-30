import { DARKER_BLACK_SELECTED, ORANGE_GRADIENT_PRIMARY, SECONDARY_WHITE } from "./colors"

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
export const fullSubmitButton = { ...submitButton(false), ... { textTransform: 'none', margin: '0px', padding: '8px', width: '75%' } }

export const innerShadow = 'rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset'

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

        ...{ zIndex: '100', width: '100%', ...{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 2px 8px 1px' } },
        ...bgColor(ORANGE_GRADIENT_PRIMARY, { height: '50px' })
    }
}
export const boxShadow = () => {
    return {
        boxShadow: `rgba(0, 0, 0, 0.3) 0px 2px 38px, rgba(0, 0, 0, 0.22) 0px 2px 12px`
    }
}
export const elegantShadow = () => {
    return 'rgba(0, 0, 0, 0.05) 0px 2px 1px, rgba(0, 0, 0, 0.05) 0px 4px 2px, rgba(0, 0, 0, 0.05) 0px 8px 4px, rgba(0, 0, 0, 0.05) 0px 16px 8px, rgba(0, 0, 0, 0.05) 0px 32px 16px'
}



export const muiTextRootInput = "& .MuiOutlinedInput-root"
export const textFieldStyle = (color, anyOtherAttributes) => ({
    root: {
        "& .MuiOutlinedInput-root": {
            background: 'none',
            borderRadius: '32px',
            padding: '0px',
            border: '.8px solid white',
            color: color, ...{
                '& input[type=number]': {
                    '-moz-appearance': 'textfield'
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0
                },
                '& input[type=time]::-webkit-calendar-picker-indicator': {
                    filter: 'invert(200%) sepia(85%) saturate(10%) hue-rotate(356deg) brightness(107%) contrast(117%)'
                },
                '& input[type=date]::-webkit-calendar-picker-indicator': {
                    filter: 'invert(200%) sepia(85%) saturate(10%) hue-rotate(356deg) brightness(107%) contrast(117%)'
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0
                }
            }, ...anyOtherAttributes
        }
    }, noBorder: {
        border: "1px solid red",
        outline: 'none'
    }
})