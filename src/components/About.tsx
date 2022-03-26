import { useLanguage } from '../context/Language'
import { SECONDARY_WHITE } from '../settings/colors'
import { ABOUT_CONTENT } from '../settings/strings'
export default function About() {

    const { lang } = useLanguage()
    return <span style= {{fontSize:'18px',color:SECONDARY_WHITE,minWidth:'300px'}} >
        {ABOUT_CONTENT(lang)}
    </span>
}