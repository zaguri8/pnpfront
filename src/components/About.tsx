import { useLanguage } from '../context/Language'
import { SECONDARY_WHITE } from '../settings/colors'
import { ABOUT_CONTENT, SIDE } from '../settings/strings'
export default function About() {

    const { lang } = useLanguage()
    return <span dir={SIDE(lang)} style={{ fontSize: '18px', color: SECONDARY_WHITE, minWidth: '300px' }} >
        {ABOUT_CONTENT(lang)}
    </span>
}