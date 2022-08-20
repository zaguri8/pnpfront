import { useLanguage } from '../../context/Language'
import { SECONDARY_WHITE } from '../../settings/colors'
import { ABOUT_CONTENT, SIDE, WITHUS } from '../../settings/strings'
export default function About() {

    const { lang } = useLanguage()
    return <span dir={SIDE(lang)} style={{
        fontSize: '12px', transform: 'translateY(20px)',
        maxWidth: '700px',
        textAlign: 'start',
        color: SECONDARY_WHITE
    }} >
        <h2 style = {{fontWeight:'1000', textAlign:'start',padding:'0px',margin:'0px'}}>{WITHUS(lang)}</h2>
        {ABOUT_CONTENT(lang)}
    </span>
}