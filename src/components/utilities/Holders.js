import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY, SECONDARY_BLACK } from "../../settings/colors"
import { motion } from 'framer-motion'
const animations = {
    initial: { opacity: 0,transform:'none' },
    animate: { opacity: 1 ,transform:'rotate(360deg)'},
    exit: { opacity: 0 }
}
export const PageHolder = ({ children, style = {} }) => {

    return <motion.div
        variants={animations}
        initial={'initial'}
        animate={'animate'}
        exit={'exit'}
        style={{
            ...{
                width: '100%',
                paddingBottom: '120px',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            }, ...style
        }}>{children}</motion.div>
}
export const InnerPageHolder = ({ children, style = {} }) => {
    return <motion.div
        variants={animations}
        initial={'initial'}
        animate={'animate'}
        exit={'exit'} style={{
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
        }}>{children}</motion.div>
}