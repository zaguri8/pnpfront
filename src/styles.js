import { orangePrimary } from "./colors"

export const bgColor = (color, size) => {
    return {
        backgroundColor: color,
        width: size.width,
        height: size.height
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
        ...bgColor(orangePrimary, { width: '100%', height: '50px' })
    }
}
export const boxShadow = () => {
    return {
        boxShadow: `rgba(0, 0, 0, 0.3) 0px 2px 38px, rgba(0, 0, 0, 0.22) 0px 2px 12px`
    }
}