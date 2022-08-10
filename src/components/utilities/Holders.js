import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY, SECONDARY_BLACK } from "../../settings/colors"
import { motion } from 'framer-motion'
const animations = {
    initial: { opacity: 0, transform: 'translateY(180px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' },
    exit: { opacity: 0 }
}
export const PageHolder = ({ children, style = {}, transformUp = false}) => {

    return <motion.div
  variants={transformUp ? { ...animations, ...{ animate: { ...animations.animate, transform: 'translateY(-42px)' } } } : animations}
        initial={'initial'}
        animate={'animate'}
        exit={'exit'}
        transition={{ duration: 0.5 }}
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
export const InnerPageHolder = ({ children, style = {}, transformUp = false,transformUpValue=42 }) => {
    return <motion.div
        variants={transformUp ? { ...animations, ...{ animate: { ...animations.animate, transform: `translateY(-${transformUpValue}px)` } } } : animations}
        transition={{ duration: 0.5 }}
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